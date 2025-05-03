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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
                        username: loginDto.username,
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
                    message: 'User logged in succesfully'
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
        this.checkLogginStatus = (user) => __awaiter(this, void 0, void 0, function* () {
            const { id, password } = user, userData = __rest(user, ["id", "password"]);
            try {
                const token = yield plugin_1.JWTAdaptador.generateToken({ id });
                if (!token)
                    throw custom_error_1.CustomError.internalServer('Encountered an error generating the JWT token');
                return {
                    ok: true,
                    token,
                    user: userData
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
