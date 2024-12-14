"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const auth_service_1 = require("../services/auth.service");
class AuthRoutes {
    static get routes() {
        const authService = new auth_service_1.AuthService();
        const authController = new controller_1.AuthController(authService);
        const router = (0, express_1.Router)();
        router.post('/', authController.login);
        return router;
    }
}
exports.AuthRoutes = AuthRoutes;
