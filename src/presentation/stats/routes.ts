import { Router } from "express";
import { StatsService } from "../services/stats.service";
import { StatsController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class StatsRoutes {
    static get routes(): Router {
        const router = Router();

        const statsService = new StatsService();
        const statsController = new StatsController(statsService);

        router.use(AuthMiddleware.validateIsLoggedIn as any);

        router.get('/orders', statsController.getStatOrders as any);
        router.get('/totalsByWeek', statsController.getTotalOrdersByWeek as any);
        router.get('/totalsByMonth', statsController.getTotalOrdersByMonth as any);
        router.get('/totalsByYear', statsController.getTotalOrdersByYear as any);


        return router;
    }
}