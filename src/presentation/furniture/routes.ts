import { Router } from "express";
import { FurnitureController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { FurnitureService } from "../services/furniture.service";

export class FurnitureRoutes {
    static get routes() {
        const router = Router();

        const productService = new FurnitureService();
        const furnitureController = new FurnitureController(productService);

        router.post('/', AuthMiddleware.validateIsLoggedIn as any, furnitureController.createProduct as any);
        router.get('/', furnitureController.getFurnitures as any);
        router.get('/:term', furnitureController.getOneFurniture as any);
        router.patch('/:term', AuthMiddleware.validateIsLoggedIn as any, furnitureController.updateFurniture as any);
        router.delete('/:term', AuthMiddleware.validateIsLoggedIn as any, furnitureController.deleteFurniture as any);

        //Validators
        router.get('/byModel/:model', furnitureController.getFurnitureByModelNumber as any);
        return router;
    }
}