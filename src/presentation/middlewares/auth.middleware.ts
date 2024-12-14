import { NextFunction, Request, Response } from "express";
import { JWTAdaptador, UUIDAdaptor } from "../../config/plugin";
import { prismaClient } from "../../data";

export class AuthMiddleware {
    static async validateIsLoggedIn(req: Request, res: Response, next: NextFunction): Promise<any> {

        const authorization = req.header('Authorization');

        if (!authorization) return res.status(401).json({ ok: false, message: 'Token not provided' });
        if (!authorization!.startsWith('Bearer ')) return res.status(401).json({ ok: false, message: 'Invalid Bearer token' });

        const token = authorization!.split(' ').at(1) || '';

        try {
            const payload = await JWTAdaptador.validateToken<{ id: string }>(token);
            if (!payload) return res.status(401).json({ ok: false, message: 'Token not valid' });

            const user = await prismaClient.user.findUnique({
                where: { id: payload!.id }
            });

            if (!user) return res.status(401).json({ ok: false, message: 'Token not valid - user' });
            if (!UUIDAdaptor.isValidUUID(user!.id)) return res.status(401).json({ ok: false, message: 'Token not valid - user' });

            req.body.user = user;
            next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ ok: false, message: 'Internal server error' });
        }

    }
}