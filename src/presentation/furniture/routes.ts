import { Router } from "express";
import { FurnitureController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { FurnitureService } from "../services/furniture.service";

export class FurnitureRoutes {
    static get routes() {
        const router = Router();

        const productService = new FurnitureService();
        const furnitureController = new FurnitureController(productService);

        router.post('/', (req, res, next) => AuthMiddleware.validateIsLoggedIn(req, res, next, false), furnitureController.createProduct);
        router.get('/', furnitureController.getFurnitures);
        router.get('/:term', furnitureController.getOneFurniture);
        router.patch('/:term', (req, res, next) => AuthMiddleware.validateIsLoggedIn(req, res, next, false), furnitureController.updateFurniture);
        router.delete('/:term', (req, res, next) => AuthMiddleware.validateIsLoggedIn(req, res, next, false), furnitureController.deleteFurniture);

        return router;
    }
}