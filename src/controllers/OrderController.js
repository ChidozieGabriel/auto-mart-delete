/* eslint-disable camelcase */
import { OrderStore } from '../store';
import ResultHandler from '../helpers/ResultHandler';

class OrderController {
  static async create(req, res, next) {
    try {
      console.log('ORDER:body:', req.body);
      const order = await OrderStore.create(req.user.id, req.body);
      const data = { ...order };
      ResultHandler.success(res, data, 201);
    } catch (err) {
      next(err);
    }
  }

  static async updatePrice(req, res, next) {
    try {
      const order = await OrderStore.updatePrice(req.params.id, req.user.id, req.body);
      const data = { ...order };
      ResultHandler.success(res, data);
    } catch (err) {
      next(err);
    }
  }
}

export default OrderController;
