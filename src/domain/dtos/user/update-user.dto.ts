export class UpdateUserDto {

    private constructor(
        public username?: string,
        public password?: string
    ) { }

    get values() {
        let object: { [key: string]: any } = {};

        if (this.username) object.username = this.username;
        if (this.password) object.password = this.password;

        return object;
    }

    static create = (object: { [key: string]: any }): [string?, UpdateUserDto?] => {
        const { username, password, password2 } = object;

        if (password && password.length < 6) return ['Password is invalid'];
        if (password !== password2) return ['The passwords are diferents'];

        return [undefined, new UpdateUserDto(username, password)];
    }
}