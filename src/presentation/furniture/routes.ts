import { Router } from "express";
import { FurnitureController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { FurnitureService } from "../services/furniture.service";

export class FurnitureRoutes {
    static get routes() {
        const router = Router();

        const productService = new FurnitureService();
        const furnitureController = new FurnitureController(productService);

        router.post('/', AuthMiddleware.validateIsAdmin, furnitureController.createProduct);
        router.get('/', furnitureController.getFurnitures);
        router.get('/:term', furnitureController.getOneFurniture);

        return router;
    }
}