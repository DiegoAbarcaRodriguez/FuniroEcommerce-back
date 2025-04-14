import { customer } from "@prisma/client";
import { BcryptjsAdaptor, envs, JWTAdaptador } from "../../config/plugin";
import { prismaClient } from "../../data";
import { CustomError } from "../../domain/errors/custom.error";
import { LoginCustomerDto, UpdatePasswordDto } from "../../domain/dtos";
import { EmailService } from "./email.service";


export class CustomerAuthService {

    constructor(private emailService: EmailService) { }

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

    checkCustomerStatus = async (customer: customer) => {
        try {

            const { password, ...customerData } = customer;

            const token = await JWTAdaptador.generateToken({ email: customer.email });

            if (!token) throw CustomError.internalServer('Encountered an error generated the JWT');

            return {
                ok: true,
                token,
                customer: {
                    ...customerData,
                    zip_code: customer.zip_code.toString(),
                    phone: customer.phone.toString()
                }
            }
        } catch (error) {
            throw error;
        }
    }

    loginCustomerAccount = async (loginCustomerDto: LoginCustomerDto) => {
        try {

            const { email, password } = loginCustomerDto;

            const customerData = await prismaClient.customer.findFirst({ where: { email } });

            if (!customerData) throw CustomError.notFound('The email or the user is incorrect');

            if (!BcryptjsAdaptor.verifyHashedPassword(password, customerData.password)) throw CustomError.unauthorized('The email or the user is incorrect');

            const token = await JWTAdaptador.generateToken({ email });

            return {
                ok: true,
                token,
                customer: {
                    ...customerData,
                    zip_code: customerData.zip_code.toString(),
                    phone: customerData.phone.toString()
                }
            }

        } catch (error) {
            throw error;
        }
    }

    sendEmailRecoverPassword = async (email: string) => {

        try {

            const existingCustomer = await prismaClient.customer.findFirst({ where: { email } });

            if (!existingCustomer) throw CustomError.notFound('The email was not found');


            const token = await JWTAdaptador.generateToken({ id: existingCustomer.id });

            if (!token) throw CustomError.internalServer('Encountered an error generated the JWT');

            const wasUpdated = await prismaClient.customer.update(
                {
                    where: { id: existingCustomer.id },
                    data: { token }
                });

            if (!wasUpdated) throw CustomError.internalServer('Encountered an error updating customer record');


            const html = `
                <body style="color:white;">
    <div
        style=" background-image: url(cid:cart); background-position: center 67%; background-size: cover; background-repeat: no-repeat;">
        <div style="background-color:rgba(97, 97, 97, 0.58);height:100%">

            <div style="background-color: white; text-align: center">
                <h1 style=" color:#B88E2F; margin-right: 10px; display: inline-block;">Funiro - Ecommerce</h1>
                <img src="cid:logo" style="height: 50px; width: 50px; display: inline-block;">
            </div>

            <h2 style="text-align: center;">Hi <span style="font-weight: bolder;">${existingCustomer.first_name} ${existingCustomer.last_name}</span></h2>
            <p style="text-align: center; font-size: 20px; font-weight: bold;">Click on the following link to retrieve your password -> <a
                    href="${envs.FRONT_URL}/recover-password/${token}"> Recover Password </a></p>
            <p style="text-align: center; font-size: 20px; font-weight: bold;">If you don't request it, please ignore the message</p>

            
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


</body>
            `

            await this.emailService.sendEmail(
                {
                    to: email,
                    subject: 'Recover your Password - Funiro',
                    htmlBody: html,
                    attachements: [
                        { path: './public/cart.jpg', filename: 'cart.jpg', cid: 'cart' },
                        { path: './public/logo.png', filename: 'logo.png', cid: 'logo' },
                    ]
                });


            return {
                ok: true
            }

        } catch (error) {
            throw error;
        }
    }

    validateTokenPassword = async (id: string) => {

        try {
            const wasUpdated = await prismaClient.customer.update(
                {
                    where: { id },
                    data: { token: null }
                });

            if (!wasUpdated) throw CustomError.internalServer('Encontered an error updating the customer record');

            return {
                ok: true,
                id: wasUpdated.id
            };

        } catch (error) {
            throw error;
        }

    }

    updatePassword = async (id: string, updatePasswordDto: UpdatePasswordDto) => {

        try {
            const existingCustomer = await prismaClient.customer.findUnique({ where: { id } });

            if (!existingCustomer) throw CustomError.notFound('Customer not found');

            const wasUpdated = await prismaClient.customer.update({
                where: { id },
                data: { password: BcryptjsAdaptor.hashPassword(updatePasswordDto.password) }
            });

            if (!wasUpdated) throw CustomError.internalServer('Encontered an error updating the password');

            return { ok: true };
        } catch (error) {
            throw error;
        }
    }


}