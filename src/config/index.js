import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const config = {};

switch (process.env.NODE_ENV) {
  case 'test':
    config.PORT = process.env.TEST_PORT;
    break;
  case 'dev':
    config.PORT = process.env.DEV_PORT;
    break;
  default:
    break;
}

config.PRIVATE_KEY = fs.readFileSync('./private.pub', 'utf8');
config.PUBLIC_KEY = fs.readFileSync('./public.pub', 'utf8');

export default config;
