import { DateTime } from "luxon";
import { UUIDAdaptor } from "../../config/plugin";
import { prismaClient } from "../../data";
import { PaginationDto } from "../../domain/dtos";
import { CreateReviewDto } from "../../domain/dtos/review/create-review.dto";
import { CustomError } from "../../domain/errors/custom.error"

export class ReviewService {
    constructor() { }

    getReviewByFurnitureId = async (furnitureId: string, paginationDto: PaginationDto) => {

        const { limit, page } = paginationDto;

        try {
            const reviews = await prismaClient.review.findMany({
                where: {
                    furniture_fk: furnitureId
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: {
                    customer: {
                        select: {
                            first_name: true,
                            last_name: true
                        }
                    }
                },
            });

            if (reviews.length === 0) throw CustomError.notFound('There are not reviews for that furniture yet');

            return {
                ok: true,
                reviews
            }
        } catch (error) {
            throw error;
        }
    }

    createReview = async (createReviewDto: CreateReviewDto) => {
        try {

            console.log(DateTime.now().setZone('America/Mexico_City').toISO())

            const existingReview = await prismaClient.review.findFirst({
                where: {
                    customer_fk: createReviewDto.customer_id,
                    furniture_fk: createReviewDto.furniture_id,
                }
            });

            if (existingReview) throw CustomError.badRequest('you have already made a review on that product');

            const { customer_id, furniture_id, ...reviewPayload } = createReviewDto;

            const review = await prismaClient.review.create({
                data: {
                    id: UUIDAdaptor.generateUUID(),
                    created_at: DateTime.now().setZone('America/Mexico_City').toISO(),
                    ...reviewPayload,
                    customer: { connect: { id: customer_id } },
                    furniture: { connect: { id: furniture_id } },
                },
                include: {
                    customer: {
                        select: {
                            first_name: true,
                            last_name: true
                        }
                    },
                },

            });


            return {
                ok: true,
                review
            }

        } catch (error) {
            throw error;
        }
    }


    getTotalAndAverage = async (id: string) => {
        try {
            const average = await prismaClient.review.aggregate({
                _avg: {
                    grade: true
                },
                where: { furniture_fk: id }
            });

            const total = await prismaClient.review.count({
                where: {
                    furniture_fk: id
                }
            });

            return {
                ok: true,
                total,
                average
            }


        } catch (error) {
            throw error;
        }



    }

    updateReview = async (review_id: string, updateReviewDto: CreateReviewDto) => {
        try {
            const existingReview = await prismaClient.review.findFirst(
                {
                    where:
                        { id: review_id }
                });

            if (!existingReview) throw CustomError.notFound('Review not found');

            const { furniture_id, customer_id, ...body } = updateReviewDto;

            const updatedReview = await prismaClient.review.update(
                {
                    where: {
                        id: review_id
                    },
                    data: {
                        ...body,
                        created_at: DateTime.now().setZone('America/Mexico_City').toISO(),
                    }
                }
            );

            return {
                ok: true,
                review: updatedReview
            }
        } catch (error) {
            throw error;
        }
    }

    deleteReview = async (review_id: string) => {
        try {
            const deletedReview = await prismaClient.review.delete(
                {
                    where: {
                        id: review_id
                    }
                });

            return {
                ok: true,
                review: deletedReview
            };

        } catch (error) {
            throw error;
        }
    }
}