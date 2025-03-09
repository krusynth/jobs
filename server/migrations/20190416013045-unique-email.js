'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('users', 
      {
        type: 'unique', 
        name: 'users_email_unique',
        fields: ['email']
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('users', 'users_email_unique');
  }
};
