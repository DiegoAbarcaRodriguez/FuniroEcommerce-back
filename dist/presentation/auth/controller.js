"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const login_user_dto_1 = require("../../domain/auth/login-user.dto");
const custom_error_1 = require("../../domain/errors/custom.error");
class AuthController {
    constructor(_authService) {
        this._authService = _authService;
        this.handleError = (res, error) => {
            if (error instanceof custom_error_1.CustomError) {
                res.json(error.statusCode).json({ ok: false, message: error.message });
            }
            res.status(500).json({ ok: false, message: 'Internal error server' });
        };
        this.login = (req, res) => {
            const [error, loginUserDto] = login_user_dto_1.LoginUserDto.create(req.body);
            if (error)
                res.status(400).json({ ok: false, message: error });
            this._authService.authenticate(loginUserDto)
                .then(() => res.json({ ok: true, message: 'Authenticated succesfully' }))
                .catch((error) => this.handleError(res, error));
        };
    }
}
exports.AuthController = AuthController;
