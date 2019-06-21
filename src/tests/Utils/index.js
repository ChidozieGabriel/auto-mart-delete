import chai from 'chai';

class Utils {
  constructor(server, apiVersion = '/api/v1') {
    this.server = server;
    this.apiVersion = apiVersion;
  }

  async postUser(user, onlyToken = true) {
    const res = await chai
      .request(this.server)
      .post(`${this.apiVersion}/auth/signup`)
      .send(user);

    return onlyToken ? res.body.data.token : res;
  }

  async postCar(car, token) {
    return chai
      .request(this.server)
      .post(`${this.apiVersion}/car`)
      .set({ Authorization: `Bearer ${token}` })
      .send(car);
  }

  async postOrder(order, token) {
    return chai
      .request(this.server)
      .post(`${this.apiVersion}/order`)
      .set({ Authorization: `Bearer ${token}` })
      .send(order);
  }
}

export default Utils;
