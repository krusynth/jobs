'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserLevel = sequelize.define('UserLevel', {
    name: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
  	tableName: 'user_levels'
  });
  UserLevel.associate = function(models) {
    // associations can be defined here
  };
  return UserLevel;
};