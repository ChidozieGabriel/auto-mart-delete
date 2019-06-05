/* eslint-disable camelcase */
import { CarStore } from '../store';
import ErrorClass from '../helpers/ErrorClass';
import ResultHandler from '../helpers/ResultHandler';

class CarController {
  static create(req, res, next) {
    try {
      const {
        email,
        manufacturer,
        model,
        price,
        status = 'available',
        image_url
      } = req.body;

      if (!(email && manufacturer && price))
        throw new ErrorClass('Invalid parameters');

      const car = CarStore.create({
        email,
        manufacturer,
        model,
        price,
        status,
        image_url
      });

      const data = { ...car };

      ResultHandler.success(res, data, 201);
    } catch (err) {
      next(err);
    }
  }

  static updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) throw new ErrorClass('Invalid input');
      const car = CarStore.update(id, { status });
      const data = { ...car };

      ResultHandler.success(res, data);
    } catch (err) {
      next(err);
    }
  }

  static updatePrice(req, res, next) {
    try {
      const { id } = req.params;
      const { price } = req.body;

      if (!price) throw new ErrorClass('Invalid input');
      const car = CarStore.update(id, { price });
      const data = { ...car };

      ResultHandler.success(res, data);
    } catch (err) {
      next(err);
    }
  }

  static get(req, res, next) {
    try {
      const { id } = req.params;
      const car = CarStore.get(id);
      const data = { ...car };

      ResultHandler.success(res, data);
    } catch (err) {
      next(err);
    }
  }

  static getCars(req, res, next) {
    try {
      const { min_price, max_price, ...search } = req.query;
      let data = CarStore.getAll();

      if (min_price && max_price)
        data = CarStore.filterByPrice(
          Number(min_price),
          Number(max_price),
          data
        );

      if (search && Object.keys(search).length !== 0)
        data = CarStore.filter({ ...search }, data);

      ResultHandler.success(res, [...data]);
    } catch (err) {
      next(err);
    }
  }

  static remove(req, res, next) {
    try {
      const { id } = req.params;
      CarStore.remove(id);
      const data = 'Car Ad successfully deleted';

      ResultHandler.success(res, data);
    } catch (err) {
      next(err);
    }
  }
}

export default CarController;
