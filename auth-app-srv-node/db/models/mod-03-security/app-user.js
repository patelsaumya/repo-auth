'use strict';

const {DataTypes, Model} = require("sequelize")

class AppUser extends Model {
  static associate(models) {
    AppUser.hasOne(models.AppUserSensitiveInfo, {foreignKey: 'userId'});
  }
}

module.exports = function (sequelize) {
  AppUser.init({
    userId: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userType: {
      type: DataTypes.CHAR,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize, // We need to pass the connection instance
    modelName: 'AppUser', // We need to choose the model name,
    indexes: [{
      unique: false,
      fields: ['fullName']
    }]
  });
  return AppUser;
}
