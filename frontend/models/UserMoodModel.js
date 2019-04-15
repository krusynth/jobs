import Model from './Model';

export default class UserMoodModel extends Model {
  url = 'user/mood';

  getRecent() {
    return this.read('recent');
  }
}
