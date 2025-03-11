import { Router } from "express";
import { CPController } from "./controller";
import { CPService } from "../services/cp.service";

export class CPRoutes {
    static get routes(): Router {

        const cpService = new CPService();
        const cpController = new CPController(cpService);

        const router = Router();

        router.get('/:type/:cp', cpController.getLocationFromCp as any);


        return router;
    }
}