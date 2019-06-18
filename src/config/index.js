import 'dotenv/config';
import fs from 'fs';

const config = {};

switch (process.env.NODE_ENV) {
  case 'test':
    config.PORT = process.env.TEST_PORT;
    config.DB = process.env.TEST_DB;
    break;

  case 'dev':
    config.PORT = process.env.DEV_PORT;
    config.DB = process.env.DB;
    break;

  case 'prod':
    config.PORT = process.env.PROD_PORT;
    config.DB = process.env.DB;
    break;

  default:
    config.PORT = process.env.PORT || 3000;
    config.DB = process.env.DB;
    break;
}

if (!config.PORT) {
  config.PORT = 3000;
}

config.PRIVATE_KEY = fs.readFileSync('./private.pub', 'utf8');
config.PUBLIC_KEY = fs.readFileSync('./public.pub', 'utf8');

export default config;
