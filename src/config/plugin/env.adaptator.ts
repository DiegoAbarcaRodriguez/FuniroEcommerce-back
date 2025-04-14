import 'dotenv/config';
import { get } from 'env-var';


export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  JWT_SEED: get('JWT_SEED').required().asString(),
  WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),
  API_KEY: get('API_KEY').required().asString(),
  STRIPE_KEY: get('STRIPE_KEY').required().asString(),
  FRONT_URL: get('FRONT_URL').required().asString(),

  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),

}



