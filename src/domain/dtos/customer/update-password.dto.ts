
export class UpdatePasswordDto {
    password: string;
    password2: string;

    constructor(password: string, password2: string) {
        this.password = password;
        this.password2 = password2;
    }

    static create(object: { [key: string]: any }): [string?, UpdatePasswordDto?] {
        const { password, password2 } = object;

        if (!password) return ['Password is missing'];
        if (password.length < 6) return ['Password must be equal or greater than 6'];

        if (!password2) return ['Password2 is missing'];
        if (password2.length < 6) return ['Password2 must be equal or greater than 6'];

        if (password !== password2) return ['The passwords are differents'];

        return [undefined, new UpdatePasswordDto(password, password2)];


    }
}