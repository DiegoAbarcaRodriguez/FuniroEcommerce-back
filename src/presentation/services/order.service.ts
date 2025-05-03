import { prismaClient } from "../../data";
import { CreateOrderDto, PaginationDto, UpdateStatusDto } from "../../domain/dtos";
import { CustomError } from "../../domain/errors/custom.error";
import { ValidateStatusFurnituresDto } from '../../domain/dtos/order/validate-status-furnitures.dto';
import { BcryptjsAdaptor, envs, JWTAdaptador, UUIDAdaptor } from "../../config/plugin";
import Stripe from "stripe";
import { EmailService } from "./email.service";
import puppeteer from "puppeteer";
import { furniture, order_status } from "@prisma/client";
import fs from "fs";
import path from "path";
import { create } from "domain";
import { OrderStatus } from '../../domain/constants/order-status';




export class OrderService {
    constructor(private emailService: EmailService) { }

    private createOrderFromExistingCustomer = async (tx: any, createOrderDto: CreateOrderDto, existingCustomer: any) => {
        return await tx.order.create({
            data: {
                id: UUIDAdaptor.generateUUID(),
                total: createOrderDto.total,
                status: createOrderDto.status,
                created_at: new Date(new Date(new Date().toLocaleDateString('en-US', { timeZone: 'America/Mexico_City', hour: 'numeric', minute: 'numeric', second: 'numeric' }).toString()).setHours(new Date().getHours() + 6)),
                customer: {
                    connect: { id: existingCustomer.id }
                }
            }
        });
    }

