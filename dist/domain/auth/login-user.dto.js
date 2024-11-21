"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserDto = void 0;
class LoginUserDto {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    static create(object) {
        const { username, password } = object;
        if (!username)
            return ['Usename is required'];
        if (!password)
            return ['Password is required'];
        if (password.length < 6)
            return ['Password is invalid'];
        return [undefined, new LoginUserDto(username, password)];
    }
}
exports.LoginUserDto = LoginUserDto;
