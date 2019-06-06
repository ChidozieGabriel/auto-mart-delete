/* eslint-disable camelcase */
import uuid from 'uuid/v4';

class Store {
  constructor() {
    this.data = [];
  }

  create(data) {
    const id = uuid();
    const created_on = Date.now();
    const u = { id, created_on, ...data };
    this.data.push(u);
    return u;
  }

  get(id) {
    const car = this.data.find(user => user.id === id);
    return car || {};
  }

  getAll() {
    return this.data;
  }

  update(id, update) {
    let datum = null;
    this.data = this.data.map((value) => {
      if (value.id === id) {
        datum = { ...value, ...update };
        return datum;
      }

      return value;
    });

    return datum;
  }

  remove(id) {
    let datum = null;
    this.data = this.data.filter((value) => {
      datum = value;
      return value.id !== id;
    });

    return datum;
  }

  clear() {
    this.data.length = 0;
  }

  filter(search = {}, data = this.data) {
    let allFiltered = [];
    Object.entries(search).forEach(([key, value]) => {
      if (!value) return;

      const filter = data.filter(e => e[key] === value);

      allFiltered = [...allFiltered, ...filter];
    });

    return allFiltered;
  }
}

export default Store;
