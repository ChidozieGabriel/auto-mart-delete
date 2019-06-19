import { Pool } from 'pg';
import config from '../config';
import Utils from '../helpers/Utils';

console.log('DB: ', config.DB);

const pool = new Pool({
  connectionString: config.DB,
});

class DB {
  static async query(query, params) {
    const queryline = Utils.oneLineString(query);
    const start = Date.now();
    const result = await pool.query(queryline, params);
    const duration = Date.now() - start;
    const noOfRows = result ? result.rowCount : 0;
    console.log('QUERY EXECUTED:\n', { text: queryline, duration, noOfRows });

    return result.rows[0];
  }
}

export default DB;
