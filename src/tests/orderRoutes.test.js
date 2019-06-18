/* eslint-disable camelcase */
import chai, { should, expect } from 'chai';
import chaiHTTP from 'chai-http';
import server from '..';
import user from './mock/user';
import { car } from './mock/car';

should();
chai.use(chaiHTTP);

const apiV1 = '/api/v1';
const route = `${apiV1}/order`;
const order = {};
const orderWithInvalidCarId = {
  car_id: 'invalid id',
  price_offered: 1200,
};
let postedOrder = {};
let token = '';

xdescribe('Car order routes', () => {
  before((done) => {
    chai
      .request(server)
      .post(`${apiV1}/auth/signup`)
      .send(user)
      .then((res) => {
        const { token: t } = res.body.data;
        token = t;
        // done();
        chai
          .request(server)
          .post(`${apiV1}/car`)
          .set({ Authorization: `Bearer ${token}` })
          .send(car)
          .then((res1) => {
            const { id, price } = res1.body.data;
            order.car_id = id;
            order.price_offered = 0.95 * price;
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });

  describe('POST /order/', () => {
    it('should throw error when there is no token provided', (done) => {
      chai
        .request(server)
        .post(route)
        .send(order)
        .then((res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('error');
          expect(res.body.status).to.eql(res.status);
          done();
        })
        .catch(err => done(err));
    });

    it('should create a purchase order', (done) => {
      chai
        .request(server)
        .post(route)
        .set({ Authorization: `Bearer ${token}` })
        .send(order)
        .then((res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');

          const { status, data } = res.body;
          expect(status).to.eql(res.status);
          expect(data).to.be.an('object');
          data.should.have.property('id');

          postedOrder = { ...data };
          done();
        })
        .catch(err => done(err));
    });

    it('should throw error when the car-id does not exist', (done) => {
      chai
        .request(server)
        .post(route)
        .set({ Authorization: `Bearer ${token}` })
        .send(orderWithInvalidCarId)
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('error');

          const { status } = res.body;
          expect(status).to.eql(res.status);
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('PATCH /order/<:order-id>/price', () => {
    it('should update the price of a purchase order', (done) => {
      if (!postedOrder.id) {
        throw Error('no posted order');
      }

      const newPrice = 1000;
      chai
        .request(server)
        .patch(`${route}/${postedOrder.id}/price`)
        .set({ Authorization: `Bearer ${token}` })
        .send({ price_offered: newPrice })
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');

          const { status, data } = res.body;
          expect(status).to.eql(res.status);
          expect(data).to.be.an('object');

          const {
            id, car_id, old_price_offered, new_price_offered,
          } = data;
          expect(id).to.eql(postedOrder.id);
          expect(car_id).to.eql(postedOrder.car_id);
          expect(old_price_offered).to.eql(postedOrder.price_offered);
          expect(new_price_offered).to.eql(newPrice);

          done();
        })
        .catch(err => done(err));
    });

    it("should not update when order's status does not read pending", () => {
      const newPrice = 100.0;
      chai
        .request(server)
        .patch(`${apiV1}/patch/order/${postedOrder.id}/price`)
        .send(newPrice);
    });
  });
});
