import { Pool } from 'pg';

const pool = new Pool();

class DB {
  static async query(query, params) {
    const start = Date.now();
    const result = await pool.query(query, params);
    const duration = Date.now() - start;
    console.log('Query EXECUTED: ', { text: query, duration, noOfRows: result.rowCount });

    return result.rows[0];
  }
}

export default DB;
