"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const error_handler_1 = require("./middlewares/error-handler");
const rate_limit_1 = require("./middlewares/rate-limit");
const logger_1 = require("./utils/logger");
const swagger_json_1 = __importDefault(require("./config/swagger.json"));
// Import Routes
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const users_routes_1 = __importDefault(require("./modules/users/users.routes"));
const agents_routes_1 = __importDefault(require("./modules/agents/agents.routes"));
const properties_routes_1 = __importDefault(require("./modules/properties/properties.routes"));
const inquiries_routes_1 = __importDefault(require("./modules/inquiries/inquiries.routes"));
const bookings_routes_1 = __importDefault(require("./modules/bookings/bookings.routes"));
const reviews_routes_1 = __importDefault(require("./modules/reviews/reviews.routes"));
const favorites_routes_1 = __importDefault(require("./modules/favorites/favorites.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const notifications_routes_1 = __importDefault(require("./modules/notifications/notifications.routes"));
const app = (0, express_1.default)();
// Security Middlewares
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false, // Allows displaying local images in frontend
}));
app.use((0, cors_1.default)());
// General Rate Limiter
app.use('/api/', rate_limit_1.apiLimiter);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request Logging
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use((0, morgan_1.default)(morganFormat, {
    stream: { write: (message) => logger_1.logger.http(message.trim()) },
}));
// Serve static uploads
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'public/uploads')));
// Swagger UI Documentation Route
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'UP',
        timestamp: new Date(),
        uptime: process.uptime(),
    });
});
// Register API Module Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', users_routes_1.default);
app.use('/api/agents', agents_routes_1.default);
app.use('/api/properties', properties_routes_1.default);
app.use('/api/inquiries', inquiries_routes_1.default);
app.use('/api/bookings', bookings_routes_1.default);
app.use('/api/reviews', reviews_routes_1.default);
app.use('/api/favorites', favorites_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/notifications', notifications_routes_1.default);
// Catch-all route for unmatched paths
app.use('*', (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});
// Global Centralized Error Handler
app.use(error_handler_1.errorHandler);
exports.default = app;
