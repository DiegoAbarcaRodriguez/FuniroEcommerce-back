import { Router } from "express";
import { CustomerController } from "./controller";
import { CustomerAuthService } from "../services/customer-auth.service";
import { CustomerAuthMiddleware } from "../middlewares/customer-auth.middleware";
import { EmailService } from "../services/email.service";
import { envs } from "../../config/plugin";
import { ValidateTokenMiddleware } from "../middlewares/validate-token.middleware";

export class CustomerRoutes {
    static get routes(): Router {
        const router = Router();

        const emailService = new EmailService(envs.MAILER_SERVICE, envs.MAILER_EMAIL, envs.MAILER_SECRET_KEY);
        const customerAuthService = new CustomerAuthService(emailService);
        const customerController = new CustomerController(customerAuthService);

        router.get('/check-status', CustomerAuthMiddleware.validateIsLoggedIn as any, customerController.checkCustomerStatus as any);
        router.get('/validate-token', ValidateTokenMiddleware.validateToken as any, customerController.validateTokenPassword as any);
        router.get('/:email', customerController.getCustomerByEmail as any);
        router.post('/login', customerController.loginCustomerAccount as any);
        router.post('/send-email', customerController.sendEmailRecoverPassword as any);
        router.post('/update-password/:id', customerController.updatePassword as any);
        

        return router;
    }
}