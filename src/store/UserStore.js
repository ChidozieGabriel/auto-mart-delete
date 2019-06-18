/* eslint-disable camelcase */
import uuid from 'uuid/v4';
import bcrypt from 'bcrypt';
import Store from './Store';
import ErrorClass from '../helpers/ErrorClass';
import DB from '../DB';

class UserStore extends Store {
  static async create(user) {
    const {
      email, firstname, lastname, address, password,
    } = user;

    if (!(email && password)) {
      throw new ErrorClass('Enter email and password');
    }

    const id = uuid();
    const created_on = new Date();
    const query = 'INSERT INTO users(id, created_on, email, firstname, lastname, address, password) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const hashedPassword = await bcrypt.hash(password, 10);
    const params = [id, created_on, email, firstname, lastname, address, hashedPassword];
    const res = await DB.query(query, params);

    return UserStore.extract(res);
  }

  get(id) {
    const user = super.get(id);
    return user ? UserStore.extract(user) : null;
  }

  static async getByEmail({ email, password }) {
    if (!(email && password)) {
      throw new ErrorClass('Enter email and password');
    }

    const query = `
      SELECT * FROM users 
      WHERE 
        email = $1
    `;
    const params = [email];
    const res = await DB.query(query, params);
    if (!res) {
      throw new ErrorClass('User is not registered!');
    }

    const isPassword = await bcrypt.compare(password, res.password);
    if (!isPassword) {
      throw new ErrorClass('Incorrect password');
    }

    return UserStore.extract(res);
  }

  getAll() {
    return this.data;
  }

  clear() {
    this.data.length = 0;
  }

  static extract({ password, ...userWithoutPassword }) {
    return userWithoutPassword;
  }
}

export default UserStore;
