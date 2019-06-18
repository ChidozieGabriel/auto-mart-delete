import { UserStore } from '../store';
import JwtHandler from '../helpers/JwtHandler';
import ResultHandler from '../helpers/ResultHandler';
import ErrorClass from '../helpers/ErrorClass';

class UserController {
  static async signUp(req, res, next) {
    try {
      const user = await UserStore.create(req.body);
      const token = JwtHandler.getToken({ id: user.id });
      const data = { token, ...user };
      ResultHandler.success(res, data, 201);
    } catch (error) {
      next(error);
    }
  }

  static async signIn(req, res, next) {
    try {
      const user = await UserStore.getByEmail(req.body);
      const token = JwtHandler.getToken({ id: user.id });
      const data = { token, ...user };
      ResultHandler.success(res, data);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
