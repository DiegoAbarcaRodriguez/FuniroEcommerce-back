import { Router } from "express";
import { FurnitureController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { FurnitureService } from "../services/furniture.service";

export class FurnitureRoutes {
    static get routes() {
        const router = Router();

        const productService = new FurnitureService();
        const furnitureController = new FurnitureController(productService);

        router.post('/', AuthMiddleware.validateIsLoggedIn as any, furnitureController.createProduct);
        router.get('/', furnitureController.getFurnitures);
        router.get('/:term', furnitureController.getOneFurniture);
        router.patch('/:term', AuthMiddleware.validateIsLoggedIn as any, furnitureController.updateFurniture);
        router.delete('/:term', AuthMiddleware.validateIsLoggedIn as any, furnitureController.deleteFurniture);

        return router;
    }
}