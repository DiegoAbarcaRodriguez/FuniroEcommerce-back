import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CustomError } from "../../domain/errors/custom.error";
import { CreateUserDto, PaginationDto, UpdateUserDto } from "../../domain/dtos";
import { UUIDAdaptor } from "../../config/plugin";

export class UserController {

    handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ ok: false, message: error.message });
        }

        console.log(error);

        return res.status(500).json({ ok: false, message: 'Internal error server' });
    }

    constructor(private _userService: UserService) { }

    getAllUsers = (req: Request, res: Response) => {
        const { limit, page } = req.query;
        const { user } = req.body;


        const [error, paginationDto] = PaginationDto.create({ limit, page });

        if (error) {
            return res.status(400).json({ ok: false, message: error });
        }

        this._userService.getAllUsers(paginationDto!, user)
            .then(result => res.json(result))
            .catch(error => this.handleError(res, error));

    }

    createUser = (req: Request, res: Response) => {

        const [error, createUserDto] = CreateUserDto.create(req.body);
        const { user } = req.body;

        if (error) {
            return res.status(400).json({ ok: false, message: error });
        }

        this._userService.createUser(createUserDto!, user)
            .then(result => res.status(201).json(result))
            .catch(error => this.handleError(res, error));
    }

    updateUser = (req: Request, res: Response) => {

        const [error, updateUserDto] = UpdateUserDto.create(req.body);
        const { id } = req.params;
        const { user } = req.body;

        if (!UUIDAdaptor.isValidUUID(id)) {
            return res.status(400).json({ ok: false, message: 'The id is not an uuid valid' });
        }

        if (error) {
            return res.status(400).json({ ok: false, message: error });
        }

        this._userService.updateUser(updateUserDto!, id, user)
            .then(result => res.json(result))
            .catch(error => this.handleError(res, error));
    }

    deleteUser = (req: Request, res: Response) => {

        const { id } = req.params;
        const { user } = req.body;

        if (!UUIDAdaptor.isValidUUID(id)) {
            return res.status(400).json({ ok: false, message: 'The id is not an uuid valid' });
        }


        this._userService.deleteUser(id, user)
            .then(result => res.json(result))
            .catch(error => this.handleError(res, error));
    }
}