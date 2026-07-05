"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// Protect all admin routes to authenticated admin users only
router.use(auth_1.authenticate, (0, auth_1.authorize)('ADMIN'));
router.get('/users', admin_controller_1.AdminController.listUsers);
router.get('/properties', admin_controller_1.AdminController.listProperties);
router.patch('/properties/:id/approve', admin_controller_1.AdminController.approveProperty);
router.get('/analytics', admin_controller_1.AdminController.getAnalytics);
router.delete('/users/:id', admin_controller_1.AdminController.deleteUser);
exports.default = router;
