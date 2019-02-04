'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.changeColumn(
        "users",
        "email",
        {
          type : Sequelize.STRING,
          unique : true,
          allowNull : false
        }
      );
  },
  down: (queryInterface, Sequelize) => {
    // No down here.
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
