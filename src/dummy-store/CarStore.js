import Store from './Store';

class CarStore extends Store {
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

const instance = new CarStore();

export default instance;
