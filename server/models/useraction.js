'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserAction = sequelize.define('UserAction', {
    userId: DataTypes.INTEGER,
    actionId: DataTypes.INTEGER,
    result: DataTypes.STRING,
    message: DataTypes.STRING
  }, {
    tableName: 'user_actions',
  });
  UserAction.associate = function(models) {
    // associations can be defined here
    UserAction.belongsTo(models.User, {foreignKey: 'userId'});
    UserAction.belongsTo(models.Action, {foreignKey: 'actionId'});
  };
  return UserAction;
};
