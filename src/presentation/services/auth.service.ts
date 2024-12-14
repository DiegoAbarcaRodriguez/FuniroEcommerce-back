import { BcryptjsAdaptor, JWTAdaptador } from "../../config/plugin";
import { prismaClient } from "../../data";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { CustomError } from "../../domain/errors/custom.error";

export class AuthService {
    authenticate = async (loginDto: LoginUserDto, mustValidateAdminStatus: boolean) => {
        try {

            const existingUser = await prismaClient.user.findUnique({
                where: {
                    username: loginDto.username,
                }
            });

            if (!existingUser) throw CustomError.notFound('User not found');
            if (!BcryptjsAdaptor.verifyHashedPassword(loginDto.password, existingUser.password)) throw CustomError.unauthorized('The password is not valid');

            if (mustValidateAdminStatus && !existingUser.is_admin) {
                throw CustomError.fobidden('The user does not possess the privilige to access');
            }

            const token = await JWTAdaptador.generateToken({ id: existingUser.id });
            if (!token) throw CustomError.internalServer('An error has ocurred while the token was generating');

            return {
                ok: true,
                token,
                message: 'User logged in succesfully'
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    checkLogginStatus = async (user: any) => {
        const { id, password, ...modifiedUser } = user;

        try {

            const token = await JWTAdaptador.generateToken({ id });
            if (!token) throw CustomError.internalServer('Encountered an error generating the JWT token');


            return {
                ok: true,
                token,
                user: modifiedUser
            }
        } catch (error) {
            console.log(error);
            throw error

        }



    }
}