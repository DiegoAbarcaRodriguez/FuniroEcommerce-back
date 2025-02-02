import { furniture } from './../../../node_modules/.prisma/client/index.d';
import { findFurnitureWithUniqueParameters } from '@prisma/client/sql'
import { prismaClient } from "../../data";
import { CreateFurnitureDto, PaginationDto, UpdateFurnitureDto } from "../../domain/dtos";
import { CustomError } from '../../domain/errors/custom.error';


export class FurnitureService {
    createFurniture = async (createFurnitureDto: CreateFurnitureDto) => {

        const { name, model_number } = createFurnitureDto;

        try {

            const existingFurniture = await prismaClient.$queryRawTyped(findFurnitureWithUniqueParameters(name, model_number));
            if (existingFurniture[0]) throw CustomError.badRequest('There is an existing furniture with either the same name or model_number');

            await prismaClient.furniture.create({
                data: createFurnitureDto
            });

            return {
                ok: true,
                message: 'Furniture created succcessfully'
            };

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    getFurnitures = async (paginationDto: PaginationDto) => {
        const { limit, page } = paginationDto;

        try {
            const furnitures = await prismaClient.furniture.findMany({
                include: {
                    user: true
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { modify_at: 'desc' },
            });

            const total = await prismaClient.furniture.count();

            return {
                ok: true,
                furnitures,
                total
            }

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    getOneFurniture = async (term: string) => {




        try {

            const furniture = await prismaClient.furniture.findUnique({
                where: {
                    name: term
                }
            });


            if (!furniture) {
                throw CustomError.notFound(`The furniture with ${term} was not found`);
            }

            return {
                ok: true,
                furniture
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    updateFurniture = async (updateFurnitureDto: UpdateFurnitureDto, term: string) => {
        try {
            const { furniture } = await this.getOneFurniture(term);

            const { name } = await prismaClient.furniture.update({
                data: updateFurnitureDto.values,
                where: {
                    id: furniture.id
                }
            });

            return {
                ok: true,
                message: `The furniture with name = ${name} has been updated`
            };

        } catch (error: any) {

            if (error.code === 'P2002') {
                throw CustomError.badRequest('Some of the exclusive parameters belongs to another record')
            }
            console.log(error);
            throw error;
        }
    }

    deleteFurniture = async (term: string) => {
        try {
            const { furniture } = await this.getOneFurniture(term);

            await prismaClient.furniture.delete({
                where: {
                    id: furniture.id
                }
            });

            return {
                ok: true,
                message: `Furniture with name = ${furniture.name} has been eliminated`
            };

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    getFurnitureByModelNumber = async (model: string) => {
        try {
            const furniture = await prismaClient.furniture.findUnique({ where: { model_number: model } });

            if (!furniture) throw CustomError.notFound(`The furniture with ${model} does not exists`);

            return { ok: true }

        } catch (error) {
            throw error;
        }
    }

    getFurnituresByQuery = async (name: string, limit: number) => {
        try {
            const furnitures = await prismaClient.furniture.findMany({
                where: {
                    name: {
                        contains: name
                    }
                },
                take: limit
            });

            if (furnitures.length == 0 || !furnitures) throw CustomError.notFound(`No furniture with the coincidence ${name} does not exists`);

            return {
                ok: true,
                furnitures
            }

        } catch (error) {
            throw error;
        }
    }

}