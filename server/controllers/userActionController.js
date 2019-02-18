'use strict';

const Controller = require('../lib/controller');
const { UserAction, User } = require('../models');

class UserActionController extends Controller {
  model = UserAction;
  userModel = User;
  route = '/api/user/action';

  auth = true;

  authField = 'userId';

  beforeCreate(req, res) {
    let data = req.body;

    data[this.authField] = req.session.passport.user.id;

    return Promise.resolve([req, res, data]);
  }

  afterCreate(args) {
    let [data, req, res] = args;
    return this.userModel.findByPk(req.session.passport.user.id)
    .then( user => {
      if(user.meta.actions && user.meta.actions.length) {
        let meta = user.meta;
console.log('pre-meta', user.meta);
        meta.actions = meta.actions.map(elm => {
          if(elm.id == req.body.activityId) {
            elm.result = req.body.result;
          }
          return elm;
        });
        console.log('post-meta', user.meta);
        return user.update({ meta: meta});
      }
    })
    .then( () => {
      return this.readById(req, res);
    });
  }
}

module.exports = UserActionController;
