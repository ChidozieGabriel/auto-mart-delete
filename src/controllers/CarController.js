/* eslint-disable camelcase */
import { CarStore } from '../store';
import ErrorClass from '../helpers/ErrorClass';
import ResultHandler from '../helpers/ResultHandler';

class CarController {
  static async create(req, res, next) {
    try {
      const car = await CarStore.create(req.user.id, req.body);
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

  static async updatePrice(req, res, next) {
    try {
      const car = await CarStore.updatePrice(req.params.id, req.user.id, req.body);
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

      if (min_price && max_price) {
        data = CarStore.filterByPrice(Number(min_price), Number(max_price), data);
      }

      if (search && Object.keys(search).length !== 0) data = CarStore.filter({ ...search }, data);

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
