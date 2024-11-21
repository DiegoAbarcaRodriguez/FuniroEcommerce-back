"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const express_1 = require("express");
const routes_1 = require("./auth/routes");
class AppRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        // Definir las rutas
        router.use('/api/auth', routes_1.AuthRoutes.routes);
        router.use('/api/users');
        router.use('/api/products');
        router.use('/api/offers');
        router.use('/api/customer');
        return router;
    }
}
exports.AppRoutes = AppRoutes;
