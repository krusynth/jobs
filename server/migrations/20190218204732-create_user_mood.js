'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_moods', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      mood: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    .then( () => queryInterface.addIndex('user_moods', { fields: ['userId'],    name: 'user_moods_user_id' }) )
    .then( () => queryInterface.addIndex('user_moods', { fields: ['createdAt'], name: 'user_moods_created_at' }) )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('user_moods', 'user_moods_user_id')
    .then( queryInterface.removeIndex('user_moods', 'user_moods_user_id') )
    .then( () => queryInterface.dropTable('user_moods') )
  }
};
