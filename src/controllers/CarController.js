/* eslint-disable camelcase */
import { CarStore } from '../store';
import ResultHandler from '../helpers/ResultHandler';

class CarController {
  static async create(req, res, next) {
    try {
      const car = await CarStore.create(req.user.id, req.body);
      const { email } = req.user;
      const data = { ...car, email };
      ResultHandler.success(res, data, 201);
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const car = await CarStore.updateStatus(req.params.id, req.user.id, req.body);
      const { email } = req.user;
      const data = { ...car, email };
      ResultHandler.success(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async updatePrice(req, res, next) {
    try {
      const car = await CarStore.updatePrice(req.params.id, req.user.id, req.body);
      const { email } = req.user;
      const data = { ...car, email };
      ResultHandler.success(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async get(req, res, next) {
    try {
      console.log('GET CAR:body:', req.body);
      console.log('GET CAR:param:', req.params);
      console.log('GET CAR:query:', req.query);
      const car = await CarStore.get(req.params.id);
      const data = { ...car };
      ResultHandler.success(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async getCars(req, res, next) {
    try {
      console.log('GET CARs:body:', req.body);
      console.log('GET CARs:param:', req.params);
      console.log('GET CARs:query:', req.query);
      if (req.query === 'sold') {
        // check for admin
      }

      const car = await CarStore.getAll(req.query);
      const data = [...car];
      ResultHandler.success(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req, res, next) {
    try {
      await CarStore.remove(req.params.id);
      const data = 'Car Ad successfully deleted';
      ResultHandler.success(res, data);
    } catch (err) {
      next(err);
    }
  }
}

export default CarController;
