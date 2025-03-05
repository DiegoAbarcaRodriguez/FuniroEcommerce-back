import { prismaClient } from "../../data";
import { CustomError } from "../../domain/errors/custom.error";

export class CustomerService {

    async getCustomerByEmail(email: string) {
        try {
            const customer = await prismaClient.customer.findFirst({
                where: {
                    email
                }
            });

            if (!customer) {
                throw CustomError.notFound('Customer not found!');
            }

            return {
                ok: true
            }

        } catch (error) {
            throw error;
        }
    }
}