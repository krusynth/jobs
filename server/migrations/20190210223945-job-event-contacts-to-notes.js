'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('job_events', 'contacts', 'notes');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('job_events', 'notes', 'contacts');
  }
};
