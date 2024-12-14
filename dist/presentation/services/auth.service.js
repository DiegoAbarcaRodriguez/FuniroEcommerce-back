"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const plugin_1 = require("../../config/plugin");
const data_1 = require("../../data");
const custom_error_1 = require("../../domain/errors/custom.error");
class AuthService {
    constructor() {
        this.authenticate = (loginDto) => __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield data_1.prismaClient.user.findUnique({
                    where: {
                        username: loginDto.username
                    }
                });
                if (!existingUser)
                    throw custom_error_1.CustomError.notFound('User not found');
                if (!plugin_1.BcryptjsAdaptor.verifyHashedPassword(loginDto.password, existingUser.password))
                    throw custom_error_1.CustomError.unauthorized('The password is not valid');
                const token = yield plugin_1.JWTAdaptador.generateToken({ id: existingUser.id });
                if (!token)
                    throw custom_error_1.CustomError.internalServer('An error has ocurred while the token was generating');
                return {
                    ok: true,
                    token,
                    message: 'User loged in succesfully'
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.AuthService = AuthService;
