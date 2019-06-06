/* eslint-disable camelcase */
import chai, { should, expect } from 'chai';
import chaiHTTP from 'chai-http';
import server from '..';
import async from 'async';
import { car, randomCars } from './models/car';
import user from './models/user';

should();
chai.use(chaiHTTP);

const apiV1 = '/api/v1';
const manyCars = randomCars(5);
let postedCar = {};
let token = '';

const postCars = function postCars(callback, eachCar) {
  chai
    .request(server)
    .post(`${apiV1}/car`)
    .set({ Authorization: `Bearer ${token}` })
    .send(eachCar)
    .then(() => {
      callback(null, null);
    })
    .catch(err => callback(err, null));
};

describe('Car routes "/car"', () => {
  before((done) => {
    chai
      .request(server)
      .post(`${apiV1}/auth/signup`)
      .send(user)
      .then((res) => {
        const { token: t } = res.body.data;
        token = t;
        // done();
      })
      .catch(err => done(err));

    let count = 0;
    async.whilst(
      (cb) => {
        cb(null, count < manyCars.length);
      },
      (callback) => {
        const eachCar = manyCars[count];
        count += 1;
        postCars(callback, eachCar);
      },
      (err) => {
        if (err) done(err);
        else done();
      },
    );
  });

  describe('POST /car', () => {
    it('should post a car', (done) => {
      chai
        .request(server)
        .post(`${apiV1}/car`)
        .set({ Authorization: `Bearer ${token}` })
        .send(car)
        .then((res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          const { status, data } = res.body;
          expect(status).to.eql(res.status);
          expect(data).to.be.an('object');
          expect(data).to.have.property('id');
          expect(data)
            .to.have.property('price')
            .and.to.be.a('number');

          postedCar = { ...data };
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('PATCH /car/<:car-id>/status', () => {
    it('should mark a posted car Ad as sold', (done) => {
      chai
        .request(server)
        .patch(`${apiV1}/car/${postedCar.id}/status`)
        .set({ Authorization: `Bearer ${token}` })
        .send({ status: 'sold' })
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');

          const { status, data } = res.body;
          expect(status).to.eql(res.status);
          expect(data).to.be.an('object');

          const { id, status: carStatus } = data;
          expect(id).to.eql(postedCar.id);
          expect(carStatus).to.eql('sold');

          done();
        })
        .catch(err => done(err));
    });
  });

  describe('PATCH /car/<:car-id>/price', () => {
    it('should update the price of a car', (done) => {
      const newPrice = 100.0;
      chai
        .request(server)
        .patch(`${apiV1}/car/${postedCar.id}/price`)
        .set({ Authorization: `Bearer ${token}` })
        .send({ price: newPrice })
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');

          const { status, data } = res.body;
          expect(status).to.eql(res.status);
          expect(data).to.be.an('object');

          const { price } = data;
          expect(price).to.eql(newPrice);

          done();
        })
        .catch(err => done(err));
    });
  });
});
