import { prismaClient } from "../../data";
import { CreateOrderDto } from "../../domain/dtos";
import { CustomError } from "../../domain/errors/custom.error";
import { ValidateStatusFurnituresDto } from '../../domain/dtos/order/validate-status-furnitures.dto';
import { UUIDAdaptor } from "../../config/plugin";



export class OrderService {
    constructor() { }

    private createOrderFromExistingCustomer = async (tx: any, createOrderDto: CreateOrderDto, existingCustomer: any) => {
        return await tx.order.create({
            data: {
                id: UUIDAdaptor.generateUUID(),
                total: createOrderDto.total,
                status: createOrderDto.status,
                customer: {
                    connect: { id: existingCustomer.id }
                }
            }
        });
    }

    private createOrderFromNewCustomer = async (tx: any, createOrderDto: CreateOrderDto) => {
        //TODO : Add password into the create and sign JWT
        return await tx.customer.create({
            data: {
                id: UUIDAdaptor.generateUUID(),
                first_name: createOrderDto.first_name,
                last_name: createOrderDto.last_name,
                company_name: createOrderDto.company_name,
                email: createOrderDto.email,
                phone: createOrderDto.phone,
                zip_code: createOrderDto.zip_code,
                country: createOrderDto.country,
                city: createOrderDto.city,
                province: createOrderDto.city,
                street: createOrderDto.street,
                additional_information: createOrderDto.additional_information,
                order: {
                    create: {
                        total: createOrderDto.total,
                        status: createOrderDto.status,
                        user_fk: null

                    }
                }
            },
            include: {
                order: true
            }
        });
    }

    private getStockOfFurnitures = (tx: any, createOrderDto: CreateOrderDto): Promise<[string?, string[]?]> => {
        return new Promise(resolve => {
            let count = 0;
            let stocks: string[] = [];
            createOrderDto.furniture_id.forEach(async (id) => {
                try {
                    const existingFurniture = await tx.furniture.findUnique({
                        where: {
                            id
                        }
                    });

                    stocks.push(existingFurniture.stock);
                    count++
                    if (count === createOrderDto.furniture_id.length) resolve([undefined, stocks]);
                } catch (error) {
                    resolve(['ecountered a problem by getting stock furnitures']);
                }

            });
        });
    }

    private updateStockFurnitures = (tx: any, createOrderDto: CreateOrderDto, stocks: string[]): Promise<string | undefined> => {

        return new Promise(resolve => {
            let count = 0;
            let stock: number = 0;
            createOrderDto.furniture_id.forEach(async (id, index) => {
                try {
                    stock = +stocks[index] - +createOrderDto.quantity[index];
                    if (stock < 0) {
                        resolve('One of the selected products are not available anymore!');
                    }

                    await tx.furniture.update({
                        where: { id: +id },
                        data: { stock }
                    });

                    count++;
                    if (count === createOrderDto.furniture_id.length) resolve(undefined);
                } catch (error) {
                    resolve('Encountered error by updating stock furnitures');
                }


            });
        });


    }

    private createOrderFurnitureRecords = (tx: any, createOrderDto: CreateOrderDto, createdOrder: any, existingCustomer?: any): Promise<string | undefined> => {
        return new Promise(resolve => {
            let count = 0;
            createOrderDto.furniture_id.forEach(async (id, index) => {
                try {
                    await tx.order_furniture.create({
                        data: {
                            furniture_fk: +id,
                            order_fk: existingCustomer ? createdOrder.id : createdOrder.order[0].id,
                            quantity: +createOrderDto.quantity[index]
                        }
                    });
                    count++;
                    if (count === createOrderDto.furniture_id.length) resolve(undefined);
                } catch (error) {
                    resolve('Encountered error by filling orderFurniture table');
                }

            });
        });


    }


    createOrder = async (createOrderDto: CreateOrderDto) => {
        try {

            return prismaClient.$transaction(async (tx) => {
                const existingCustomer = (await tx.customer.findMany({ where: { email: createOrderDto.email } })).at(0);

                let createdOrder: any;

                if (existingCustomer) {
                    createdOrder = await this.createOrderFromExistingCustomer(tx, createOrderDto, existingCustomer);
                } else {
                    createdOrder = await this.createOrderFromNewCustomer(tx, createOrderDto);
                }

                if (!createdOrder) {
                    throw CustomError.internalServer('An error encountered by creating the order and costumer record');
                }

                const [errorByGettingStockOfFurnitures, stocks] = await this.getStockOfFurnitures(tx, createOrderDto);

                if (errorByGettingStockOfFurnitures) {
                    throw CustomError.badRequest(errorByGettingStockOfFurnitures!);
                }

                const errorByUpdatingFurnitures = await this.updateStockFurnitures(tx, createOrderDto, stocks!);
                if (errorByUpdatingFurnitures) {
                    throw CustomError.badRequest(errorByUpdatingFurnitures!);
                }

                const errorByCreatingOrderFurnitureRecords = await this.createOrderFurnitureRecords(tx, createOrderDto, createdOrder, existingCustomer);
                if (errorByCreatingOrderFurnitureRecords) {
                    throw CustomError.badRequest(errorByCreatingOrderFurnitureRecords!);
                }

                return {
                    ok: true,
                    message: 'Order was correctly executed'
                }

            });


        } catch (error) {
            throw error;
        }
    }

    private walkByFurnituresArray = (furniture_ids: string[], quantities: string[]): Promise<undefined | string> => {
        return new Promise(resolve => {

            let count: number = 0;

            furniture_ids.forEach(async (id, index) => {
                const furniture = await prismaClient.furniture.findUnique({
                    where: { id }
                });

                if (!furniture) {
                    resolve(`the furniture with id = ${id} was not found`);
                }


                if (furniture!.stock == 0) {
                    resolve(`the furniture = ${furniture!.name}, does not have units in the store`);
                }

                if (furniture!.stock! < +quantities[index]) {
                    resolve(`you are trying to get more of furniture = ${furniture?.name} than the its units in store`);
                }

                count++;
                if (count === quantities.length) {
                    resolve(undefined);
                }
            });


        });
    }

    validateFurnitures = async (valitateStatusFurnituresDto: ValidateStatusFurnituresDto) => {

        const { furniture_id: furniture_ids, quantity: quantities } = valitateStatusFurnituresDto;

        try {

            const errorMessase = await this.walkByFurnituresArray(furniture_ids, quantities)

            if (errorMessase) throw CustomError.badRequest(errorMessase);


            return {
                ok: true,
                message: 'All the furnitures fulfill the acceptance criteria'
            };



        } catch (error) {
            console.log(error);
            throw error;
        }

    }



}