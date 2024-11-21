
export class LoginUserDto {

    private constructor(public username: string, public password: string) { }

    static create(object: { [key: string]: any }): [string?, LoginUserDto?] {

        const { username, password } = object;

        if (!username) return ['Username is required'];

        if (!password) return ['Password is required'];
        if (password.length < 6) return ['Password is invalid'];

        return [undefined, new LoginUserDto(username, password)];


    }

}