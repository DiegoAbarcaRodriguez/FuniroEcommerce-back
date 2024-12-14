"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const express_1 = require("express");
const routes_1 = require("./auth/routes");
const routes_2 = require("./user/routes");
const routes_3 = require("./furniture/routes");
const routes_4 = require("./order/routes");
class AppRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        // Definir las rutas
        router.use('/api/auth', routes_1.AuthRoutes.routes);
        router.use('/api/user', routes_2.UserRoutes.routes);
        router.use('/api/furniture', routes_3.FurnitureRoutes.routes);
        router.use('/api/order', routes_4.OrderRoutes.routes);
        return router;
    }
}
exports.AppRoutes = AppRoutes;
