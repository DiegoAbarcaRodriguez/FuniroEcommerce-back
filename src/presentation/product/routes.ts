import { Router } from "express";
import { ProductController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ProductService } from "../services/product.service";

export class ProductRoutes {
    static get routes() {
        const router = Router();

        const productService = new ProductService();
        const productController = new ProductController(productService);

        router.post('/', AuthMiddleware.validateIsAdmin, productController.createProduct);


        return router;
    }
}