    private createOrderFromNewCustomer = async (tx: any, createOrderDto: CreateOrderDto) => {

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
                password: BcryptjsAdaptor.hashPassword(createOrderDto.password),
                order: {
                    create: {
                        total: createOrderDto.total,
                        status: createOrderDto.status,
                        user_fk: null,
                        created_at: new Date(new Date(new Date().toLocaleDateString('en-US', { timeZone: 'America/Mexico_City', hour: 'numeric', minute: 'numeric', second: 'numeric' }).toString()).setHours(new Date().getHours() + 6)),
                        id: UUIDAdaptor.generateUUID()
                    }
                }
            },
            include: {
                order: true
            }
        });
    }

    private getStockOfFurnitures = (tx: any, createOrderDto: CreateOrderDto): Promise<[string?, string[]?, furniture[]?]> => {
        return new Promise(resolve => {
            let count = 0;
            let stocks: string[] = [];
            let furnitures: furniture[] = [];
            createOrderDto.furniture_id.forEach(async (id) => {
                try {
                    const existingFurniture = await tx.furniture.findUnique({
                        where: {
                            id
                        }
                    });

                    furnitures.push(existingFurniture);
                    stocks.push(existingFurniture.stock);
                    count++
                    if (count === createOrderDto.furniture_id.length) resolve([undefined, stocks, furnitures]);
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
                        where: { id: id },
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
                            furniture_fk: id,
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

    private generateReceipt = async (createOrderDto: CreateOrderDto, session: any, furnitures: furniture[]) => {
        try {
            const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

            const page = await browser.newPage();
            let html = `
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body style="background-color: #F9F1E7;">
    <div>
        <div style="display:flex; align-items:center; justify-content:center; gap:5px;">
            <h1 style="color:#B88E2F;">Funiro - Ecommerce</h1>
            <img
src="data:image/png;base64,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">
        </div>

        <ul style=" color: #B88E2F; list-style: none; padding-left: 0; display: flex;justify-content: center;">

            <div style="border-right: 1px solid #9F9F9F; padding: 0 20px;">
                <h3 style="color: #B88E2F; font-weight: 800; font-size: 25px; margin-bottom: 20px;">Invoice: <span style="font-weight: 400;">${session.id.substring(8, 16)}</span> </h3>

                <h2 style="margin-bottom: 0px;">Contact</h2>
                <li style="font-weight: 800;">Customer: <span style="font-weight: 400;">${createOrderDto.first_name + ' ' + createOrderDto.last_name}</span>
                </li>
                <li style="font-weight: 800;">Phone: <span style="font-weight: 400;">${createOrderDto.phone}</span></li>
                <li style="font-weight: 800;">Email: <span style="font-weight: 400;">${createOrderDto.email}</span></li>
            </div>
            <div style="padding: 0 20px;">
                <h3 style="color: #B88E2F;  font-weight: 800; font-size: 25px; margin-bottom: 30px;">Payment Date: <span style="font-weight: 400;">${new Date().toLocaleDateString()}</span></h3>

                <h2 style="margin-bottom: 0px;">Location:</h2>
                <li style="font-weight: 800;">Country: <span style="font-weight: 400;">${createOrderDto.country}</span></li>
                <li style="font-weight: 800;">Province: <span style="font-weight: 400;">${createOrderDto.province}</span></li>
                <li style="font-weight: 800;">City/town: <span style="font-weight: 400;">${createOrderDto.city}</span></li>
                <li style="font-weight: 800;">Address: <span style="font-weight: 400;">${createOrderDto.street}</span></li>
            </div>

        </ul>

       <h2 style="text-align: center; color: #B88E2F; font-weight: 800; margin-bottom: 10px;">Products</h2>

        <table style="width: 50%;margin: 0 auto;" cellpadding="0" cellspacing="0">
            <thead>
                <tr>
                    <th style="color: #B88E2F; font-weight: 800; border: 1px solid #9F9F9F;">Product</th>
                    <th style="color: #B88E2F; font-weight: 800; border: 1px solid #9F9F9F;">Quantity</th>
                    <th style="color: #B88E2F; font-weight: 800; border: 1px solid #9F9F9F;">Price</th>
                </tr>
            </thead>
            <tbody>
               
    
        `;

            furnitures.forEach((furniture, index) => {
                html += ` 
             <tr style="border: 1px solid #9F9F9F;">
                    <td style="text-align: center;color: #B88E2F; border: 1px solid #9F9F9F;">${furniture.name}</td>
                    <td style="text-align: center;color: #B88E2F; border: 1px solid #9F9F9F;">${createOrderDto.quantity[index]}</td>
                    <td style="text-align: center;color: #B88E2F; border: 1px solid #9F9F9F;">$${furniture?.price! - furniture?.discount! || 0}</td>
                </tr>
            `
            });

            html += `
            </tbody>
        </table>
        
    
        <h2 style="text-align: end; font-weight: 800; color: #B88E2F; margin-right: 30%;">Total: <span style="font-weight: 400;  text-decoration: underline;">$${createOrderDto.total}</span></h2>
    </div>

</body>

</html>
        `
            await page.emulateMediaType('screen');
            await page.setContent(html);

            await page.pdf(
                {
                    path: `./${session.id.substring(8, 16)}.pdf`,
                    format: 'A4',
                    printBackground: true,
                    margin: { left: "0.5cm", right: "0.5cm", top: "0.5cm", bottom: "0.5cm" },
                });
            await browser.close();

        } catch (error) {
            throw error;
        }

    }



    private sendEmail = async (name: string, email: string, filename: string) => {
        try {
            const htmlBody = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body style="color:white;">
    <div style=" background-image: url(cid:cart); background-position: center 67%; background-size: cover; background-repeat: no-repeat;">
    <div style="background-color:rgba(97, 97, 97, 0.58);height:100%">
        <div style="background-color: white; text-align: center">
            <h1 style=" color:#B88E2F; margin-right: 10px; display: inline-block;">Funiro - Ecommerce</h1>
            <img src="cid:logo" style="height: 50px; width: 50px; display: inline-block;">
        </div>

        <div style="text-align: center;">
            <h2 style="font-size: 24px; margin-bottom: 0px; margin-top: 20px;">Hi, ${name}</h2>
            <h2 style="font-size: 24px; margin-bottom: 0px; margin-top: 10px;">Here's your purchase receipt</h2>
            <p style="font-size: 20px; font-weight: 900; margin-top: 10px;">Attentively: <span style="font-weight: 400;"> Funiro Team</span></p>
        </div>
       

        <div style=" text-align: center; padding-bottom: 10px; padding-top: 5px;" >
            <h2 style="font-size:30px;margin-bottom:5px;">Support</h2>
            <P style="margin-top: 10px; margin-bottom: 5px; font-weight: 800; font-size: 20px;">Comunicate with us by the following channels:</P>
            <ul style="list-style: none;">
                <li><span style="font-weight: 800;">Email:</span> abarcarodriguezdiego@gmail.com</li>
                <li><span style="font-weight: 800;">Mobile:</span> +(84) 546-6789</li>
                <li><span style="font-weight: 800;">Hotline: </span> +(84) 456-6789</li>
                <li><span style="font-weight: 800;">Address:</span> 236 5th SE Avenue, New York NY10000, United States</li>
            </ul>

        </div>
    </div>

    </div>

</body>

</html>`

            const pdf = fs.readFileSync(`./${filename}.pdf`, 'utf-8');

            if (!pdf) throw CustomError.internalServer('The .pdf archive was not generated');

            await this.emailService.sendEmail(
                {
                    to: email,
                    subject: 'Funiro - Receipt',
                    attachements: [
                        { path: `./${filename}.pdf`, filename: `${filename}.pdf` },
                        { path: './public/cart.jpg', filename: 'cart.jpg', cid: 'cart' },
                        { path: './public/logo.png', filename: 'logo.png', cid: 'logo' },
                    ],
                    htmlBody
                });

            const route = path.join(__dirname + '../../../../' + filename + '.pdf');

            fs.unlinkSync(route);

        } catch (error) {
            throw error;
        }
    }

    createOrder = async (createOrderDto: CreateOrderDto, session_id: string) => {

        let payment_intent: any;

        try {

            const stripe = new Stripe(envs.STRIPE_KEY);
            const session = await stripe.checkout.sessions.retrieve(session_id);
            payment_intent = session.payment_intent;

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

                const [errorByGettingStockOfFurnitures, stocks, furnitures] = await this.getStockOfFurnitures(tx, createOrderDto);

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

                const token = await JWTAdaptador.generateToken({ email: createOrderDto.email });

                if (!token) throw CustomError.internalServer('Encountered an error generating JWT');

                await this.generateReceipt(createOrderDto, session, furnitures!);

                await this.sendEmail(`${createOrderDto.first_name} ${createOrderDto.last_name}`, session!.customer_details!.email!, session.id.substring(8, 16))

                return {
                    ok: true,
                    message: 'Order was correctly executed',
                    email: session.customer_details?.email,
                    token
                }

            },
                {
                    maxWait: 5000, // 5 seconds max wait to connect to prisma
                    timeout: 20000, // 20 seconds
                }
            );


        } catch (error) {
            if (payment_intent) {
                const stripe = new Stripe(envs.STRIPE_KEY);
                const refund = await stripe.refunds.create({ payment_intent });

                if (!refund) throw CustomError.internalServer('It could not execute the refund!');
            }

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

    private getLineItems = async (createOrderDto: CreateOrderDto) => {

        try {

            const { furniture_id, quantity } = createOrderDto;

            const furnitures_request = furniture_id.map(id => prismaClient.furniture.findUnique({ where: { id } }));

            const furnitures = await Promise.all(furnitures_request);


            const lineItems = furnitures.map((furniture, index) => ({
                price_data: {
                    currency: 'usd',
                    unit_amount: (furniture?.price! - (furniture?.discount || 0)) * 100,
                    product_data: {
                        name: furniture?.name,
                        description: furniture?.description.substring(0, 30),
                        images: [furniture?.images[0]]
                    }
                },
                quantity: +quantity[index],
            }));


            return lineItems;
        } catch (error) {
            return [];
        }


    };

    executePayment = async (createOrderDto: CreateOrderDto) => {

        try {
            const stripe = new Stripe(envs.STRIPE_KEY);
            const lineItems = await this.getLineItems(createOrderDto);

            if (lineItems.length === 0) throw CustomError.badRequest('Some selected furnitures does not exist');

            const session = await stripe.checkout.sessions.create({
                line_items: [
                    ...lineItems as any
                ],
                mode: 'payment',
                currency: 'usd',
                success_url: `http://localhost:4200/thank-you`,
                cancel_url: `http://localhost:4200/checkout`,
            });

            return {
                ok: true,
                session_id: session.id,
                url: session.url
            }
        } catch (error) {
            throw error;
        }


    }

    getOrdersByCustomer = async (customer_id: string) => {
        try {

            const orders = await prismaClient.order.findMany(
                {
                    where: {
                        customer_fk: customer_id
                    }
                });

            return {
                ok: true,
                orders
            }
        } catch (error) {
            throw error;
        }
    }

    getOrderById = async (order_id: string) => {
        try {
            const order = await prismaClient.order.findFirst(
                {
                    where: { id: order_id },
                    include: {
                        customer: true
                    }
                });



            if (!order) throw CustomError.notFound('Order not found');

            const furnitures = await prismaClient.order_furniture.findMany(
                {
                    where: { order_fk: order.id },
                    include: {
                        furniture: true
                    }
                });


            if (furnitures.length === 0 || !furnitures) throw CustomError.notFound('Furnitures were not found');

            return {
                ok: true,
                order,
                furnitures

            }
        } catch (error) {
            throw error;
        }
    }

    getFilterOrderByCustomer = async (query: string, { page, limit }: PaginationDto) => {

        try {

            let orders = [];
            let total: number = 0;
            orders = await prismaClient.order.findMany(
                {
                    where: {
                        customer: {
                            first_name: {
                                contains: query,
                                mode: 'insensitive'

                            },


                        }

                    },
                    include: {
                        customer: {
                            select: {
                                first_name: true,
                                last_name: true
                            }
                        }
                    },
                    take: limit,
                    skip: (page - 1) * limit
                });

            total = await prismaClient.order.count({
                where: {
                    customer: {
                        first_name: {
                            contains: query,
                            mode: 'insensitive'

                        },


                    }
                },
            });

            if (orders.length === 0) {
                orders = await prismaClient.order.findMany(
                    {
                        where: {
                            customer: {
                                last_name: {
                                    startsWith: query,
                                    mode: 'insensitive'

                                },


                            }

                        },
                        include: {
                            customer: {
                                select: {
                                    first_name: true,
                                    last_name: true
                                }
                            }
                        },
                        take: limit,
                        skip: (page - 1) * limit
                    });

                total = await prismaClient.order.count({
                    where: {
                        customer: {
                            last_name: {
                                contains: query,
                                mode: 'insensitive'

                            },


                        }
                    },
                });


            }



            return {
                ok: true,
                orders,
                total
            }

        } catch (error) {
            throw error;
        }

    }
    getAllOrders = async ({ page, limit }: PaginationDto, status: string) => {
        try {


            const orders = status
                ? await prismaClient.order.findMany(
                    {
                        select: {
                            id: true,
                            status: true,
                            total: true,
                            created_at: true,
                            modify_at: true,
                            customer: {
                                select: {
                                    first_name: true,
                                    last_name: true
                                }
                            }
                        },
                        orderBy: {
                            created_at: 'desc'
                        },
                        take: limit,
                        skip: (page - 1) * limit,
                        where: {
                            status: status as any
                        }
                    })
                :
                await prismaClient.order.findMany(
                    {
                        select: {
                            id: true,
                            status: true,
                            total: true,
                            created_at: true,
                            modify_at: true,
                            customer: {
                                select: {
                                    first_name: true,
                                    last_name: true
                                }
                            }
                        },
                        orderBy: {
                            created_at: 'desc'
                        },
                        take: limit,
                        skip: (page - 1) * limit,
                    });


            const total = status ?
                await prismaClient.order.count({
                    where: { status: status as any }
                })
                : await prismaClient.order.count();


            return {
                ok: true,
                orders,
                total
            }

        } catch (error) {
            throw error;
        }
    }

    changeStatus = async (user_id: string, { order_id, status }: UpdateStatusDto) => {
        try {

            const orderUpdated = await prismaClient.order.update(
                {
                    where: {
                        id: order_id
                    },
                    data: {
                        user_fk: user_id,
                        status,
                        modify_at: new Date(new Date(new Date().toLocaleDateString('en-US', { timeZone: 'America/Mexico_City', hour: 'numeric', minute: 'numeric', second: 'numeric' }).toString()).setHours(new Date().getHours() + 6)),
                    }
                }
            );

            return {
                ok: true,
                orderUpdated
            }


        } catch (error) {
            throw error;
        }
    }


}