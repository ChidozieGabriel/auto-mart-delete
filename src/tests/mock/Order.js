class Order {
  constructor() {
    this.order = {
      car_id: null,
      price_offered: null,
    };

    this.orderWithInvalidCarId = {
      car_id: 'invalid id',
      price_offered: 1200,
    };
  }
}

export default Order;
