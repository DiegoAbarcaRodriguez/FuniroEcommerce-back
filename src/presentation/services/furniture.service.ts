import { findFurnitureWithUniqueParameters } from '@prisma/client/sql'
import { prismaClient } from "../../data";
import { CreateFurnitureDto, PaginationDto, UpdateFurnitureDto } from "../../domain/dtos";
import { CustomError } from '../../domain/errors/custom.error';
import { UUIDAdaptor } from '../../config/plugin';
import { SortByDto } from '../../domain/dtos/shared/sort-by.dto';
import { order_furniture } from '@prisma/client';
import { DateTime } from 'luxon';


export class FurnitureService {
    createFurniture = async (createFurnitureDto: CreateFurnitureDto) => {

        const { name, model_number } = createFurnitureDto;

        try {

            const existingFurniture = await prismaClient.$queryRawTyped(findFurnitureWithUniqueParameters(name, model_number));
            if (existingFurniture[0]) throw CustomError.badRequest('There is an existing furniture with either the same name or model_number');

            await prismaClient.furniture.create({
                data: {
                    ...createFurnitureDto,
                    id: UUIDAdaptor.generateUUID(),
                    modify_at: DateTime.now().setZone('America/Mexico_City').toISO()
                }
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

    getFurnitures = async (paginationDto: PaginationDto, sortByDto: SortByDto) => {
        const { limit, page } = paginationDto;
        const { sortBy } = sortByDto;

        try {

            let furnitures = sortBy
                ?
                await prismaClient.furniture.findMany({
                    include: {
                        user: true,
                        review: true
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: {
                        [sortBy]: 'desc'
                    },
                })
                :
                await prismaClient.furniture.findMany({
                    include: {
                        user: true,
                        review: true
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: {
                        modify_at: 'desc'
                    },
                });

            furnitures = furnitures.map(furniture => ({
                reviews: furniture.review,
                ...furniture
            }));

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
                    id: furniture.id,
                    modify_at: DateTime.now().setZone('America/Mexico_City').toISO()
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

    markFurnitureAsFavorite = async (furniture_id: string, customer_id: string) => {
        try {
            const existingFurniture = await prismaClient.furniture.findUnique({ where: { id: furniture_id } });
            if (!existingFurniture) throw CustomError.notFound('The furniture was not found');

            const existingCustomer = await prismaClient.customer.findUnique({ where: { id: customer_id } });
            if (!existingCustomer) throw CustomError.notFound('The customer was not found');

            const existingCustomerFurniture = await prismaClient.customer_furniture.findFirst(
                {
                    where: {
                        customer_fk: customer_id,
                        furniture_fk: furniture_id
                    }
                });

            let markedAsFavorite;

            if (existingCustomerFurniture) {

                markedAsFavorite = await prismaClient.customer_furniture.delete({
                    where: {
                        id: +existingCustomerFurniture.id
                    }
                });

            } else {
                markedAsFavorite = await prismaClient.customer_furniture.create(
                    {
                        data:
                        {
                            customer_fk: customer_id,
                            furniture_fk: furniture_id
                        }
                    });

            }


            if (!markedAsFavorite) throw CustomError.internalServer('Encountered an error marking as favorite to the furniture');


            return {
                ok: true,
                message: `The furnitures was ${existingCustomerFurniture ? 'unmarked' : 'marked'} as favorite succesfully`
            };

        } catch (error) {
            throw error;
        }
    }

    getFavoriteFurnitures = async (customer_id: string) => {
        try {

            const furnitures = await prismaClient.customer_furniture.findMany(
                {
                    where: { customer_fk: customer_id },
                    include: {
                        furniture: true
                    }
                });

            const furnituresData = furnitures.map(furniture => furniture.furniture);

            return {
                ok: true,
                furnitures: furnituresData
            }

        } catch (error) {
            throw error;
        }
    }

    getFurnituresByOrder = async (order_id: string) => {
        try {



            const ordersFurniture = await prismaClient.order_furniture.findMany(
                {
                    where: {
                        order_fk: order_id
                    },
                    include: {
                        furniture: true
                    }
                });

            const furnitures = ordersFurniture.map(orderFurniture => orderFurniture.furniture);



            return {
                ok: true,
                furnitures
            }

        } catch (error) {
            throw error;
        }
    }
}