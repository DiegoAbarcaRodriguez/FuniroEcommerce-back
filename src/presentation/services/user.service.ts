import { BcryptjsAdaptor } from '../../config/plugin';
import { prismaClient } from '../../data/index';
import { CreateUserDto, PaginationDto, UpdateUserDto } from '../../domain/dtos';
import { CustomError } from '../../domain/errors/custom.error';
export class UserService {
    constructor() { }

    getAllUsers = async (paginationDto: PaginationDto) => {
        try {
            return await prismaClient.user.findMany({
                take: paginationDto.limit,
                skip: (paginationDto.page - 1) * paginationDto.limit,
                orderBy: {
                    modify_at: 'desc'
                },
                where: {
                    is_admin: false
                }

            });

            //todo Complementar objeto con las rutas siguientes de la paginacion y numero total de registros

        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    createUser = async (createUserDto: CreateUserDto, id: string) => {
        try {

            const existingUser = await prismaClient.user.findUnique({
                where: {
                    username: createUserDto.username
                }
            });

            if (existingUser) throw CustomError.badRequest('The user already exists');

            await prismaClient.user.create({
                data: {
                    username: createUserDto.username,
                    password: BcryptjsAdaptor.hashPassword(createUserDto.password),
                    modify_by: id
                }
            });

            return {
                ok: true,
                message: 'User created successfully'
            };


        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    updateUser = async (updateUserDto: UpdateUserDto, idToUpdate: string, idWhoseModifys: string) => {
        try {


            const existingUser = await prismaClient.user.findUnique({
                where: {
                    id: idToUpdate
                }
            });

            if (!existingUser) throw CustomError.notFound('User not found');
            if(existingUser.is_admin) throw CustomError.fobidden('You cannot modify an admin account');

            if(Object.keys(updateUserDto.values).length === 0) throw CustomError.badRequest('The payload cannot be void');
            if (updateUserDto.password) updateUserDto.password = BcryptjsAdaptor.hashPassword(updateUserDto.password);


            await prismaClient.user.update({
                where: {
                    id: idToUpdate
                },
                data: {
                    ...updateUserDto.values,
                    modify_by: idWhoseModifys
                }
            });

            return {
                ok: true,
                message: 'User updated successfully'
            };


        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    deleteUser = async (idToDelete: string) => {
        try {

            const existingUser = await prismaClient.user.findUnique({
                where: {
                    id: idToDelete
                }
            });

            if (!existingUser) throw CustomError.notFound('User not found');
            if(existingUser.is_admin) throw CustomError.fobidden('You cannot delete an admin account');

            await prismaClient.user.delete({
                where: { id: idToDelete }
            });

            return {
                ok: true,
                message: 'User deleted successfully'
            };


        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}