import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { UserRoutes } from './user/routes';
import { FurnitureRoutes } from './furniture/routes';


export class AppRoutes {


  static get routes(): Router {

    const router = Router();


    // Definir las rutas
    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/user', UserRoutes.routes);
    router.use('/api/furniture', FurnitureRoutes.routes);
    // router.use('/api/offers', );
    // router.use('/api/customer', );



    return router;
  }


}

