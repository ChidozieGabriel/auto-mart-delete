/* eslint-disable camelcase */
import uuid from 'uuid/v4';
import Store from './Store';
import ErrorClass from '../helpers/ErrorClass';
import DB from '../DB';

class CarStore extends Store {
  static async create(
    user_id,
    {
      state, status, price, manufacturer, model, body_type, image_url,
    },
  ) {
    if (!(price && manufacturer)) {
      throw new ErrorClass('Enter price and manufacturer');
    }

    const id = uuid();
    const created_on = new Date();
    const query = `
      INSERT INTO cars(
        id, user_id, created_on, state, status, price, manufacturer, model, body_type, image_url
      )
      VALUES(
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      ) 
      RETURNING *`;
    const params = [
      id,
      user_id,
      created_on,
      state,
      status,
      price,
      manufacturer,
      model,
      body_type,
      image_url,
    ];
    const res = await DB.query(query, params);

    return res;
  }

  static async get(id) {
    if (!id) {
      throw new ErrorClass('Invalid id.');
    }

    const query = `
      SELECT * FROM cars
      WHERE id = $1
      `;
    const params = [id];
    const res = await DB.query(query, params);

    if (!res || !res.id) {
      throw new Error('Resource not found!', 404);
    }

    return res;
  }

  static async updatePrice(id, user_id, { price }) {
    if (!id) {
      throw new ErrorClass('Invalid id');
    }

    if (!price || !Number.isFinite(price)) {
      throw new ErrorClass('invalid price');
    }

    const query = `
      UPDATE cars
      SET price = $1
      WHERE id = $2
      AND user_id = $3
      RETURNING *`;
    const params = [price, id, user_id];
    const res = await DB.query(query, params).catch(() => {
      throw new ErrorClass('Resource not found!', 404);
    });

    if (!res || !res.id) {
      throw new ErrorClass('Resource not found!', 404);
    }

    const { user_id: u, ...result } = res;
    return result;
  }

  static async updateStatus(id, user_id, { status }) {
    if (!id) {
      throw new ErrorClass('Invalid id');
    }

    if (!status || (status !== 'available' && status !== 'sold')) {
      throw new ErrorClass('invalid status');
    }

    const query = `
      UPDATE cars
      SET status = $1
      WHERE id = $2
      AND user_id = $3
      RETURNING *`;
    const params = [status, id, user_id];
    const res = await DB.query(query, params).catch(() => {
      throw new ErrorClass('Resource not found!', 404);
    });

    if (!res || !res.id) {
      throw new ErrorClass('Resource not found!', 404);
    }

    const { user_id: u, ...result } = res;
    return result;
  }
}

export default CarStore;
