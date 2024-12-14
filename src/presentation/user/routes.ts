import { Router } from "express";
import { UserController } from './controller';
import { UserService } from "../services/user.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class UserRoutes {

    static get routes(): Router {

        const userService = new UserService();
        const userController = new UserController(userService);

        const router = Router();
        router.use(AuthMiddleware.validateIsLoggedIn as any);

        router.get('/', userController.getAllUsers as any);
        router.post('/', userController.createUser as any);
        router.put('/:id', userController.updateUser as any);
        router.delete('/:id', userController.deleteUser as any);

        return router;
    }
}