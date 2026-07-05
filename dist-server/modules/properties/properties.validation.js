"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geoSearchQuerySchema = exports.listPropertiesQuerySchema = exports.updatePropertyStatusSchema = exports.updatePropertySchema = exports.createPropertySchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createPropertySchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3, 'Title must be at least 3 characters'),
        description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
        propertyType: zod_1.z.nativeEnum(client_1.PropertyType),
        listingType: zod_1.z.nativeEnum(client_1.ListingType),
        price: zod_1.z.coerce.number().positive('Price must be positive'),
        area: zod_1.z.coerce.number().positive('Area must be positive'),
        bedrooms: zod_1.z.coerce.number().int().nonnegative(),
        bathrooms: zod_1.z.coerce.number().int().nonnegative(),
        floor: zod_1.z.coerce.number().int().optional(),
        totalFloors: zod_1.z.coerce.number().int().optional(),
        furnishing: zod_1.z.string().optional(),
        amenities: zod_1.z.array(zod_1.z.string()).default([]),
        address: zod_1.z.string().min(5, 'Address must be at least 5 characters'),
        city: zod_1.z.string().min(2, 'City is required'),
        state: zod_1.z.string().min(2, 'State is required'),
        pincode: zod_1.z.string().min(4, 'Pincode is required'),
        latitude: zod_1.z.coerce.number().min(-90).max(90),
        longitude: zod_1.z.coerce.number().min(-180).max(180),
        agentId: zod_1.z.string().optional(),
    }),
});
exports.updatePropertySchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3).optional(),
        description: zod_1.z.string().min(10).optional(),
        propertyType: zod_1.z.nativeEnum(client_1.PropertyType).optional(),
        listingType: zod_1.z.nativeEnum(client_1.ListingType).optional(),
        price: zod_1.z.coerce.number().positive().optional(),
        area: zod_1.z.coerce.number().positive().optional(),
        bedrooms: zod_1.z.coerce.number().int().nonnegative().optional(),
        bathrooms: zod_1.z.coerce.number().int().nonnegative().optional(),
        floor: zod_1.z.coerce.number().int().optional(),
        totalFloors: zod_1.z.coerce.number().int().optional(),
        furnishing: zod_1.z.string().optional(),
        amenities: zod_1.z.array(zod_1.z.string()).optional(),
        address: zod_1.z.string().min(5).optional(),
        city: zod_1.z.string().min(2).optional(),
        state: zod_1.z.string().min(2).optional(),
        pincode: zod_1.z.string().min(4).optional(),
        latitude: zod_1.z.coerce.number().min(-90).max(90).optional(),
        longitude: zod_1.z.coerce.number().min(-180).max(180).optional(),
        agentId: zod_1.z.string().optional(),
        isFeatured: zod_1.z.boolean().optional(),
    }),
});
exports.updatePropertyStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.PropertyStatus),
    }),
});
exports.listPropertiesQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        city: zod_1.z.string().optional(),
        minPrice: zod_1.z.coerce.number().optional(),
        maxPrice: zod_1.z.coerce.number().optional(),
        bedrooms: zod_1.z.coerce.number().optional(),
        bathrooms: zod_1.z.coerce.number().optional(),
        propertyType: zod_1.z.nativeEnum(client_1.PropertyType).optional(),
        listingType: zod_1.z.nativeEnum(client_1.ListingType).optional(),
        amenities: zod_1.z.string().optional(), // Comma-separated
        sort: zod_1.z.enum(['newest', 'price_asc', 'price_desc', 'area_asc', 'area_desc']).optional(),
        limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
        page: zod_1.z.coerce.number().int().min(1).default(1),
    }).passthrough(),
});
exports.geoSearchQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        lat: zod_1.z.coerce.number().min(-90).max(90),
        lng: zod_1.z.coerce.number().min(-180).max(180),
        radius: zod_1.z.coerce.number().positive().default(5), // Radius in km
    }),
});
