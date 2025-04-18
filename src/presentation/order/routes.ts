import { Router } from "express";
import { OrderService } from "../services/order.service";
import { OrderController } from "./controller";
import { EmailService } from "../services/email.service";
import { envs } from "../../config/plugin";

export class OrderRoutes {
    static get routes() {

        const emailService = new EmailService(envs.MAILER_SERVICE, envs.MAILER_EMAIL, envs.MAILER_SECRET_KEY);
        const orderService = new OrderService(emailService);
        const orderController = new OrderController(orderService);

        const router = Router();

        router.post('/', orderController.createOrder as any);
        router.post('/execute-payment', orderController.executePayment as any);
        router.post('/validate-furnitures', orderController.validateFurnitures as any);

        return router;
    }
}