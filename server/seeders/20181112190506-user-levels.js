'use strict';

const UserLevel = require('../models')['UserLevel'];

module.exports = {
  up: (queryInterface, Sequelize) => {
    const admin = UserLevel.build({
      name: 'Member',
      isAdmin: false,
    });
    const member = UserLevel.build({
      name: 'Admin',
      isAdmin: true
    })

    return Promise.all([
      admin.save(),
      member.save()
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user_levels', null, {});
  }
};
