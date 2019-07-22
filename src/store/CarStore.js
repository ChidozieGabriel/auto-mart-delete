/* eslint-disable camelcase */
import uuid from 'uuid/v4';
import ErrorClass from '../helpers/ErrorClass';
import DB from '../DB';
import Utils from '../helpers/Utils';

class CarStore {
  static async create(
    user_id,
    {
      state = 'new', status = 'available', price, manufacturer, model, body_type, image_url,
    },
  ) {
    if (!(price && manufacturer)) {
      throw new ErrorClass('Enter price and manufacturer');
    }

    const statusLowerCase = status.toLowerCase();
    if (!(statusLowerCase === 'sold' || statusLowerCase === 'available')) {
      throw new ErrorClass('Invalid status. Car status is either "sold" or "available"');
    }

    const stateLowerCase = state.toLowerCase();
    if (!(stateLowerCase === 'new' || stateLowerCase === 'used')) {
      throw new ErrorClass('Invalid state. Car state is either "new" or "used"');
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
      RETURNING 
      id, user_id, created_on, state, status, price, manufacturer, model, body_type, image_url
      `;
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

    return { ...res, owner: res.user_id };
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

    if (!res) {
      throw new ErrorClass('Resource not found!', 404);
    }

    return { ...res, owner: res.user_id };
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

  static async getAll(filter = {}) {
    const { min_price, max_price, ...rest } = filter;
    const { search: aSearch, noOfParams: aNoOfParams, searchParams } = Utils.constructQuery(rest);
    let search = aSearch || '';
    let noOfParams = aNoOfParams || 0;

    if (min_price) {
      search += noOfParams === 0 ? 'WHERE ' : ' AND ';
      search += `price <= $${(noOfParams += 1)}`;
      searchParams.push(min_price);
    }

    if (max_price) {
      search += noOfParams === 0 ? 'WHERE ' : ' AND ';
      search += `price >= $${(noOfParams += 1)}`;
      searchParams.push(max_price);
    }

    const query = `
    SELECT 
      id, created_on, state, status, price, manufacturer, model, body_type, image_url 
    FROM cars
    ${search}
    ORDER BY _id
    `;
    const params = [...searchParams];
    const res = await DB.query(query, params, true);
    if (!res) {
      throw new ErrorClass('Resource not found!', 404);
    }

    return res;
  }

  static async remove(id) {
    if (!id) {
      throw new ErrorClass('Invalid id.');
    }

    const query = `
      DELETE FROM cars
      WHERE id = $1
      `;
    const params = [id];
    await DB.query(query, params);
  }
}

export default CarStore;
