import { BcryptjsAdaptor, JWTAdaptador } from "../../config/plugin";
import { prismaClient } from "../../data";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { CustomError } from "../../domain/errors/custom.error";

export class AuthService {
    authenticate = async (loginDto: LoginUserDto) => {
        try {

            const existingUser = await prismaClient.user.findUnique({
                where: {
                    username: loginDto.username
                }
            });

            if (!existingUser) throw CustomError.notFound('User not found');
            if (!BcryptjsAdaptor.verifyHashedPassword(loginDto.password, existingUser.password)) throw CustomError.unauthorized('The password is not valid');

            const token = await JWTAdaptador.generateToken({ id: existingUser.id });
            if (!token) throw CustomError.internalServer('An error has ocurred while the token was generating');

            return {
                ok: true,
                token,
                message: 'User loged in succesfully'
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}