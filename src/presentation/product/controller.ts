import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { CustomError } from "../../domain/errors/custom.error";

export class ProductController {

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ ok: false, message: error.message });
        }

        res.status(500).json({ ok: false, message: 'Internal error server' });
    }


    constructor(private _productService: ProductService) { }

    createProduct = (req: Request, res: Response) => {
        this._productService.createProduct()
            .then(result => res.status(201).json(result))
            .catch(error => this.handleError(res, error));
    }
}