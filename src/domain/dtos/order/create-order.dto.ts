import { order_status } from "@prisma/client";
import { RegularExpAdaptador } from "../../../config/plugin";
import { OrderStatus } from "../../constants/order-status";

export class CreateOrderDto {
    constructor(

        //customer
        public first_name: string,
        public last_name: string,
        public email: string,
        public phone: string,
        public zip_code: number,
        public street: string,
        public country: string,
        public city: string,
        public province: string,

        //Order
        public total: number,
        public status: order_status,
        //order_furniture
        public furniture_id: string[],
        public quantity: string[],

        //Customer
        public password: string,
        public company_name?: string,
        public additional_information?: string




    ) { }

    static create(object: { [key: string]: any }): [string?, CreateOrderDto?] {
        const { first_name, last_name, email, phone, zip_code, street, country, city, province, company_name, additional_information, total, status, furniture_id, quantity, stocks, password, password2 } = object;
        
        //Customer
        if (!first_name) return ['first_name is required'];
        if (!last_name) return ['last_name is required'];
        if (!email) return ['email is required'];
        if (!RegularExpAdaptador.email.test(email)) return ['email is not valid'];
        if (!phone) return ['phone is required'];
        if (isNaN(phone)) return ['phone is not valid'];
        if (phone.length != 10) return ['phone must have 10 characters'];
        if (!zip_code) return ['zip_code is required'];
        if (zip_code.length != 5) return ['zip_code must have 5 characters'];
        if (isNaN(zip_code)) return ['zip_code is not valid'];
        if (!street) return ['street is required'];
        if (!country) return ['country is required'];
        if (!city) return ['city is required'];
        if (!province) return ['province is required'];

        //order
        if (!total) return ['Total is required'];
        if (isNaN(total)) return ['Total is not valid'];
        if (total <= 0) return ['Total must be positive'];
        if (!status) return ['status is required'];
        if (!Object.values(OrderStatus).includes(status)) return ['status not valid'];

        //order_furniture
        if (!furniture_id) return ['furniture_id is required'];
        if (!Array.isArray(furniture_id)) return ['furniture_id is not valid'];
        if (furniture_id.length === 0) return ['furniture_id is required'];

        if (!quantity) return ['quantity is required'];
        if (!Array.isArray(quantity)) return ['quantity is not valid'];
        if (quantity.length === 0) return ['quantity is required'];

        if (quantity.some(element => element <= 0)) return ['quantity is not valid'];
        if (furniture_id.length !== quantity.length) return ['the length of furniture_id array is different than quantity array'];
        if (!quantity) return ['quantity is required'];

        if (!password) return ['Password is required'];
        if (password.length < 6) return ['Password is invalid'];
        if (password !== password2) return ['The passwords are diferents'];


        return [undefined, new CreateOrderDto(first_name, last_name, email, phone, +zip_code, street, country, city, province, +total, status, furniture_id, quantity, password, company_name, additional_information)];
    }
}