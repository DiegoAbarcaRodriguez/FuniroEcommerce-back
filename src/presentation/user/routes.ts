import { Router } from "express";
import { UserController } from './controller';
import { UserService } from "../services/user.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class UserRoutes {

    static get routes(): Router {

        const userService = new UserService();
        const userController = new UserController(userService);

        const router = Router();

        router.get('/', userController.getAllUsers);
        router.post('/', AuthMiddleware.validateIsAdmin, userController.createUser);
        router.put('/:id', AuthMiddleware.validateIsAdmin, userController.updateUser);
        router.delete('/:id', AuthMiddleware.validateIsAdmin, userController.deleteUser);

        return router;
    }
}