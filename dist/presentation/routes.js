"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const express_1 = require("express");
const routes_1 = require("./auth/routes");
const routes_2 = require("./user/routes");
const routes_3 = require("./furniture/routes");
const routes_4 = require("./order/routes");
const routes_5 = require("./review/routes");
const routes_6 = require("./customer/routes");
const routes_7 = require("./cp/routes");
class AppRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        // Definir las rutas
        router.use('/api/auth', routes_1.AuthRoutes.routes);
        router.use('/api/user', routes_2.UserRoutes.routes);
        router.use('/api/furniture', routes_3.FurnitureRoutes.routes);
        router.use('/api/order', routes_4.OrderRoutes.routes);
        router.use('/api/review', routes_5.ReviewRoutes.routes);
        router.use('/api/customer', routes_6.CustomerRoutes.routes);
        router.use('/api/cp', routes_7.CPRoutes.routes);
        return router;
    }
}
exports.AppRoutes = AppRoutes;
