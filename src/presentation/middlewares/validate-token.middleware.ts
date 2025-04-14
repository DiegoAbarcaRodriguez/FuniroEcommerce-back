import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { JWTAdaptador } from "../../config/plugin";
import { prismaClient } from "../../data";

export class ValidateTokenMiddleware {
    static validateToken = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const authorization = req.header('Authorization');

            if (!authorization) return res.status(401).json({ ok: false, message: 'Token not provided' });
            if (!authorization!.startsWith('Bearer ')) return res.status(401).json({ ok: false, message: 'Invalid Bearer token' });

            const token = authorization!.split(' ').at(1) || '';
            if (!token) throw CustomError.notFound('The token is missing');

            const payload = await JWTAdaptador.validateToken<{ id: string }>(token);
            if (!payload) throw CustomError.internalServer('Encontered an error decoding the JWT');

            if (!payload.id) throw CustomError.unauthorized('The is not an id loaded inside the payload');

            const existingCustomer = await prismaClient.customer.findUnique({ where: { id: payload.id } });

            if (!existingCustomer) throw CustomError.notFound('The customer does not exist');

            if (existingCustomer.token !== token) throw CustomError.unauthorized('The token provided was already used');

            req.body.id = payload.id;
            next();
        } catch (error) {
            if (error instanceof CustomError) return res.status(error.statusCode).json({ ok: false, mesagge: error.message });

            console.log(error);
            return res.status(500).json({ ok: false, message: 'Internal error server' });
        }
    }
}