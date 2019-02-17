'use strict';
module.exports = (sequelize, DataTypes) => {
  const JobEvent = sequelize.define('JobEvent', {
    date: DataTypes.DATE,
    type: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    notes: DataTypes.TEXT,
    jobId: DataTypes.INTEGER
  }, {
    tableName: 'job_events',
  });
  JobEvent.associate = function(models) {
    JobEvent.belongsTo(models.Job, {foreignKey: 'jobId'});
  };
  return JobEvent;
};
