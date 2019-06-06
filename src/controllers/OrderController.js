/* eslint-disable camelcase */
import { OrderStore, CarStore } from '../store';
import ErrorClass from '../helpers/ErrorClass';
import ResultHandler from '../helpers/ResultHandler';

class OrderController {
  static create(req, res, next) {
    try {
      const { car_id, price_offered } = req.body;

      console.log('car_id:', car_id, 'price offered:', price_offered);

      if (!(car_id && price_offered)) {
        throw new ErrorClass('Invalid parameters: \nInclude car_id and price_offered');
      }

      const car = CarStore.get(car_id);
      if (!car.id) {
        throw new ErrorClass(`Invalid car id: ${car_id}`);
      }

      const data = {
        car_id,
        status: car.status,
        price: car.price,
        price_offered,
      };
      const order = OrderStore.create(data);

      ResultHandler.success(res, { ...order }, 201);
    } catch (err) {
      next(err);
    }
  }

  static updatePrice(req, res, next) {
    try {
      const { id } = req.params;
      const { price_offered } = req.body;

      if (!price_offered) throw new ErrorClass('Invalid input');
      const oldOrder = OrderStore.get(id);
      const newOrder = OrderStore.update(id, { price_offered });
      const { price_offered: p, ...result } = newOrder;
      const data = {
        ...result,
        old_price_offered: oldOrder.price_offered,
        new_price_offered: price_offered,
      };

      ResultHandler.success(res, data);
    } catch (err) {
      next(err);
    }
  }
}

export default OrderController;
