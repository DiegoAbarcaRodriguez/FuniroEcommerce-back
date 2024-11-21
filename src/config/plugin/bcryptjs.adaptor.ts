import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export const BcryptjsAdaptor = {
    hashPassword: (passwordToHash: string) => {
        const salt = genSaltSync();
        return hashSync(passwordToHash, salt);
    },
    verifyHashedPassword: (password: string, hashedPassword: string) => {
        return compareSync(password, hashedPassword);
    }
}