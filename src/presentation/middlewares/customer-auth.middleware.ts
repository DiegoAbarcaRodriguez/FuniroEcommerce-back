import { NextFunction, Request, Response } from "express";
import { JWTAdaptador } from "../../config/plugin";
import { prismaClient } from "../../data";

export class CustomerAuthMiddleware {
    static async validateIsLoggedIn(req: Request, res: Response, next: NextFunction): Promise<any> {

        const authorization = req.header('Authorization');

        if (!authorization) return res.status(401).json({ ok: false, message: 'Token not provided' });
        if (!authorization!.startsWith('Bearer ')) return res.status(401).json({ ok: false, message: 'Invalid Bearer token' });

        const token = authorization!.split(' ').at(1) || '';

        try {
            const payload = await JWTAdaptador.validateToken<{ email: string }>(token);
            if (!payload) return res.status(401).json({ ok: false, message: 'Token not valid' });

            const customer = await prismaClient.customer.findFirst({
                where: { email: payload!.email }
            });

            if (!customer) return res.status(401).json({ ok: false, message: 'Token not valid - customer' });

            req.body.customer = customer;
            next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ ok: false, message: 'Internal server error' });
        }

    }
}