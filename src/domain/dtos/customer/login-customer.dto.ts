import { RegularExpAdaptador } from "../../../config/plugin";

export class LoginCustomerDto {

    email: string = '';
    password: string = '';

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }


    static create = (object: { [key: string]: any }): [string?, LoginCustomerDto?] => {
        const { email, password } = object;

        if (!email) return ['The email is missing'];
        if (!RegularExpAdaptador.email.test(email)) return ['The email is not valid'];

        if (!password) return ['The password is missing'];
        if (password.length < 6) return ['The password must be greater or equal than 6'];

        return [undefined, new LoginCustomerDto(email, password)];
    }
}