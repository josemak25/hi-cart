// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

const { Joi } = require('celebrate');

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number().default(6060),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false)
  }),
  JWT_SECRET: Joi.string()
    .required()
    .description('JWT Secret required to sign'),
  JWT_EXPIRATION_INTERVAL: Joi.string()
    .required()
    .description('JWT_EXPIRATION_INTERVAL required to sign'),
  MONGO_HOST: Joi.string()
    .required()
    .description('Mongo DB host url'),
  MONGO_PORT: Joi.number().default(27017),
  CLIENT_SIDE_URL: Joi.string()
    .required()
    .description('Hi-cart client-side URL'),
  HI_CART_DEV_EMAIL: Joi.string()
    .required()
    .description('Official email for hi-cart')
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpirationInterval: envVars.JWT_EXPIRATION_INTERVAL,
  mongo: {
    host: process.env.NODE_ENV === 'development' ? envVars.MONGO_HOST : envVars.MONGO_HOST_TEST,
    port: envVars.MONGO_PORT
  },
  clientSideUrl: envVars.CLIENT_SIDE_URL,
  hi_cart_email: envVars.HI_CHAT_DEV_EMAIL
};

module.exports = config;
