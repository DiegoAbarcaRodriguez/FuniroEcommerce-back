export class CreateUserDto {

    private constructor(
        public username: string,
        public password: string
    ) {

    }

    static create = (object: { [key: string]: any }): [string?, CreateUserDto?] => {
        const { username, password, password2 } = object;

        if (!username) return ['username is required'];
        if (!password) return ['Password is required'];
        if (password.length < 6) return ['Password is invalid'];
        if (password !== password2) return ['The passwords are diferents'];

        return [undefined, new CreateUserDto(username, password)];
    }
}