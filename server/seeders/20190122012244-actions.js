'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('actions', [
        {
          name: 'Wave Your Hands',
          icon: '<span class="icon fa-hand-paper far fa-flip-horizontal"></span><span class="icon fa-hand-paper far"></span>',
          type: 'physical',
          description: 'Wave your hands in the air for 30 seconds.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Phone a Friend',
          icon: '<span class="icon fa-phone far"></span>',
          type: 'social',
          description: 'Call a friend and chat for at least 5 minutes.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Take a Walk',
          icon: '<span class="icon fa-walking fas"></span>',
          type: 'physical',
          description: 'Take a walk around the block.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Make a List',
          icon: '<span class="icon fa-clipboard-list far"></span>',
          type: 'selfcare',
          description: 'Make a list of things you like about yourself.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Make a List',
          icon: '<span class="icon fa-clipboard-list far"></span>',
          type: 'selfcare',
          description: 'Make a list of things you want to get done this week.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Make a List',
          icon: '<span class="icon fa-clipboard-list far"></span>',
          type: 'selfcare',
          description: 'Write down three things you accomplished this week.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Be Proud',
          icon: '<span class="icon fa-clipboard-list far"></span>',
          type: 'selfcare',
          description: 'Write down three things you\'re proud of about yourself.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Make Some Plans',
          icon: '<span class="icon fa-comments far"></span>',
          type: 'social',
          description: 'Make plans to hang out with someone this week.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Take the Stairs',
          icon: '<span class="icon fa-walking fas"></span>',
          type: 'physical',
          description: 'Take the stairs at least once today.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('actions', null, {});
  }
};
