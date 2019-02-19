'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserMood = sequelize.define('UserMood', {
    userId: DataTypes.INTEGER,
    mood: DataTypes.INTEGER
  }, {
    tableName: 'user_moods',
  });
  UserMood.associate = function(models) {
    // associations can be defined here
    UserMood.belongsTo(models.User, {foreignKey: 'userId'});
  };
  return UserMood;
};
