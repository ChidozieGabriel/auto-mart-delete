import { Pool } from 'pg';
import config from '../config';
import Utils from '../helpers/Utils';

const pool = new Pool({
  connectionString: config.DB,
});

class DB {
  static async query(query, params, isArray = false) {
    const queryline = Utils.oneLineString(query);
    const result = await pool.query(queryline, params);
    return isArray ? result.rows : result.rows[0];
  }
}

export default DB;
