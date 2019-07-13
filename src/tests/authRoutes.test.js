/* eslint-disable camelcase */
import chai, { expect, should } from 'chai';
import chaiHTTP from 'chai-http';
import server from '..';
import { User } from './mock';
import Utils from './Utils';

should();
chai.use(chaiHTTP);
const utils = new Utils(server);
const { user, unRegisteredUser } = new User();
const route = '/api/v1/auth';

describe('USER AUTHENTICATION ROUTES', () => {
  describe('POST /auth/signup', () => {
    it('should create a new user account', (done) => {
      utils.postUser(`${route}/signup`, user).then((res) => {
        res.should.have.status(201);
        res.body.should.be.an('object');

        const { status, data } = res.body;
        expect(status).to.eql(res.status);
        expect(data).to.be.an('object');
        data.should.have.property('token');
        data.should.have.property('id');
        data.should.have.property('created_on');
        data.should.not.have.property('password');
        data.should.have.property('is_admin');

        const { email } = data;
        expect(email).to.eql(user.email);

        done();
      }).catch(err => done(err));
    });

    xit('should throw error when user signs up with already used email');
  });

  describe('POST /auth/signin', () => {
    it('should login a registered user', (done) => {
      utils
        .postUser(`${route}/signin`, user, false)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');

          const { status, data } = res.body;
          expect(status).to.eql(res.status);
          res.body.data.should.have.property('token');
          res.body.data.should.have.property('id');

          const { email } = data;
          expect(email).to.eql(user.email);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should throw error if no user is found', (done) => {
      utils
        .post(`${route}/signin`, unRegisteredUser, false)
        .then((res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          const { status } = res.body;
          expect(status).to.eql(res.status);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
