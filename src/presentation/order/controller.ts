import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { OrderService } from "../services/order.service";
import { CreateOrderDto, PaginationDto, UpdateStatusDto } from "../../domain/dtos";
import { ValidateStatusFurnituresDto } from '../../domain/dtos/order/validate-status-furnitures.dto';
import { UUIDAdaptor } from "../../config/plugin";

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

    getOrdersByCustomer = (req: Request, res: Response) => {
        const { customer } = req.body;

        this.orderService.getOrdersByCustomer(customer.id)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));
    }

    getOrderById = (req: Request, res: Response) => {
        const { id } = req.params;


        if (!UUIDAdaptor.isValidUUID(id)) return res.status(400).json({ ok: false, message: 'The order id is not valid' });

        this.orderService.getOrderById(id)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));
    }

    getFilterOrderByCustomer = (req: Request, res: Response) => {

        const { query = '' } = req.params;
        const [error, paginationDto] = PaginationDto.create(req.query);

        if (error) return res.status(400).json({ ok: false, message: error });

        this.orderService.getFilterOrderByCustomer(query, paginationDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));
    }

    getAllOrders = (req: Request, res: Response) => {

        const [error, paginationDto] = PaginationDto.create(req.query);
        const { status = '' } = req.query as any;

        const validStatus = ['confirm', 'on_way', 'complete', 'rejected', ''];

        if (!validStatus.includes(status)) return res.status(400).json({ ok: false, message: 'The status is not valid' });
        if (error) return res.status(400).json({ ok: false, message: error });

        this.orderService.getAllOrders(paginationDto!, status)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));


    }

    updateStatusOrder = (req: Request, res: Response) => {
        const { user, status } = req.body;
        const { id } = req.params;

        const [error, updateStatusDto] = UpdateStatusDto.create({ order_id: id, status });

        if (error) return res.status(400).json({ ok: false, message: error });

        this.orderService.changeStatus(user.id, updateStatusDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));


    }
}