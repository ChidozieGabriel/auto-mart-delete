import jwt from 'jsonwebtoken';
import config from '../config';

class JwtHandler {
  static getToken (payload) {
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
}

export default JwtHandler
