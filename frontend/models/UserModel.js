import Model from './Model';

export default class UserModel extends Model {
  url = 'user';

  getCurrent() {
    return this.read('current');
  }
}
