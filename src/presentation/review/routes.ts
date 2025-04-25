import { Router } from "express";
import { ReviewService } from "../services/review.service";
import { ReviewController } from "./controlller";

export class ReviewRoutes {
    static get routes(): Router {

        const reviewService = new ReviewService();
        const reviewController = new ReviewController(reviewService);

        const router = Router();

        router.get('/total-average/:id', reviewController.getTotalAndAverage as any);
        router.get('/:id', reviewController.getReviewsByFurnitureId as any);
        router.post('/', reviewController.createReview as any);
        return router;
    }
}