import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { UserRoutes } from './user/routes';
import { FurnitureRoutes } from './furniture/routes';
import { OrderRoutes } from './order/routes';
import { ReviewRoutes } from './review/routes';
import { CustomerRoutes } from './customer/routes';
import { CPRoutes } from './cp/routes';
import { StatsRoutes } from './stats/routes';


export class AppRoutes {


  static get routes(): Router {

    const router = Router();


    // Definir las rutas
    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/user', UserRoutes.routes);
    router.use('/api/furniture', FurnitureRoutes.routes);
    router.use('/api/order', OrderRoutes.routes);
    router.use('/api/review', ReviewRoutes.routes);
    router.use('/api/customer', CustomerRoutes.routes);
    router.use('/api/cp', CPRoutes.routes);
    router.use('/api/stats', StatsRoutes.routes);




    return router;
  }


}

