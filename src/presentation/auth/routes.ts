import { Router } from "express";
import { AuthController } from './controller';
import { AuthService } from "../services/auth.service";

export class AuthRoutes {
    static get routes(): Router {

        const authService = new AuthService();
        const authController = new AuthController(authService);

        const router = Router();

        router.post('/', authController.login);


        return router;
    }
}