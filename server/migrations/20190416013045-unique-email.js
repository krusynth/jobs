'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('users', ['email'],
      {type: 'unique', name: 'users_email_unique'});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('users', 'users_email_unique');
  }
};
