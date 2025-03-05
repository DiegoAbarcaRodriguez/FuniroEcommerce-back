import { Request, Response } from "express";
import { CustomerService } from "../services/customer.service";
import { CustomError } from "../../domain/errors/custom.error";
import { RegularExpAdaptador } from "../../config/plugin";

export class CustomerController {

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ ok: false, message: error.message });
        }

        return res.status(500).json({ ok: false, message: 'Internal error server' });
    }


    constructor(private customerService: CustomerService) { }

    getCustomerByEmail = (req: Request, res: Response) => {

        const { email } = req.params;

        if (!RegularExpAdaptador.email.test(email)) return res.status(400).json({ ok: false, message: 'Email not valid' });

        this.customerService.getCustomerByEmail(email)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));

    }

}