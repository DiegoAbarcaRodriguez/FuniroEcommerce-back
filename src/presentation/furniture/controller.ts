import { Request, Response } from "express";
import { FurnitureService } from "../services/furniture.service";
import { CustomError } from "../../domain/errors/custom.error";
import { CreateFurnitureDto, PaginationDto, UpdateFurnitureDto } from "../../domain/dtos";

export class FurnitureController {

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ ok: false, message: error.message });
        }

        return res.status(500).json({ ok: false, message: 'Internal error server' });
    }


    constructor(private _furnitureService: FurnitureService) { }

    createProduct = (req: Request, res: Response) => {
        console.log(req.body)
        const { user } = req.body;
        const [error, createFurnitureDto] = CreateFurnitureDto.create({
            ...req.body,
            height: +req.body.height,
            width: +req.body.width,
            weight: +req.body.weight,
            warranty_domestic: +req.body.warranty_domestic,
            warranty_general: +req.body.warranty_general,
            max_load: +req.body.max_load,
            discount: +req.body.discount || undefined,
            depth: +req.body.depth || undefined,
            user_fk: user.id
        });

        if (error) {
            return res.status(400).json({ ok: false, message: error });
        }

        this._furnitureService.createFurniture(createFurnitureDto!)
            .then(result => res.status(201).json(result))
            .catch(error => this.handleError(res, error));
    }

    getFurnitures = (req: Request, res: Response) => {
        const { limit = 10, page = 1 } = req.query;
        const [error, paginationDto] = PaginationDto.create({ limit: +limit, page: +page });

        if (error) {
            return res.status(400).json({ ok: false, message: error });
        }

        this._furnitureService.getFurnitures(paginationDto!)
            .then(result => res.json(result))
            .catch(error => this.handleError(res, error));
    }

    getOneFurniture = (req: Request, res: Response) => {
        const { term } = req.params;

        this._furnitureService.getOneFurniture(term)
            .then(result => res.json(result))
            .catch(error => this.handleError(res, error));
    }

    updateFurniture = (req: Request, res: Response) => {
        const [error, updateFurnitureDto] = UpdateFurnitureDto.create(req.body);
        const { term } = req.params;

        if (error) {
            return res.status(400).json({ ok: false, message: error });
        }

        this._furnitureService.updateFurniture(updateFurnitureDto!, term)
            .then(result => res.json(result))
            .catch(error => this.handleError(res, error));
    }

    deleteFurniture = (req: Request, res: Response) => {
        const { term } = req.params;

        this._furnitureService.deleteFurniture(term)
            .then(result => res.json(result))
            .catch(error => this.handleError(res, error));
    }
}