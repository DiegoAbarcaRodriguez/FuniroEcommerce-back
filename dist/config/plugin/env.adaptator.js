"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envs = void 0;
require("dotenv/config");
const env_var_1 = require("env-var");
exports.envs = {
    PORT: (0, env_var_1.get)('PORT').required().asPortNumber(),
    JWT_SEED: (0, env_var_1.get)('JWT_SEED').required().asString(),
    WEBSERVICE_URL: (0, env_var_1.get)('WEBSERVICE_URL').required().asString(),
    API_KEY: (0, env_var_1.get)('API_KEY').required().asString(),
    STRIPE_KEY: (0, env_var_1.get)('STRIPE_KEY').required().asString(),
    FRONT_URL: (0, env_var_1.get)('FRONT_URL').required().asString(),
    MAILER_SERVICE: (0, env_var_1.get)('MAILER_SERVICE').required().asString(),
    MAILER_EMAIL: (0, env_var_1.get)('MAILER_EMAIL').required().asString(),
    MAILER_SECRET_KEY: (0, env_var_1.get)('MAILER_SECRET_KEY').required().asString(),
};
