import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { OrderService } from "../services/order.service";
import { CreateOrderDto } from "../../domain/dtos";

export class OrderController {
    constructor(private orderService: OrderService) { }

    handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ ok: false, message: error.message });
        }

        console.log(error);
        res.status(500).json({ ok: false, message: 'Internal error server' });
    }

    createOrder = (req: Request, res: Response) => {

        const [error, createOrderDto] = CreateOrderDto.create(req.body);

        if (error) {
            res.status(400).json({ ok: false, message: error });
        }

        this.orderService.createOrder(createOrderDto!)
            .then(result => res.status(201).json(result))
            .catch(error => this.handleError(res, error));
    }

    validateFurnitures = (req: Request, res: Response) => {
        const { furniture_id, quantity } = req.body;

        if (!Array.isArray(furniture_id) || !furniture_id || furniture_id.length === 0) {
            res.status(400).json({ ok: true, message: 'furniture_id is not valid' });
        }

        if (!Array.isArray(quantity) || !quantity || quantity.length === 0) {
            res.status(400).json({ ok: false, message: 'quantity is not valid' });
        }

        if (furniture_id.length !== quantity.length) { 
            res.status(400).json({ ok: false, message: 'quantity and furniture_id are different in length' });
        }


        this.orderService.validateFurnitures(furniture_id, quantity)
            .then(result => res.json(result))
            .catch(error => this.handleError(res, error));
    }
}