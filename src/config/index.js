import 'dotenv/config';
import fs from 'fs';

const config = {};

switch (process.env.NODE_ENV) {
  case 'test':
    config.PORT = process.env.TEST_PORT;
    break;

  case 'dev':
    config.PORT = process.env.DEV_PORT;
    break;

  case 'prod':
    config.PORT = process.env.PROD_PORT;
    break;

  default:
    config.PORT = process.env.PORT || 3000;
    break;
}

if (!config.PORT) {
  config.PORT = 3000;
}

config.PRIVATE_KEY = fs.readFileSync('./private.pub', 'utf8');
config.PUBLIC_KEY = fs.readFileSync('./public.pub', 'utf8');

export default config;
