import jwt from "jsonwebtoken";
import { envs } from "./env.adaptator";


export class JWTAdaptador {
    static async generateToken(payload: any, duration: string = '2h') {
        return new Promise((resolve) => {
            jwt.sign(payload, envs.JWT_SEED, { expiresIn: duration }, (error, token) => {

                if (error) return resolve(null);

                resolve(token);
            });
        });
    }

    static validateToken<T>(token: string): Promise<T | null> {

        return new Promise((resolve) => {
            jwt.verify(token, envs.JWT_SEED, (error, decoded) => {
                if (error) resolve(null);
                resolve(decoded as T);
            });
        });
    }
}