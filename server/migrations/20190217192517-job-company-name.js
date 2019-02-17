'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'jobs',
      'company',
      Sequelize.STRING
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'jobs',
      'company'
    );
  }
};
