import '@babel/polyfill';
import express, { json, urlencoded } from 'express';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import routesV1 from './routes/v1';
import ResultHandler from './helpers/ResultHandler';
import config from './config';
import swaggerDoc from '../swagger.json';

const app = express();
app.use(cors(config.CORS_OPTIONS));
app.use(logger('dev'));

app.use(json());
app.use(urlencoded({ extended: false }));
// app.use(multer().array());

app.get('/', (req, res) => res.json({
  message: "Welcome to Auto-Mart. Access API docs through '/api-docs'",
}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.get('/api', (req, res) => res.json({
  message: "Welcome to Auto-Mart API. Access API docs through '/api-docs'",
}));
app.use('/api/v1', routesV1);
app.use('*', (req, res, next) => {
  const error = Error('Not Found');
  error.status = 404;
  next(error);
});
app.use(ResultHandler.error);
app.set('port', config.PORT);
app.listen(config.PORT, () => {
  console.log('Server started on port: ', config.PORT);
});

export default app;
