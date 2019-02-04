'use strict';
module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    contacts: DataTypes.TEXT,
    url: DataTypes.STRING,
    closes: DataTypes.DATE,
    status: DataTypes.STRING,
    watching: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER
  }, {
    tableName: 'jobs',
  });
  Job.associate = function(models) {
    Job.belongsTo(models.User, {foreignKey: 'userId'});
    Job.hasMany(models.JobEvent, {foreignKey: 'jobId'});
  };
  return Job;
};