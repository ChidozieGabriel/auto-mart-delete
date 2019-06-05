import { UserStore } from '../store';
import JwtHandler from '../helpers/JwtHandler';
import ResultHandler from '../helpers/ResultHandler';

class UserController {
  static signUp(req, res, next) {
    try {
      const user = UserStore.create(req.body);
      const token = JwtHandler.getToken({ id: user.id });
      const data = { token, ...user };
      ResultHandler.success(res, data, 201);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
