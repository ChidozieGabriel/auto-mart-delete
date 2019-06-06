import jwt from 'jsonwebtoken';
import config from '../config';
import ErrorClass from './ErrorClass';

class JwtHandler {
  static getToken(payload) {
    return jwt.sign(payload, config.PRIVATE_KEY, { expiresIn: '1d', algorithm: 'RS256' });
  }

  static verifyToken(token, cb) {
    jwt.verify(token, config.PUBLIC_KEY, { algorithms: ['RS256'] }, (err, payload) => {
      if (err) {
        cb(err, null);
        return;
      }
      cb(null, payload);
    });
  }

  static authorize(req, res, next) {
    try {
      if (!(req.headers && req.headers.authorization)) {
        throw new ErrorClass('No authorization provided', 401);
      }

      const values = req.headers.authorization.split(' ');
      const bearer = values[0];
      const token = values[1];

      if (!(values.length === 2 && bearer === 'Bearer')) {
        throw new ErrorClass(
          "Set authorization in the format {Authorization: 'Bearer placeYourTokenHere'}",
          401,
        );
      }

      JwtHandler.verifyToken(token, (err, payload) => {
        if (!token) {
          throw new ErrorClass('No token provided', 401);
        }

        if (err) {
          next(new ErrorClass(err.message, 401));
          return;
        }

        req.user = payload;
        next();
      });
    } catch (error) {
      next(error);
    }
  }
}

export default JwtHandler;
