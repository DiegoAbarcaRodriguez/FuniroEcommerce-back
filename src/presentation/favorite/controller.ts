import { Request, Response } from "express";
import { FavoriteService } from "../services/favorite.service";
import { CustomError } from "../../domain/errors/custom.error";
import { CreateFavoriteDto } from "../../domain/dtos";

export class FavoriteController {

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ ok: false, message: error.message });
        }

        return res.status(500).json({ ok: false, message: 'Internal error server' });
    }

    constructor(private favoriteService: FavoriteService) { }

    addFavoriteFurniture(req: Request, res: Response) {

        const { customer_id, furniture_id } = req.body;

        const [error, createFavoriteDto] = CreateFavoriteDto.create({ customer_id, furniture_id });

        if (error) return res.status(400).json({ ok: false, message: error });


        this.favoriteService.addFavoriteFurniture(createFavoriteDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));
    }
}