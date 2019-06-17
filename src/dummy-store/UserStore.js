import Store from './Store';

class UserStore extends Store {
  constructor() {
    super();
    if (!UserStore.instance) {
      this.data = [];
      UserStore.instance = this;
    }

    return UserStore.instance;
  }

  create(user) {
    const u = super.create(user);
    return UserStore.extract(u);
  }

  get(id) {
    const user = super.get(id);
    return user ? UserStore.extract(user) : null;
  }

  getByEmail({ email, password }) {
    const aUser = this.data.find(user => user.email === email && user.password === password);
    return aUser ? UserStore.extract(aUser) : null;
  }

  getAll() {
    return this.data;
  }

  clear() {
    this.data.length = 0;
  }

  static extract({ password, ...userWithoutPassword }) {
    return userWithoutPassword;
  }
}

const instance = new UserStore();

export default instance;
