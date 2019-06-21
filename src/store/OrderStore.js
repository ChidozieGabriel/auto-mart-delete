/* eslint-disable camelcase */
import uuid from 'uuid/v4';
import ErrorClass from '../helpers/ErrorClass';
import DB from '../DB';

class OrderStore {
  static async create(user_id, { car_id, price_offered }) {
    if (!(car_id && price_offered)) {
      throw new ErrorClass('Invalid input. Enter valid car id and price offered');
    }

    const id = uuid();
    const created_on = new Date();
    const query = `
    INSERT INTO orders (
      id, created_on, user_id, car_id, price_offered
    )
    VALUES (
      $1, $2, $3, $4, $5
    )
    `;
    const params = [id, created_on, user_id, car_id, price_offered];
    await DB.query(query, params).catch(() => {
      throw new ErrorClass('Invalid input. Check that car_id is correct.');
    });

    const query2 = `
    SELECT 
      o.id,
      o.car_id,
      o.created_on,
      o.price_offered,
      o.status,
      c.price
    FROM orders o
    INNER JOIN cars c ON o.car_id = c.id
    WHERE o.id = $1
    AND o.user_id = $2
    `;
    const params2 = [id, user_id];
    const res = await DB.query(query2, params2);

    return res;
  }

  static async updatePrice(id, user_id, { price_offered }) {
    if (!price_offered) {
      throw new ErrorClass('Invalid input. Enter valid price offered');
    }

    const query1 = `
    SELECT 
      price_offered old_price_offered 
    FROM orders
    WHERE 
      id = $1
    AND
      user_id = $2
    `;
    const params1 = [id, user_id];
    const res1 = await DB.query(query1, params1).catch(() => {
      throw new ErrorClass('Invalid input. Enter valid order id.');
    });

    if (Object.keys(res1).length === 0) {
      throw new ErrorClass('Order not found', 404);
    }

    const query2 = `
    UPDATE orders 
    SET price_offered = $1
    WHERE id = $2
    AND user_id = $3
    RETURNING
      id,
      car_id,
      status,
      price_offered new_price_offered
    `;
    const params2 = [price_offered, id, user_id];
    const res2 = await DB.query(query2, params2).catch(() => {
      throw new ErrorClass('Invalid input.');
    });

    return { ...res2, ...res1 };
  }
}

export default OrderStore;
