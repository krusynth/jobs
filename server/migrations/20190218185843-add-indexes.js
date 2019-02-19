'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return       queryInterface.addIndex('jobs', { fields: ['userId'],   name: 'jobs_user_id' })
    .then( () => queryInterface.addIndex('jobs', { fields: ['watching'], name: 'jobs_watching' }) )
    .then( () => queryInterface.addIndex('jobs', { fields: ['closes'],   name: 'jobs_closes' }) )
    .then( () => queryInterface.addIndex('jobs', { fields: ['status'],   name: 'jobs_status' }) )
    .then( () => queryInterface.addIndex('jobs', { fields: ['name'],     name: 'jobs_name' }) )
    .then( () => queryInterface.addIndex('jobs', { fields: ['company'],  name: 'jobs_company' }) )

    .then( () => queryInterface.addIndex('job_events', { fields: ['jobId'], name: 'job_events_job_id' }) )
    .then( () => queryInterface.addIndex('job_events', { fields: ['date'],  name: 'job_events_date' }) )

    .then( () => queryInterface.addIndex('users', { fields: ['email'],    name: 'users_email' }) )
    .then( () => queryInterface.addIndex('users', { fields: ['password'], name: 'users_password' }) )

    .then( () => queryInterface.addIndex('user_actions', { fields: ['userId'],   name: 'users_actions_user_id' }) )
    .then( () => queryInterface.addIndex('user_actions', { fields: ['actionId'], name: 'users_actions_action_id' }) )
  },

  down: (queryInterface, Sequelize) => {
    return       queryInterface.removeIndex('jobs', 'jobs_user_id')
    .then( () => queryInterface.removeIndex('jobs', 'jobs_watching') )
    .then( () => queryInterface.removeIndex('jobs', 'jobs_closes') )
    .then( () => queryInterface.removeIndex('jobs', 'jobs_status') )
    .then( () => queryInterface.removeIndex('jobs', 'jobs_name') )
    .then( () => queryInterface.removeIndex('jobs', 'jobs_company') )

    .then( () => queryInterface.removeIndex('job_events', 'job_events_job_id') )
    .then( () => queryInterface.removeIndex('job_events', 'job_events_date') )

    .then( () => queryInterface.removeIndex('users', 'users_email') )
    .then( () => queryInterface.removeIndex('users', 'users_password') )

    .then( () => queryInterface.removeIndex('user_actions', 'users_actions_user_id') )
    .then( () => queryInterface.removeIndex('user_actions', 'users_actions_action_id') )
  }
};
