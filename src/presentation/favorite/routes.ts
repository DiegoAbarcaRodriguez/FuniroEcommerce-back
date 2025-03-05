import { Router } from "express";
import { FavoriteController } from "./controller";
import { FavoriteService } from "../services/favorite.service";

export class FavoriteRoutes {
    static get routes() {
        const router = Router();

        const favoriteService = new FavoriteService();
        const favoriteController = new FavoriteController(favoriteService);

        router.post('', favoriteController.addFavoriteFurniture as any);
        return router;
    }
}