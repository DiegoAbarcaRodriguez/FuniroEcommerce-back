import { findFurnitureWithUniqueParameters } from '@prisma/client/sql'
import { prismaClient } from "../../data";
import { CreateFurnitureDto } from "../../domain/dtos";
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
}