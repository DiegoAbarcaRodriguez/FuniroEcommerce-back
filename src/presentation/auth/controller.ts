import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { CustomError } from "../../domain/errors/custom.error";

export class AuthController {
    constructor(private _authService: AuthService) { }

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ ok: false, message: error.message });
            return;
        }

        res.status(500).json({ ok: false, message: 'Internal error server' });
        return;
    }

    login = (req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.create(req.body);

        if (error) {
            res.status(400).json({ ok: false, message: error });
            return;
        };

        this._authService.authenticate(loginUserDto!)
            .then((result) => res.json(result))
            .catch((error) => this.handleError(res, error));
    }

    verifyLoggingStatus = (req: Request, res: Response) => {

        const { user } = req.body;


        this._authService.checkLogginStatus(user)
            .then(result => res.json(result))
            .catch(error => this.handleError(res, error));
    }


}