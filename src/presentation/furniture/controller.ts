import { Request, Response } from "express";
import { FurnitureService } from "../services/furniture.service";
import { CustomError } from "../../domain/errors/custom.error";
import { CreateFurnitureDto } from "../../domain/dtos";

export class FurnitureController {

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ ok: false, message: error.message });
        }

        res.status(500).json({ ok: false, message: 'Internal error server' });
    }


    constructor(private _furnitureService: FurnitureService) { }

    createProduct = (req: Request, res: Response) => {
        const [error, createFurnitureDto] = CreateFurnitureDto.create({
            ...req.body,
            height: +req.body.height,
            width: +req.body.width,
            weight: +req.body.weight,
            warranty_domestic: +req.body.warranty_domestic,
            warranty_general: +req.body.warranty_general,
            max_load: +req.body.max_load,
            discount: +req.body.discount || undefined,
            depth: +req.body.depth || undefined
        });

        if (error) {
            res.status(400).json({ ok: false, message: error });
        }

        this._furnitureService.createFurniture(createFurnitureDto!)
            .then(result => res.status(201).json(result))
            .catch(error => this.handleError(res, error));
    }
}