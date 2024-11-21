"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envs = void 0;
require("dotenv/config");
const env_var_1 = require("env-var");
exports.envs = {
    PORT: (0, env_var_1.get)('PORT').required().asPortNumber(),
    JWT_SEED: (0, env_var_1.get)('JWT_SEED').required().asString(),
    WEBSERVICE_URL: (0, env_var_1.get)('WEBSERVICE_URL').required().asString()
};
