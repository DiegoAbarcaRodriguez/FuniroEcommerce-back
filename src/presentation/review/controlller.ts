import { Request, Response } from "express";
import { ReviewService } from "../services/review.service";
import { CustomError } from "../../domain/errors/custom.error";
import { UUIDAdaptor } from "../../config/plugin";
import { CreateReviewDto } from "../../domain/dtos/review/create-review.dto";
import { PaginationDto } from "../../domain/dtos";

export class ReviewController {

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ ok: false, message: error.message });
        }

        console.log(error);

        return res.status(500).json({ ok: false, message: 'Internal error server' });
    }

    constructor(private _reviewService: ReviewService) { }

    getReviewsByFurnitureId = (req: Request, res: Response) => {

        const { id } = req.params;
        const [error, paginationDto] = PaginationDto.create(req.query);

        if (error) return res.status(400).json({ ok: false, message: error });

        if (!UUIDAdaptor.isValidUUID(id) || !id) return res.status(400).json({ ok: false, message: 'The furniture id provided is not valid' })


        this._reviewService.getReviewByFurnitureId(id, paginationDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));
    }

    createReview = (req: Request, res: Response) => {
        const [error, createReviewDto] = CreateReviewDto.create(req.body);

        if (error) return res.status(400).json({ ok: false, message: error });

        this._reviewService.createReview(createReviewDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));

    }

    getTotalAndAverage = (req: Request, res: Response) => {

        const { id } = req.params;

        if (!UUIDAdaptor.isValidUUID(id)) return res.status(400).json({ ok: false, message: 'The furniture id provided is not valid' });

        this._reviewService.getTotalAndAverage(id)
            .then((resp) => res.json(resp))
            .catch(error => this.handleError(res, error));
    }

    updateReview = (req: Request, res: Response) => {
        const { id } = req.params;

        const [error, createReviewDto] = CreateReviewDto.create(req.body);

        if (error) return res.status(400).json({ ok: false, message: error });
        if (!UUIDAdaptor.isValidUUID) return res.status(400).json({ ok: false, message: 'The review id is not valid' });

        this._reviewService.updateReview(id, createReviewDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));
    }

    deleteReview = (req: Request, res: Response) => {
        const { id } = req.params;

        if (!UUIDAdaptor.isValidUUID(id)) return res.status(400).json({ ok: false, message: 'The review id is not valid' });

        this._reviewService.deleteReview(id)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));
    }
}