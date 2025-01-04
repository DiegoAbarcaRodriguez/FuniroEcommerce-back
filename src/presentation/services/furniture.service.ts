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
                orderBy: { created_at: 'desc' },
            });

            return {
                ok: true,
                furnitures
            }

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    getOneFurniture = async (term: string) => {


        const id = !isNaN(+term) ? +term : undefined;

        try {

            const furniture = id
                ? await prismaClient.furniture.findUnique({
                    where: { id }
                })
                :
                await prismaClient.furniture.findUnique({
                    where: {
                        name: term
                    }
                });


            if (!furniture) {
                throw CustomError.notFound(`The furniture with ${id ? id : term} was not found`);
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

            await prismaClient.furniture.update({
                data: updateFurnitureDto.values,
                where: {
                    id: furniture.id
                }
            });

            return {
                ok: true,
                message: `The furniture with id = ${furniture.id} has been updated`
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
                message: `Furniture with id = ${furniture.id} has been eliminated`
            };

        } catch (error) {
            console.log(error);
            throw error;
        }
    }


}