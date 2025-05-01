import { Router } from "express";
import { ReviewService } from "../services/review.service";
import { ReviewController } from "./controlller";
import { CustomerAuthMiddleware } from '../middlewares/customer-auth.middleware';

export class ReviewRoutes {
    static get routes(): Router {

        const reviewService = new ReviewService();
        const reviewController = new ReviewController(reviewService);

        const router = Router();

        router.get('/total-average/:id', reviewController.getTotalAndAverage as any);
        router.get('/:id', reviewController.getReviewsByFurnitureId as any);
        router.post('/', CustomerAuthMiddleware.validateIsLoggedIn as any, reviewController.createReview as any);
        router.put('/update/:id', CustomerAuthMiddleware.validateIsLoggedIn as any, reviewController.updateReview as any);
        router.delete('/delete/:id', CustomerAuthMiddleware.validateIsLoggedIn as any, reviewController.deleteReview as any);
        return router;
    }
}