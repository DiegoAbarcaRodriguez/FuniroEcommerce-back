import { BcryptjsAdaptor, envs, UUIDAdaptor } from '../config/plugin';
import { prismaClient } from './index';
import express, { Request, Response } from 'express';

(async () => {
    seed();
})();


function seed() {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/', async (req: Request, res: Response) => {
        try {
            await prismaClient.user.create({
                data: {
                    id: UUIDAdaptor.generateUUID(),
                    username: 'admin',
                    password: BcryptjsAdaptor.hashPassword('123456'),
                    is_admin: true,
                    is_root: true
                }
            });
            res.json({ ok: true });
        } catch (error) {
            console.log(error);
            throw error;
        }

    });

    app.listen(envs.PORT, () => {
        console.log('Connected to Port', envs.PORT);
    });
}