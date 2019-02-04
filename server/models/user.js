'use strict';

const crypto = require('crypto');
const config = require('../config');

const User = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    salt: {
      type: DataTypes.STRING
    },
    token: {
      type: DataTypes.STRING
    },
    meta: {
      type: DataTypes.JSONB
    },
    userLevelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'users'
  });

  User.beforeCreate((user, options) => {
    user = User.setPassword(user);
    return user;
  });

  User.beforeUpdate((user, options) => {
    if(user._changed.password) {
      user = User.setPassword(user);
    }
    return user;
  });

  User.associate = function(models) {
    User.belongsTo(models.UserLevel, {foreignKey: 'userLevelId'});
  };

  User.setPassword = function(user) {
    // We don't have access to all fields by default.
    var rawUser = user.get({raw: true});
    user.set('salt', crypto.randomBytes(32).toString('hex'));
    user.set('password', User.hashPassword(rawUser.password, rawUser.salt));
    return user;
  };

  User.hashPassword = function(password, salt) {
    return crypto.pbkdf2Sync(
      password,
      salt,
      parseInt(config.session.iterations),
      120,
      config.session.method
    ).toString('hex');
  };

  User.generateToken = function() {
    return crypto.randomBytes(16).toString('hex');
  };

  return User;
};
module.exports = User;
