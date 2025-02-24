import { UUIDAdaptor } from "../../config/plugin";
import { prismaClient } from "../../data";
import { CreateReviewDto } from "../../domain/dtos/review/create-review.dto";
import { CustomError } from "../../domain/errors/custom.error"

export class ReviewService {
    constructor() { }

    getReviewByFurnitureId = async (furnitureId: string) => {
        try {
            const reviews = await prismaClient.review.findMany({
                where: {
                    furniture_fk: furnitureId
                },
                select: {
                    customer: {
                        select: {
                            first_name: true,
                            last_name: true
                        }
                    }
                }
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

            const existingReview = await prismaClient.review.findFirst({
                where: {
                    customer_fk: createReviewDto.customer_fk,
                    furniture_fk: createReviewDto.furniture_fk,
                }
            });

            if (existingReview) throw CustomError.badRequest('you have already made a review on that product');

            const review = await prismaClient.review.create({
                data: {
                    id: UUIDAdaptor.generateUUID(),
                    ...createReviewDto
                }
            });

            return {
                ok: true,
                review
            }

        } catch (error) {
            throw error;
        }
    }
}