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
      RETURNING *`;
    const params = [price, id];
    const res = await DB.query(query, params).catch(() => {
      throw new ErrorClass('Resource not found!', 404);
    });

    if (!res.id) {
      throw new ErrorClass('Resource not found!', 404);
    }

    if (res.user_id !== user_id) {
      throw new ErrorClass('Forbidden access', 403);
    }

    return res;
  }

  filterByStatus(status, data = this.data) {
    return data.filter(e => e.status === status);
  }

  filterByPrice(minPrice, maxPrice, data = this.data) {
    return data.filter(e => e.price >= minPrice && e.price <= maxPrice);
  }

  filterByStatusAndPrice(status, minPrice, maxPrice) {
    return this.data.filter(e => e.status === status && e.price >= minPrice && e.price <= maxPrice);
  }
}

export default CarStore;
