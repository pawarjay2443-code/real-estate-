import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { redisClient } from '../../config/redis';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middlewares/error-handler';
import { getDistance } from '../../utils/geo';
import fs from 'fs';
import path from 'path';
import { logger } from '../../utils/logger';

export class PropertiesController {
  static async createProperty(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      // Check role permissions: SELLER, AGENT, or ADMIN
      if (req.user.role === 'BUYER') {
        return next(new AppError('Unauthorized: Buyers cannot create property listings', 403));
      }

      const {
        title,
        description,
        propertyType,
        listingType,
        price,
        area,
        bedrooms,
        bathrooms,
        floor,
        totalFloors,
        furnishing,
        amenities,
        address,
        city,
        state,
        pincode,
        latitude,
        longitude,
        agentId,
      } = req.body;

      // Validate Agent if specified
      if (agentId) {
        const agentExists = await prisma.agent.findUnique({ where: { id: agentId } });
        if (!agentExists) {
          return next(new AppError('The specified agent does not exist', 400));
        }
      }

      const property = await prisma.property.create({
        data: {
          title,
          description,
          propertyType,
          listingType,
          price,
          area,
          bedrooms,
          bathrooms,
          floor,
          totalFloors,
          furnishing,
          amenities: amenities || [],
          address,
          city,
          state,
          pincode,
          latitude,
          longitude,
          ownerId: req.user.id,
          agentId: agentId || null,
          status: 'AVAILABLE',
        },
      });

      // Clear featured properties cache
      if (redisClient.isOpen) {
        await redisClient.del('properties:featured');
      }

      return sendSuccess(res, 'Property listing created successfully', { property }, 201);
    } catch (error) {
      return next(error);
    }
  }

  static async listProperties(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        city,
        minPrice,
        maxPrice,
        bedrooms,
        bathrooms,
        propertyType,
        listingType,
        amenities,
        sort,
        limit = 10,
        page = 1,
        isFeatured,
      } = req.query as any;

      const skip = (page - 1) * limit;

      const whereClause: any = { status: 'AVAILABLE' };

      if (city) {
        whereClause.city = { equals: city, mode: 'insensitive' };
      }

      if (minPrice || maxPrice) {
        whereClause.price = {};
        if (minPrice) whereClause.price.gte = parseFloat(minPrice);
        if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
      }

      if (bedrooms) whereClause.bedrooms = parseInt(bedrooms);
      if (bathrooms) whereClause.bathrooms = parseInt(bathrooms);
      if (propertyType) whereClause.propertyType = propertyType;
      if (listingType) whereClause.listingType = listingType;
      if (isFeatured !== undefined) whereClause.isFeatured = isFeatured === 'true';

      if (amenities) {
        const amenitiesList = amenities.split(',');
        whereClause.amenities = {
          array_contains: amenitiesList, // Check json/array contain
        };
      }

      let orderBy: any = { createdAt: 'desc' }; // default: newest
      if (sort === 'price_asc') orderBy = { price: 'asc' };
      else if (sort === 'price_desc') orderBy = { price: 'desc' };
      else if (sort === 'area_asc') orderBy = { area: 'asc' };
      else if (sort === 'area_desc') orderBy = { area: 'desc' };

      // Try caching for general featured listings query
      const isCacheable = isFeatured === 'true' && !city && !minPrice && !maxPrice;
      if (isCacheable && redisClient.isOpen) {
        const cached = await redisClient.get('properties:featured');
        if (cached) {
          return sendSuccess(res, 'Properties retrieved from cache', JSON.parse(cached));
        }
      }

      const [properties, total] = await prisma.$transaction([
        prisma.property.findMany({
          where: whereClause,
          orderBy,
          skip: parseInt(skip as any),
          take: parseInt(limit as any),
          include: {
            images: { orderBy: { order: 'asc' } },
            owner: { select: { name: true, email: true, profileImage: true } },
            agent: { include: { user: { select: { name: true, profileImage: true } } } },
          },
        }),
        prisma.property.count({ where: whereClause }),
      ]);

      const responseData = {
        properties,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      };

      if (isCacheable && redisClient.isOpen) {
        await redisClient.setEx('properties:featured', 3600, JSON.stringify(responseData)); // cache for 1 hour
      }

      return sendSuccess(res, 'Properties listed successfully', responseData);
    } catch (error) {
      return next(error);
    }
  }

  static async getProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const property = await prisma.property.findUnique({
        where: { id },
        include: {
          images: { orderBy: { order: 'asc' } },
          documents: true,
          owner: { select: { id: true, name: true, email: true, phone: true, profileImage: true } },
          agent: { include: { user: { select: { id: true, name: true, phone: true, profileImage: true } } } },
          reviews: {
            include: { user: { select: { name: true, profileImage: true } } },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!property) {
        return next(new AppError('Property listing not found', 404));
      }

      return sendSuccess(res, 'Property details retrieved successfully', { property });
    } catch (error) {
      return next(error);
    }
  }

  static async updateProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const property = await prisma.property.findUnique({ where: { id } });
      if (!property) {
        return next(new AppError('Property not found', 404));
      }

      // Check authorizations (only owner, assigned agent, or admin can update)
      const isOwner = property.ownerId === req.user?.id;
      const isAgent = property.agentId && (await prisma.agent.findUnique({ where: { id: property.agentId } }))?.userId === req.user?.id;
      const isAdmin = req.user?.role === 'ADMIN';

      if (!isOwner && !isAgent && !isAdmin) {
        return next(new AppError('Unauthorized to update this property listing', 403));
      }

      const updated = await prisma.property.update({
        where: { id },
        data: req.body,
      });

      if (redisClient.isOpen) {
        await redisClient.del('properties:featured');
      }

      return sendSuccess(res, 'Property listing updated successfully', { property: updated });
    } catch (error) {
      return next(error);
    }
  }

  static async deleteProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const property = await prisma.property.findUnique({ where: { id } });
      if (!property) {
        return next(new AppError('Property not found', 404));
      }

      // Authorizations checks
      const isOwner = property.ownerId === req.user?.id;
      const isAgent = property.agentId && (await prisma.agent.findUnique({ where: { id: property.agentId } }))?.userId === req.user?.id;
      const isAdmin = req.user?.role === 'ADMIN';

      if (!isOwner && !isAgent && !isAdmin) {
        return next(new AppError('Unauthorized to delete this property listing', 403));
      }

      await prisma.property.delete({ where: { id } });

      if (redisClient.isOpen) {
        await redisClient.del('properties:featured');
      }

      return sendSuccess(res, 'Property listing deleted successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async uploadImages(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const property = await prisma.property.findUnique({ where: { id } });
      if (!property) {
        return next(new AppError('Property not found', 404));
      }

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return next(new AppError('No files uploaded', 400));
      }

      const imagesData = files.map((file, index) => ({
        propertyId: id,
        url: `/uploads/${file.filename}`,
        isPrimary: index === 0,
        order: index,
      }));

      await prisma.propertyImage.createMany({
        data: imagesData,
      });

      const updatedProperty = await prisma.property.findUnique({
        where: { id },
        include: { images: true },
      });

      return sendSuccess(res, 'Images uploaded successfully', { property: updatedProperty });
    } catch (error) {
      return next(error);
    }
  }

  static async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, imageId } = req.params;

      const image = await prisma.propertyImage.findFirst({
        where: { id: imageId, propertyId: id },
      });

      if (!image) {
        return next(new AppError('Image not found for this property', 404));
      }

      // Delete file from filesystem
      const filePath = path.join(process.cwd(), 'public', image.url);
      fs.unlink(filePath, (err) => {
        if (err) {
          logger.warn(`Could not delete file at ${filePath}: ${err.message}`);
        }
      });

      await prisma.propertyImage.delete({ where: { id: imageId } });

      return sendSuccess(res, 'Property image deleted successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async searchProperties(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.query;
      if (!query) {
        return next(new AppError('Search query is required', 400));
      }

      const q = query as string;

      // Full-text search emulation via ILIKE on key fields
      const properties = await prisma.property.findMany({
        where: {
          status: 'AVAILABLE',
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { city: { contains: q, mode: 'insensitive' } },
            { state: { contains: q, mode: 'insensitive' } },
            { address: { contains: q, mode: 'insensitive' } },
          ],
        },
        include: {
          images: { orderBy: { order: 'asc' } },
        },
      });

      return sendSuccess(res, 'Properties search completed', { properties });
    } catch (error) {
      return next(error);
    }
  }

  static async nearbyProperties(req: Request, res: Response, next: NextFunction) {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const radius = parseFloat(req.query.radius as string) || 5; // Default 5km

      if (isNaN(lat) || isNaN(lng)) {
        return next(new AppError('Valid lat and lng query params are required', 400));
      }

      // Perform indexing lookup using bounding box first
      const latDegreeKm = 111.0;
      const lngDegreeKm = 111.0 * Math.cos((lat * Math.PI) / 180.0);

      const minLat = lat - radius / latDegreeKm;
      const maxLat = lat + radius / latDegreeKm;
      const minLng = lng - radius / Math.abs(lngDegreeKm);
      const maxLng = lng + radius / Math.abs(lngDegreeKm);

      // Query database within bounding box limits using coordinate indexes
      const candidateProperties = await prisma.property.findMany({
        where: {
          status: 'AVAILABLE',
          latitude: { gte: minLat, lte: maxLat },
          longitude: { gte: minLng, lte: maxLng },
        },
        include: {
          images: { orderBy: { order: 'asc' } },
        },
      });

      // Filter candidates using precise Haversine distance
      const properties = candidateProperties
        .map((prop) => {
          const distance = getDistance(lat, lng, prop.latitude, prop.longitude);
          return { ...prop, distance };
        })
        .filter((prop) => prop.distance <= radius)
        .sort((a, b) => a.distance - b.distance);

      return sendSuccess(res, 'Nearby properties search completed', { properties });
    } catch (error) {
      return next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const property = await prisma.property.findUnique({ where: { id } });
      if (!property) {
        return next(new AppError('Property not found', 404));
      }

      // Authorization checks
      const isOwner = property.ownerId === req.user?.id;
      const isAgent = property.agentId && (await prisma.agent.findUnique({ where: { id: property.agentId } }))?.userId === req.user?.id;
      const isAdmin = req.user?.role === 'ADMIN';

      if (!isOwner && !isAgent && !isAdmin) {
        return next(new AppError('Unauthorized to update property status', 403));
      }

      const updated = await prisma.property.update({
        where: { id },
        data: { status },
      });

      if (redisClient.isOpen) {
        await redisClient.del('properties:featured');
      }

      return sendSuccess(res, `Property status updated to ${status}`, { property: updated });
    } catch (error) {
      return next(error);
    }
  }
}
