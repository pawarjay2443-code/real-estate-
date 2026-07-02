import { z } from 'zod';
import { PropertyType, ListingType, PropertyStatus } from '@prisma/client';

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    propertyType: z.nativeEnum(PropertyType),
    listingType: z.nativeEnum(ListingType),
    price: z.coerce.number().positive('Price must be positive'),
    area: z.coerce.number().positive('Area must be positive'),
    bedrooms: z.coerce.number().int().nonnegative(),
    bathrooms: z.coerce.number().int().nonnegative(),
    floor: z.coerce.number().int().optional(),
    totalFloors: z.coerce.number().int().optional(),
    furnishing: z.string().optional(),
    amenities: z.array(z.string()).default([]),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().min(4, 'Pincode is required'),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    agentId: z.string().optional(),
  }),
});

export const updatePropertySchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    propertyType: z.nativeEnum(PropertyType).optional(),
    listingType: z.nativeEnum(ListingType).optional(),
    price: z.coerce.number().positive().optional(),
    area: z.coerce.number().positive().optional(),
    bedrooms: z.coerce.number().int().nonnegative().optional(),
    bathrooms: z.coerce.number().int().nonnegative().optional(),
    floor: z.coerce.number().int().optional(),
    totalFloors: z.coerce.number().int().optional(),
    furnishing: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    address: z.string().min(5).optional(),
    city: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
    pincode: z.string().min(4).optional(),
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
    agentId: z.string().optional(),
    isFeatured: z.boolean().optional(),
  }),
});

export const updatePropertyStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(PropertyStatus),
  }),
});

export const listPropertiesQuerySchema = z.object({
  query: z.object({
    city: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    bedrooms: z.coerce.number().optional(),
    bathrooms: z.coerce.number().optional(),
    propertyType: z.nativeEnum(PropertyType).optional(),
    listingType: z.nativeEnum(ListingType).optional(),
    amenities: z.string().optional(), // Comma-separated
    sort: z.enum(['newest', 'price_asc', 'price_desc', 'area_asc', 'area_desc']).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    page: z.coerce.number().int().min(1).default(1),
  }).passthrough(),
});

export const geoSearchQuerySchema = z.object({
  query: z.object({
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
    radius: z.coerce.number().positive().default(5), // Radius in km
  }),
});
