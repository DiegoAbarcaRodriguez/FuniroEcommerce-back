import { NextFunction, Request, Response } from "express";
import { JWTAdaptador } from "../../config/plugin";
import { prismaClient } from "../../data";

export class AuthMiddleware {
    static async validateIsAdmin(req: Request, res: Response, next: NextFunction) {
        const authorization = req.header('Authorization');

        if (!authorization) res.status(401).json({ ok: false, message: 'Token not provided' });
        if (!authorization!.startsWith('Bearer ')) res.status(401).json({ ok: false, message: 'Invalid Bearer token' });

        const token = authorization!.split(' ').at(1) || '';

        try {
            const payload = await JWTAdaptador.validateToken<{ id: string }>(token);
            if (!payload) res.status(401).json({ ok: false, message: 'Token not valid' });

            const user = await prismaClient.user.findUnique({
                where: { id: +payload!.id }
            });

            if (!user) res.status(401).json({ ok: false, message: 'Token not valid - user' });

            if (!user?.is_admin) res.status(401).json({ ok: false, message: 'The user does not have permission to enter' });

            req.body.user = user;
            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Internal server error' });
        }

    }
}