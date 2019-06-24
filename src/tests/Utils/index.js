import chai from 'chai';

class Utils {
  constructor(server) {
    this.server = server;
  }

  async postUser(route, user, shouldSaveToken = true) {
    const res = await chai
      .request(this.server)
      .post(route)
      .send(user);

    if (shouldSaveToken) this.token = res.body.data.token;
    return res;
  }

  async post(route, obj, token = this.token) {
    return chai
      .request(this.server)
      .post(route)
      .auth(token, { type: 'bearer' })
      .send(obj);
  }

  async postFile(route, fields, files, token = this.token) {
    const req = chai
      .request(this.server)
      .post(route)
      .auth(token, { type: 'bearer' })
      .field(fields);
    Object.entries(files).forEach(([k, v]) => {
      req.attach(k, v);
    });

    return req;
  }

  async get(route, query, token = this.token) {
    return chai
      .request(this.server)
      .get(route)
      .auth(token, { type: 'bearer' })
      .query(query);
  }

  async patch(route, obj, token = this.token) {
    return chai
      .request(this.server)
      .patch(route)
      .auth(token, { type: 'bearer' })
      .send(obj);
  }

  async delete(route, token = this.token) {
    return chai
      .request(this.server)
      .delete(route)
      .auth(token, { type: 'bearer' });
  }
}

export default Utils;
