import { Router } from "express";
import { UserController } from './controller';
import { UserService } from "../services/user.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class UserRoutes {

    static get routes(): Router {

        const userService = new UserService();
        const userController = new UserController(userService);

        const router = Router();
        router.use(AuthMiddleware.validateIsLoggedIn);
        
        router.get('/', userController.getAllUsers);
        router.post('/', userController.createUser);
        router.put('/:id', userController.updateUser);
        router.delete('/:id', userController.deleteUser);

        return router;
    }
}