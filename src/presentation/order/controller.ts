import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { OrderService } from "../services/order.service";
import { CreateOrderDto } from "../../domain/dtos";
import { ValidateStatusFurnituresDto } from '../../domain/dtos/order/validate-status-furnitures.dto';

export class OrderController {
    constructor(private orderService: OrderService) { }

    handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ ok: false, message: error.message });
        }

        console.log(error);
        return res.status(500).json({ ok: false, message: 'Internal error server' });
    }

    createOrder = (req: Request, res: Response) => {

        const [error, createOrderDto] = CreateOrderDto.create(req.body);
        const { session_id } = req.body;

        if (!session_id) return res.status(400).json({ ok: false, message: 'The session_id is missing' });

        if (error) {
            return res.status(400).json({ ok: false, message: error });
        }

        this.orderService.createOrder(createOrderDto!, session_id!)
            .then(result => res.status(201).json(result))
            .catch(error => this.handleError(res, error));
    }

    validateFurnitures = (req: Request, res: Response) => {

        const [error, validateStatusFurnituresDto] = ValidateStatusFurnituresDto.create(req.body);

        if (error) {
            return res.status(400).json({ ok: false, message: error });
        }


        this.orderService.validateFurnitures(validateStatusFurnituresDto!)
            .then(result => res.json(result))
            .catch(error => this.handleError(res, error));
    }

    executePayment = (req: Request, res: Response) => {

        const [error, createOrderDto] = CreateOrderDto.create(req.body);

        if (error) {
            return res.status(400).json({ ok: false, message: error });
        }

        this.orderService.executePayment(createOrderDto!)
            .then(result => res.json(result))
            .catch(error => this.handleError(res, error));
    }

}