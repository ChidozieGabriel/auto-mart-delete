/* eslint-disable camelcase */
import uuid from 'uuid/v4';
import ErrorClass from '../helpers/ErrorClass';
import DB from '../DB';

class FlagStore {
  static async create(user_id, { car_id, reason, description }) {
    if (!(car_id && reason)) {
      throw new ErrorClass('Invalid input. Enter valid car id and price offered');
    }

    const id = uuid();
    const created_on = new Date();
    const query = `
    INSERT INTO flags (
      id, created_on, user_id, car_id, reason, description
    )
    VALUES (
      $1, $2, $3, $4, $5, $6
    )
    RETURNING 
      id, created_on, car_id, reason, description
    `;
    const params = [id, created_on, user_id, car_id, reason, description];
    return DB.query(query, params).catch(() => {
      throw new ErrorClass('Invalid input. Check that car_id is correct.');
    });
  }
}

export default FlagStore;
