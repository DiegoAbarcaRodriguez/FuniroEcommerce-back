import { findFurnitureWithUniqueParameters } from '@prisma/client/sql'
import { prismaClient } from "../../data";
import { CreateFurnitureDto, PaginationDto } from "../../domain/dtos";
import { CustomError } from '../../domain/errors/custom.error';


export class FurnitureService {
    createFurniture = async (createFurnitureDto: CreateFurnitureDto) => {

        const { name, model_number, image } = createFurnitureDto;

        try {

            const existingFurniture = await prismaClient.$queryRawTyped(findFurnitureWithUniqueParameters(name, model_number, image));
            if (existingFurniture[0]) throw CustomError.badRequest('There is an existing furniture with the exclusive parameters');

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
}