"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
class CreateUserDto {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}
exports.CreateUserDto = CreateUserDto;
CreateUserDto.create = (object) => {
    const { username, password, password2 } = object;
    if (!username)
        return ['username is required'];
    if (!password)
        return ['Password is required'];
    if (password.length < 6)
        return ['Password is invalid'];
    if (password !== password2)
        return ['The passwords are diferents'];
    return [undefined, new CreateUserDto(username, password)];
};
