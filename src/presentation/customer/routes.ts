import { Router } from "express";
import { CustomerController } from "./controller";
import { CustomerService } from "../services/customer.service";

export class CustomerRoutes {
    static get routes(): Router {
        const router = Router();

        const customerService = new CustomerService();
        const customerController = new CustomerController(customerService);

        router.get('/:email', customerController.getCustomerByEmail as any);

        return router;
    }
}