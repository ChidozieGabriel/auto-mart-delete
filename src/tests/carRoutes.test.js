/* eslint-disable camelcase */
import chai, { should, expect, assert } from 'chai';
import chaiHTTP from 'chai-http';
import server from '..';
import async from 'async';
import fs from 'fs';
import { User, Car } from './mock';
import Utils from './Utils';

should();
chai.use(chaiHTTP);
const utils = new Utils(server);
const { user, anotherUser } = new User();
const { car, carWithImage, randomCars } = new Car();
const apiV1 = '/api/v1';
let postedCar = {};

const postCars = function postCars(callback, eachCar) {
  const route = `${apiV1}/car`;
  utils
    .post(route, eachCar)
    .then(() => callback(null, null))
    .catch(err => callback(err, null));
};

describe('CAR ROUTES "/car"', () => {
  before((done) => {
    utils
      .postUser(`${apiV1}/auth/signup`, user)
      .then(() => {
        let count = 0;
        async.whilst(
          (cb) => {
            cb(null, count < randomCars.length);
          },
          (callback) => {
            const eachCar = randomCars[count];
            count += 1;
            postCars(callback, eachCar);
          },
          (err) => {
            if (err) done(err);
            else done();
          },
        );
      })
      .catch(err => done(err));
  });

  describe('POST /car', () => {
    it('should post a car', (done) => {
      const route = `${apiV1}/car`;
      utils
        .post(route, car)
        .then((res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          const { status, data } = res.body;
          expect(status).to.eql(res.status);
          expect(data).to.be.an('object');
          postedCar = { ...data };

          expect(data).to.have.property('id');
          expect(data).to.have.property('price');
          expect(data).to.have.property('manufacturer');
          expect(data).to.have.property('owner');

          done();
        })
        .catch(err => done(err));
    });

    it('should upload car image', (done) => {
      const route = `${apiV1}/car`;
      const files = { image: fs.readFileSync(carWithImage.imagePath) };
      utils
        .postFile(route, car, files)
        .then((res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          const { status, data } = res.body;
          expect(status).to.eql(res.status);
          expect(data).to.be.an('object');
          expect(data).to.have.property('image_url');

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  xdescribe('PATCH /car/<:car-id>/status', () => {
    it('should mark a posted car Ad as sold', (done) => {
      const route = `${apiV1}/car/${postedCar.id}/status`;
      const statusObj = { status: 'sold' };
      utils
        .patch(route, statusObj)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          const { status, data } = res.body;
          expect(status).to.eql(res.status);
          expect(data).to.be.an('object');
          expect(data).to.have.property('email');
          const { id, status: carStatus } = data;
          expect(id).to.eql(postedCar.id);
          expect(carStatus).to.eql(statusObj.status);
          done();
        })
        .catch(err => done(err));
    });

    it('should throw error when status is not valid ', (done) => {
      const route = `${apiV1}/car/${postedCar.id}/status`;
      const statusObj = { status: 'invalid status' };
      utils
        .patch(route, statusObj)
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

    it('should throw error when car update is not done by owner', (done) => {
      utils
        .postUser(`${apiV1}/auth/signup`, anotherUser, false)
        .then(({ body: { data: { token } } }) => {
          const statusObj = { status: 'available' };
          const statusRoute = `${apiV1}/car/${postedCar.id}/status`;
          utils
            .patch(statusRoute, statusObj, token)
            .then((res) => {
              res.clientError.should.eql(true);
              res.body.should.be.an('object');
              res.body.should.have.property('error');
              const { status } = res.body;
              expect(status).to.eql(res.status);
              utils
                .get(`${apiV1}/car/${postedCar.id}`)
                .then((res1) => {
                  assert.notEqual(res1.body.data.status, statusObj.status);
                  done();
                })
                .catch(err => done(err));
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });
  });

  xdescribe('PATCH /car/<:car-id>/price', () => {
    it('should update the price of a car', (done) => {
      const newPrice = Number(postedCar.price) * 1.2;
      const route = `${apiV1}/car/${postedCar.id}/price`;
      const obj = { price: newPrice };
      utils
        .patch(route, obj)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');

          const { status, data } = res.body;
          expect(status).to.eql(res.status);
          expect(data).to.be.an('object');
          expect(data).not.to.have.property('user_id');
          expect(data).to.have.property('email');

          const { price } = data;
          expect(price).to.equal(String(newPrice));

          done();
        })
        .catch(err => done(err));
    });

    it('should throw error when price is not a valid number', (done) => {
      const newPrice = 'jdljkjl';
      const route = `${apiV1}/car/${postedCar.id}/price`;
      const obj = { price: newPrice };
      utils
        .patch(route, obj)
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

    it('should only update the price of a car by its owner', (done) => {
      const newPrice = Number(postedCar.price) * 0.6;
      utils
        .postUser(`${apiV1}/auth/signup`, anotherUser, false)
        .then(({ body: { data: { token } } }) => {
          const route = `${apiV1}/car/${postedCar.id}/price`;
          const obj = { price: newPrice };
          utils
            .patch(route, obj, token)
            .then((res) => {
              res.clientError.should.eql(true);
              res.body.should.be.an('object');
              res.body.should.have.property('error');
              const { status } = res.body;
              expect(status).to.eql(res.status);

              utils
                .get(`${apiV1}/car/${postedCar.id}`)
                .then((res1) => {
                  assert.notEqual(res1.body.data.price, newPrice);
                  done();
                })
                .catch(err => done(err));
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });
  });

  describe('GET /car/<:car-id>/', () => {
    it('should get a specific car', (done) => {
      utils
        .get(`${apiV1}/car/${postedCar.id}`)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          const { status, data } = res.body;
          expect(status).to.eql(200);
          expect(data).to.be.an('object');
          const { id, owner } = data;
          expect(id).to.eql(postedCar.id);
          expect(owner).to.eql(postedCar.owner);
          done();
        })
        .catch(err => done(err));
    });

    it('should throw error if id is not valid', (done) => {
      const invalidId = 'invalid id';
      utils
        .get(`${apiV1}/car/${invalidId}`)
        .then((res) => {
          res.clientError.should.eql(true);
          res.body.should.be.an('object');
          res.body.should.have.property('error');
          const { status } = res.body;
          expect(status).to.eql(res.status);
          done();
        })
        .catch(err => done(err));
    });
  });

  xdescribe('GET /car?status=available', () => {
    it('should get all unsold cars', (done) => {
      const query = { status: 'available' };
      utils
        .get(`${apiV1}/car`, query)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          const { status, data } = res.body;
          expect(status).to.eql(res.status);
          // eslint-disable-next-line no-unused-expressions
          expect(data).to.be.an('array').and.not.empty;
          expect(data).to.satisfy(cars => cars.every(eachCar => eachCar.status === 'available'));
          done();
        })
        .catch(err => done(err));
    });
  });

  xdescribe('GET /car?status=available&min_price=​XXXValue​&max_price=XXXValue', () => {
    it('should get all unsold cars within a price range', (done) => {
      const minPrice = 100;
      const maxPrice = 100000;
      const carStatus = 'available';
      const route = `${apiV1}/car`;
      const query = { status: carStatus, min_price: minPrice, max_price: maxPrice };
      utils
        .get(route, query)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          const { status, data } = res.body;
          expect(status).to.eql(res.status);
          expect(data).to.be.an('array');
          expect(data).to.satisfy(cars => cars.every(
            eachCar => eachCar.status === 'available'
                && eachCar.price >= minPrice
                && eachCar.price <= maxPrice,
          ));

          done();
        })
        .catch(err => done(err));
    });
  });

  xdescribe('DELETE /car/<:car_id>/', () => {
    it('should delete a specific car Ad', (done) => {
      utils
        .delete(`${apiV1}/car/${postedCar.id}`)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          const { status, data } = res.body;
          expect(status).to.eql(res.status);
          expect(data).to.be.a('string');
          expect(data).to.include('Car Ad successfully deleted');
          utils
            .get(`${apiV1}/car`)
            .then((res1) => {
              expect(res1.body.data).to.satisfy(cars => cars.some(c => c.id !== postedCar.id));
              done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });
  });

  xdescribe('GET /car/', () => {
    it('should view all posted ads whether sold or available', (done) => {
      utils
        .get(`${apiV1}/car`)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          const { status, data } = res.body;
          expect(status).to.eql(res.status);
          // eslint-disable-next-line no-unused-expressions
          expect(data).to.be.an('array').and.not.empty;
          /*
          expect(data).to.satisfy(cars =>
          cars.every(eachCar =>
          eachCar.status === 'sold' || eachCar.status === 'available'));
          */

          done();
        })
        .catch(err => done(err));
    });
  });
});
