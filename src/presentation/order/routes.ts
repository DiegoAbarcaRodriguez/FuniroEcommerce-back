import { Router } from "express";
import { OrderService } from "../services/order.service";
import { OrderController } from "./controller";
import { EmailService } from "../services/email.service";
import { envs } from "../../config/plugin";
import { CustomerAuthMiddleware } from "../middlewares/customer-auth.middleware";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class OrderRoutes {
    static get routes() {

        const emailService = new EmailService(envs.MAILER_SERVICE, envs.MAILER_EMAIL, envs.MAILER_SECRET_KEY);
        const orderService = new OrderService(emailService);
        const orderController = new OrderController(orderService);

        const router = Router();

        router.get('/get-orders', CustomerAuthMiddleware.validateIsLoggedIn as any, orderController.getOrdersByCustomer as any);
        router.get('/get-all-orders', AuthMiddleware.validateIsLoggedIn as any, orderController.getAllOrders as any);
        router.get('/get-order/:query', AuthMiddleware.validateIsLoggedIn as any, orderController.getFilterOrderByCustomer as any);
        router.patch('/update-status/:id', AuthMiddleware.validateIsLoggedIn as any, orderController.updateStatusOrder as any);
        router.get('/from-admin/:id', AuthMiddleware.validateIsLoggedIn as any, orderController.getOrderById as any);
        router.get('/:id', CustomerAuthMiddleware.validateIsLoggedIn as any, orderController.getOrderById as any);
        router.post('/', orderController.createOrder as any);
        router.post('/execute-payment', orderController.executePayment as any);
        router.post('/validate-furnitures', orderController.validateFurnitures as any);

        return router;
    }
}