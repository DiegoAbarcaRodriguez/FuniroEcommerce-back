import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { UserRoutes } from './user/routes';
import { ProductRoutes } from './product/routes';


export class AppRoutes {


  static get routes(): Router {

    const router = Router();


    // Definir las rutas
    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/user', UserRoutes.routes);
    router.use('/api/products', ProductRoutes.routes);
    // router.use('/api/offers', );
    // router.use('/api/customer', );



    return router;
  }


}

