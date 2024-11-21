import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CustomError } from "../../domain/errors/custom.error";
import { CreateUserDto, PaginationDto, UpdateUserDto } from "../../domain/dtos";

export class UserController {

    handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            res.json(error.statusCode).json({ ok: false, message: error.message });
        }

        res.status(500).json({ ok: false, message: 'Internal error server' });
    }

    constructor(private _userService: UserService) { }

    getAllUsers = (req: Request, res: Response) => {
        const { limit, page } = req.query;

        const [error, paginationDto] = PaginationDto.create({ limit, page });

        if (error) {
            res.status(400).json({ ok: false, message: error });
        }

        this._userService.getAllUsers(paginationDto!)
            .then(result => res.json(result))
            .catch(error => this.handleError(res, error));

    }

    createUser = (req: Request, res: Response) => {

        const [error, createUserDto] = CreateUserDto.create(req.body);

        if (error) {
            res.status(400).json({ ok: false, message: error });
        }

        this._userService.createUser(createUserDto!, +req.body.user.id)
            .then(result => res.status(201).json(result))
            .catch(error => this.handleError(res, error));
    }

    updateUser = (req: Request, res: Response) => {

        const [error, updateUserDto] = UpdateUserDto.create(req.body);
        const { id } = req.params;

        if (error) {
            res.status(400).json({ ok: false, message: error });
        }

        this._userService.updateUser(updateUserDto!, +id, +req.body.user.id)
            .then(result => res.json(result))
            .catch(error => this.handleError(res, error));
    }

    deleteUser = (req: Request, res: Response) => {

        const { id } = req.params;

        this._userService.deleteUser(+id)
            .then(result => res.json(result))
            .catch(error => this.handleError(res, error));
    }
}