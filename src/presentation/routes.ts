import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { UserRoutes } from './user/routes';


export class AppRoutes {


  static get routes(): Router {

    const router = Router();


    // Definir las rutas
    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/users', UserRoutes.routes);
    // router.use('/api/products', );
    // router.use('/api/offers', );
    // router.use('/api/customer', );



    return router;
  }


}

