import { Request, Response } from "express";
import { CustomerAuthService } from "../services/customer-auth.service";
import { CustomError } from "../../domain/errors/custom.error";
import { RegularExpAdaptador, UUIDAdaptor } from "../../config/plugin";
import { LoginCustomerDto, UpdatePasswordDto } from "../../domain/dtos";

export class CustomerController {

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ ok: false, message: error.message });
        }

        console.log(error);
        return res.status(500).json({ ok: false, message: 'Internal error server' });
    }


    constructor(private customerAuthService: CustomerAuthService) { }

    getCustomerByEmail = (req: Request, res: Response) => {

        const { email } = req.params;

        if (!RegularExpAdaptador.email.test(email)) return res.status(400).json({ ok: false, message: 'Email not valid' });

        this.customerAuthService.getCustomerByEmail(email)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));

    }

    checkCustomerStatus = (req: Request, res: Response) => {
        const { customer } = req.body;
        this.customerAuthService.checkCustomerStatus(customer)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));
    }

    loginCustomerAccount = (req: Request, res: Response) => {
        const [error, loginCustomerDto] = LoginCustomerDto.create(req.body);

        if (error) return res.status(400).json({ ok: false, message: error });

        this.customerAuthService.loginCustomerAccount(loginCustomerDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));
    }

    sendEmailRecoverPassword = (req: Request, res: Response) => {

        const { email } = req.body;

        if (!email || !RegularExpAdaptador.email.test(email)) return res.status(400).json({ ok: false, message: 'The email is not valid' });

        this.customerAuthService.sendEmailRecoverPassword(email)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));
    }

    validateTokenPassword = (req: Request, res: Response) => {
        const { id } = req.body;

        this.customerAuthService.validateTokenPassword(id)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));
    }

    updatePassword = (req: Request, res: Response) => {
        const { id } = req.params;

        if (!UUIDAdaptor.isValidUUID(id)) return res.status(400).json({ ok: false, message: 'The id is not valid' });

        const [error, updatePasswordDto] = UpdatePasswordDto.create(req.body);

        if (error) return res.status(400).json({ ok: false, message: error });

        this.customerAuthService.updatePassword(id, updatePasswordDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));
    }

}