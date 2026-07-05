"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesController = void 0;
const db_1 = require("../../config/db");
const redis_1 = require("../../config/redis");
const response_1 = require("../../utils/response");
const error_handler_1 = require("../../middlewares/error-handler");
const geo_1 = require("../../utils/geo");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../../utils/logger");
class PropertiesController {
    static async createProperty(req, res, next) {
        try {
            if (!req.user) {
                return next(new error_handler_1.AppError('Not authenticated', 401));
            }
            // Check role permissions: SELLER, AGENT, or ADMIN
            if (req.user.role === 'BUYER') {
                return next(new error_handler_1.AppError('Unauthorized: Buyers cannot create property listings', 403));
            }
            const { title, description, propertyType, listingType, price, area, bedrooms, bathrooms, floor, totalFloors, furnishing, amenities, address, city, state, pincode, latitude, longitude, agentId, } = req.body;
            // Validate Agent if specified
            if (agentId) {
                const agentExists = await db_1.prisma.agent.findUnique({ where: { id: agentId } });
                if (!agentExists) {
                    return next(new error_handler_1.AppError('The specified agent does not exist', 400));
                }
            }
            const property = await db_1.prisma.property.create({
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
            if (redis_1.redisClient.isOpen) {
                await redis_1.redisClient.del('properties:featured');
            }
            return (0, response_1.sendSuccess)(res, 'Property listing created successfully', { property }, 201);
        }
        catch (error) {
            return next(error);
        }
    }
    static async listProperties(req, res, next) {
        try {
            const { city, minPrice, maxPrice, bedrooms, bathrooms, propertyType, listingType, amenities, sort, limit = 10, page = 1, isFeatured, } = req.query;
            const skip = (page - 1) * limit;
            const whereClause = { status: 'AVAILABLE' };
            if (city) {
                whereClause.city = { equals: city, mode: 'insensitive' };
            }
            if (minPrice || maxPrice) {
                whereClause.price = {};
                if (minPrice)
                    whereClause.price.gte = parseFloat(minPrice);
                if (maxPrice)
                    whereClause.price.lte = parseFloat(maxPrice);
            }
            if (bedrooms)
                whereClause.bedrooms = parseInt(bedrooms);
            if (bathrooms)
                whereClause.bathrooms = parseInt(bathrooms);
            if (propertyType)
                whereClause.propertyType = propertyType;
            if (listingType)
                whereClause.listingType = listingType;
            if (isFeatured !== undefined)
                whereClause.isFeatured = isFeatured === 'true';
            if (amenities) {
                const amenitiesList = amenities.split(',');
                whereClause.amenities = {
                    array_contains: amenitiesList, // Check json/array contain
                };
            }
            let orderBy = { createdAt: 'desc' }; // default: newest
            if (sort === 'price_asc')
                orderBy = { price: 'asc' };
            else if (sort === 'price_desc')
                orderBy = { price: 'desc' };
            else if (sort === 'area_asc')
                orderBy = { area: 'asc' };
            else if (sort === 'area_desc')
                orderBy = { area: 'desc' };
            // Try caching for general featured listings query
            const isCacheable = isFeatured === 'true' && !city && !minPrice && !maxPrice;
            if (isCacheable && redis_1.redisClient.isOpen) {
                const cached = await redis_1.redisClient.get('properties:featured');
                if (cached) {
                    return (0, response_1.sendSuccess)(res, 'Properties retrieved from cache', JSON.parse(cached));
                }
            }
            const [properties, total] = await db_1.prisma.$transaction([
                db_1.prisma.property.findMany({
                    where: whereClause,
                    orderBy,
                    skip: parseInt(skip),
                    take: parseInt(limit),
                    include: {
                        images: { orderBy: { order: 'asc' } },
                        owner: { select: { name: true, email: true, profileImage: true } },
                        agent: { include: { user: { select: { name: true, profileImage: true } } } },
                    },
                }),
                db_1.prisma.property.count({ where: whereClause }),
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
            if (isCacheable && redis_1.redisClient.isOpen) {
                await redis_1.redisClient.setEx('properties:featured', 3600, JSON.stringify(responseData)); // cache for 1 hour
            }
            return (0, response_1.sendSuccess)(res, 'Properties listed successfully', responseData);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getProperty(req, res, next) {
        try {
            const { id } = req.params;
            const property = await db_1.prisma.property.findUnique({
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
                return next(new error_handler_1.AppError('Property listing not found', 404));
            }
            return (0, response_1.sendSuccess)(res, 'Property details retrieved successfully', { property });
        }
        catch (error) {
            return next(error);
        }
    }
    static async updateProperty(req, res, next) {
        try {
            const { id } = req.params;
            const property = await db_1.prisma.property.findUnique({ where: { id } });
            if (!property) {
                return next(new error_handler_1.AppError('Property not found', 404));
            }
            // Check authorizations (only owner, assigned agent, or admin can update)
            const isOwner = property.ownerId === req.user?.id;
            const isAgent = property.agentId && (await db_1.prisma.agent.findUnique({ where: { id: property.agentId } }))?.userId === req.user?.id;
            const isAdmin = req.user?.role === 'ADMIN';
            if (!isOwner && !isAgent && !isAdmin) {
                return next(new error_handler_1.AppError('Unauthorized to update this property listing', 403));
            }
            const updated = await db_1.prisma.property.update({
                where: { id },
                data: req.body,
            });
            if (redis_1.redisClient.isOpen) {
                await redis_1.redisClient.del('properties:featured');
            }
            return (0, response_1.sendSuccess)(res, 'Property listing updated successfully', { property: updated });
        }
        catch (error) {
            return next(error);
        }
    }
    static async deleteProperty(req, res, next) {
        try {
            const { id } = req.params;
            const property = await db_1.prisma.property.findUnique({ where: { id } });
            if (!property) {
                return next(new error_handler_1.AppError('Property not found', 404));
            }
            // Authorizations checks
            const isOwner = property.ownerId === req.user?.id;
            const isAgent = property.agentId && (await db_1.prisma.agent.findUnique({ where: { id: property.agentId } }))?.userId === req.user?.id;
            const isAdmin = req.user?.role === 'ADMIN';
            if (!isOwner && !isAgent && !isAdmin) {
                return next(new error_handler_1.AppError('Unauthorized to delete this property listing', 403));
            }
            await db_1.prisma.property.delete({ where: { id } });
            if (redis_1.redisClient.isOpen) {
                await redis_1.redisClient.del('properties:featured');
            }
            return (0, response_1.sendSuccess)(res, 'Property listing deleted successfully');
        }
        catch (error) {
            return next(error);
        }
    }
    static async uploadImages(req, res, next) {
        try {
            const { id } = req.params;
            const property = await db_1.prisma.property.findUnique({ where: { id } });
            if (!property) {
                return next(new error_handler_1.AppError('Property not found', 404));
            }
            const files = req.files;
            if (!files || files.length === 0) {
                return next(new error_handler_1.AppError('No files uploaded', 400));
            }
            const imagesData = files.map((file, index) => ({
                propertyId: id,
                url: `/uploads/${file.filename}`,
                isPrimary: index === 0,
                order: index,
            }));
            await db_1.prisma.propertyImage.createMany({
                data: imagesData,
            });
            const updatedProperty = await db_1.prisma.property.findUnique({
                where: { id },
                include: { images: true },
            });
            return (0, response_1.sendSuccess)(res, 'Images uploaded successfully', { property: updatedProperty });
        }
        catch (error) {
            return next(error);
        }
    }
    static async deleteImage(req, res, next) {
        try {
            const { id, imageId } = req.params;
            const image = await db_1.prisma.propertyImage.findFirst({
                where: { id: imageId, propertyId: id },
            });
            if (!image) {
                return next(new error_handler_1.AppError('Image not found for this property', 404));
            }
            // Delete file from filesystem
            const filePath = path_1.default.join(process.cwd(), 'public', image.url);
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    logger_1.logger.warn(`Could not delete file at ${filePath}: ${err.message}`);
                }
            });
            await db_1.prisma.propertyImage.delete({ where: { id: imageId } });
            return (0, response_1.sendSuccess)(res, 'Property image deleted successfully');
        }
        catch (error) {
            return next(error);
        }
    }
    static async searchProperties(req, res, next) {
        try {
            const { query } = req.query;
            if (!query) {
                return next(new error_handler_1.AppError('Search query is required', 400));
            }
            const q = query;
            // Full-text search emulation via ILIKE on key fields
            const properties = await db_1.prisma.property.findMany({
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
            return (0, response_1.sendSuccess)(res, 'Properties search completed', { properties });
        }
        catch (error) {
            return next(error);
        }
    }
    static async nearbyProperties(req, res, next) {
        try {
            const lat = parseFloat(req.query.lat);
            const lng = parseFloat(req.query.lng);
            const radius = parseFloat(req.query.radius) || 5; // Default 5km
            if (isNaN(lat) || isNaN(lng)) {
                return next(new error_handler_1.AppError('Valid lat and lng query params are required', 400));
            }
            // Perform indexing lookup using bounding box first
            const latDegreeKm = 111.0;
            const lngDegreeKm = 111.0 * Math.cos((lat * Math.PI) / 180.0);
            const minLat = lat - radius / latDegreeKm;
            const maxLat = lat + radius / latDegreeKm;
            const minLng = lng - radius / Math.abs(lngDegreeKm);
            const maxLng = lng + radius / Math.abs(lngDegreeKm);
            // Query database within bounding box limits using coordinate indexes
            const candidateProperties = await db_1.prisma.property.findMany({
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
                const distance = (0, geo_1.getDistance)(lat, lng, prop.latitude, prop.longitude);
                return { ...prop, distance };
            })
                .filter((prop) => prop.distance <= radius)
                .sort((a, b) => a.distance - b.distance);
            return (0, response_1.sendSuccess)(res, 'Nearby properties search completed', { properties });
        }
        catch (error) {
            return next(error);
        }
    }
    static async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const property = await db_1.prisma.property.findUnique({ where: { id } });
            if (!property) {
                return next(new error_handler_1.AppError('Property not found', 404));
            }
            // Authorization checks
            const isOwner = property.ownerId === req.user?.id;
            const isAgent = property.agentId && (await db_1.prisma.agent.findUnique({ where: { id: property.agentId } }))?.userId === req.user?.id;
            const isAdmin = req.user?.role === 'ADMIN';
            if (!isOwner && !isAgent && !isAdmin) {
                return next(new error_handler_1.AppError('Unauthorized to update property status', 403));
            }
            const updated = await db_1.prisma.property.update({
                where: { id },
                data: { status },
            });
            if (redis_1.redisClient.isOpen) {
                await redis_1.redisClient.del('properties:featured');
            }
            return (0, response_1.sendSuccess)(res, `Property status updated to ${status}`, { property: updated });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.PropertiesController = PropertiesController;
