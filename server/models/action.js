'use strict';
module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define('Action', {
    name: DataTypes.STRING,
    icon: DataTypes.STRING,
    type: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    tableName: 'actions',
  });
  Action.associate = function(models) {
    // associations can be defined here
  };
  return Action;
};
