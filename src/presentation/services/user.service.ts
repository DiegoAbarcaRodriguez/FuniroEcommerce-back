import { BcryptjsAdaptor } from '../../config/plugin';
import { prismaClient } from '../../data/index';
import { CreateUserDto, PaginationDto, UpdateUserDto } from '../../domain/dtos';
import { CustomError } from '../../domain/errors/custom.error';

export class UserService {
    constructor() { }

    getAllUsers = async (paginationDto: PaginationDto, user: any) => {
        try {

            if (!user.is_admin) {
                throw CustomError.fobidden('You do not have the privilege to consult that information');
            }

            const allUsers = await prismaClient.user.findMany({
                take: paginationDto.limit,
                skip: (paginationDto.page - 1) * paginationDto.limit,
                orderBy: {
                    modify_at: 'desc'
                },
                select: {
                    id: true,
                    username: true,
                    modify_at: true,
                    is_admin: true,
                    user: {
                        select: {
                            username: true
                        }
                    }
                }
            });


            const users = user.is_root
                ? allUsers.filter(userElement => userElement.id !== user.id)
                : allUsers.filter(userElement => !userElement.is_admin);


            return users;


            //todo Complementar objeto con las rutas siguientes de la paginacion y numero total de registros

        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    createUser = async (createUserDto: CreateUserDto, userFromBody: any) => {
        try {


            const { id } = userFromBody;

            if (!userFromBody.is_admin) {
                throw CustomError.fobidden('You do not possess the privilige to do it');
            }

            const existingUser = await prismaClient.user.findUnique({
                where: {
                    username: createUserDto.username
                }
            });

            if (existingUser) throw CustomError.badRequest('The user already exists');

            const user = await prismaClient.user.create({
                data: {
                    username: createUserDto.username,
                    password: BcryptjsAdaptor.hashPassword(createUserDto.password),
                    modify_by: id,
                    is_admin: true
                },
                select: {
                    id: true,
                    username: true,
                    modify_at: true,
                    is_admin: true,
                    user: {
                        select: {
                            username: true
                        }
                    }
                }
            });

            return {
                ok: true,
                message: 'User created successfully',
                user
            };


        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    updateUser = async (updateUserDto: UpdateUserDto, idToUpdate: string, userFromBody: any) => {
        try {

            const { id: idWhoseModifys } = userFromBody;

            if (!userFromBody.is_admin) {
                throw CustomError.fobidden('The user does not possess the privilige to do it');
            }



            const existingUser = await prismaClient.user.findUnique({
                where: {
                    id: idToUpdate
                }
            });

            if (!existingUser) throw CustomError.notFound('User not found');
            if (existingUser.is_root) throw CustomError.fobidden('You cannot modify a root account');

            if (Object.keys(updateUserDto.values).length === 0) throw CustomError.badRequest('The payload cannot be void');
            if (updateUserDto.password) updateUserDto.password = BcryptjsAdaptor.hashPassword(updateUserDto.password);


            const updatedUser = await prismaClient.user.update({
                where: {
                    id: idToUpdate
                },
                data: {
                    ...updateUserDto.values,
                    modify_by: idWhoseModifys,
                    modify_at: new Date()
                },
                select: {
                    id: true,
                    username: true,
                    modify_at: true,
                    is_admin: true,
                    user: {
                        select: {
                            username: true
                        }
                    }
                }
            });

            return {
                ok: true,
                message: 'User updated successfully',
                user: updatedUser
            };


        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    deleteUser = async (idToDelete: string, userFromBody: any) => {
        try {

            if (!userFromBody.is_admin) {
                throw CustomError.fobidden('The user does not possess the privilige to do it');
            }

            const existingUser = await prismaClient.user.findUnique({
                where: {
                    id: idToDelete
                }
            });

            if (!existingUser) throw CustomError.notFound('User not found');
            if (existingUser.is_root) throw CustomError.fobidden('You cannot delete a root account');

            const deletedUser = await prismaClient.user.delete({
                where: { id: idToDelete }
            });

            return {
                ok: true,
                message: 'User deleted successfully',
                user: deletedUser
            };


        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}