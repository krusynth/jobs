'use strict';

const { Op } = require("sequelize");
const { User } = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return User.findAll({where: {'meta.calendarId': {[Op.or]: ['', null]}}}).then(users => {
      console.log(`Found ${users.length} users.`);

      if(users.length) {
        return Promise.all(
          users.map(user => {
            user.set({'meta.calendarId': User.generateToken()});

            return user.save()
              .catch(error => console.log(error));
          })
        );
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return User.findAll().then(users => {
      console.log(`Found ${users.length} users.`);

      return Promise.all(
        users.map(async (user) => {
          user.set({'meta.calendarId': null});

          return user.save()
            .catch(error => console.log(error));
        })
      );
    });

    // return Promise.resolve();
  }
};
