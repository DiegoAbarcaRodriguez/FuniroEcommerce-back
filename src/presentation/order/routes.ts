import { Router } from "express";
import { OrderService } from "../services/order.service";
import { OrderController } from "./controller";

export class OrderRoutes {
    static get routes() {

        const orderService = new OrderService();
        const orderController = new OrderController(orderService);

        const router = Router();

        router.post('/', orderController.createOrder);
        router.post('/validate-furnitures', orderController.validateFurnitures);

        return router;
    }
}