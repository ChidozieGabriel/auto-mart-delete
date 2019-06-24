/* eslint-disable camelcase */
import chai, { should, expect, assert } from 'chai';
import chaiHTTP from 'chai-http';
import server from '..';
import { User, Car, Flag } from './mock';
import Utils from './Utils';

should();
chai.use(chaiHTTP);
const utils = new Utils(server);
const { user } = new User();
const { car } = new Car(0);
const { flag, flagInvalidCarId } = new Flag();
const apiV1 = '/api/v1';
const signUpRoute = `${apiV1}/auth/signup`;

describe('CAR FLAG ROUTES', () => {
  before((done) => {
    utils
      .postUser(signUpRoute, user)
      .then(() => {
        const carRoute = `${apiV1}/car`;
        utils
          .post(carRoute, car)
          .then((res) => {
            flag.car_id = res.body.data.id;
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });

  describe('POST /flag', () => {
    it('should throw error when there is no token provided', (done) => {
      const route = `${apiV1}/flag`;
      utils
        .post(route, flag, null)
        .then((res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('error');
          expect(res.body.status).to.eql(res.status);
          done();
        })
        .catch(err => done(err));
    });

    it('should create a flag/report against a car', (done) => {
      const route = `${apiV1}/flag`;
      utils
        .post(route, flag)
        .then((res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');

          const { status, data } = res.body;
          expect(status).to.eql(res.status);
          expect(data).to.be.an('object');
          data.should.have.property('id');
          data.should.have.property('car_id');
          data.should.have.property('reason');
          data.should.have.property('description');

          const { car_id, reason } = data;
          assert.equal(car_id, flag.car_id);
          assert.equal(reason, flag.reason);

          done();
        })
        .catch(err => done(err));
    });

    it('should throw error when the car-id is not valid', (done) => {
      const route = `${apiV1}/order`;
      utils
        .post(route, flagInvalidCarId)
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('error');
          expect(res.body.status).to.eql(res.status);
          done();
        })
        .catch(err => done(err));
    });
  });
});
