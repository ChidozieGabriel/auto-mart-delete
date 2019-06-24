/* eslint-disable camelcase */
import { FlagStore } from '../store';
import ResultHandler from '../helpers/ResultHandler';

class FlagController {
  static async create(req, res, next) {
    try {
      const flag = await FlagStore.create(req.user.id, req.body);
      const data = { ...flag };
      ResultHandler.success(res, data, 201);
    } catch (err) {
      next(err);
    }
  }
}

export default FlagController;
