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
