import { order_status } from "@prisma/client";
import { RegularExpAdaptador } from "../../../config/plugin";
import { OrderStatus } from "../../constants/order-status";


export class UpdateOrderDto {
    constructor(


        //Customer
        public first_name?: string,
        public last_name?: string,
        public email?: string,
        public phone?: number,
        public zip_code?: number,
        public street?: string,
        public country?: string,
        public city?: string,
        public province?: string,

        //Order
        public total?: number,
        public status?: order_status,

        //Customer
        public company_name?: string,
        public additional_information?: string,

        //order_furniture
        public furniture_id?: string[],





    ) { }

    get values() {
        const object: { [key: string]: any } = {};

        if (this.first_name) object.first_name = this.first_name;
        if (this.last_name) object.last_name = this.last_name;
        if (this.email) object.email = this.email;
        if (this.phone) object.phone = this.phone;
        if (this.zip_code) object.zip_code = this.zip_code;
        if (this.street) object.street = this.street;
        if (this.country) object.country = this.country;
        if (this.city) object.city = this.city;
        if (this.province) object.province = this.province;
        if (this.company_name) object.company_name = this.company_name;
        if (this.additional_information) object.additional_information = this.additional_information;
        if (this.total) object.total = this.total;
        if (this.status) object.status = this.status;
        if (this.furniture_id) object.furniture_id = this.furniture_id;

        return object;
    }

    static create(object: { [key: string]: any }): [string?, UpdateOrderDto?] {
        const { first_name, last_name, email, phone, zip_code, street, country, city, province, company_name, additional_information, total, status, furniture_id } = object;

        //Customer
        if (email && !RegularExpAdaptador.email.test(email)) return ['email is not valid'];
        if (phone && isNaN(phone)) return ['phone is not valid'];
        if (phone && phone.length != 10) return ['phone must have 10 characters'];
        if (zip_code && zip_code.length != 6) return ['zip_code must have 6 characters']
        if (zip_code && !isNaN(zip_code)) return ['zip_code is not valid'];

        //order
        if (total && isNaN(total)) return ['Total is not valid'];
        if (total && total <= 0) return ['Total must be positive'];
        if (status && !Object.values(OrderStatus).includes(status)) return ['status not valid'];

        return [undefined, new UpdateOrderDto(first_name, last_name, email, phone, zip_code, street, country, city, province, total, status, company_name, additional_information, furniture_id)];
    }
}