'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.renameColumn('job_events', 'contacts', 'notes');
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.renameColumn('job_events', 'notes', 'contacts');
  }
};
