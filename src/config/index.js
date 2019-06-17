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
    console.log('PRODUCTION PORT', process.env.PORT);
    break;

  default:
    config.PORT = process.env.PORT || 3000;
    break;
}

config.PRIVATE_KEY = fs.readFileSync('./private.pub', 'utf8');
config.PUBLIC_KEY = fs.readFileSync('./public.pub', 'utf8');

export default config;
