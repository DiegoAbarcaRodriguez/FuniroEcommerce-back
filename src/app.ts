import { envs } from "./config/plugin";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import { DateTime } from 'luxon';


(async () => {
    main();
})();

async function main() {
    const server = new Server({
        port: envs.PORT,
        routes: AppRoutes.routes
    });

    server.start();
}