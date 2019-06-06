import express, { json, urlencoded } from 'express';
import logger from 'morgan';
import routesV1 from './routes/v1';
import ResultHandler from './helpers/ResultHandler';
import config from './config';

const app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));

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
