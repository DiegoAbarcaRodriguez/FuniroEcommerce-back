import { prismaClient } from "../../data";
import { CreateFavoriteDto } from "../../domain/dtos";

export class FavoriteService {
    async addFavoriteFurniture(createFavoriteDto: CreateFavoriteDto) {

        try {
            const { customer_id, furniture_id } = createFavoriteDto;

            await prismaClient.customer_furniture.create({
                data: {
                    furniture_fk: furniture_id,
                    customer_fk: customer_id
                }
            });

            return {
                ok: true,
                message: 'Record  was correctly created!'
            }

        } catch (error) {
            throw error;
        }
    }
}