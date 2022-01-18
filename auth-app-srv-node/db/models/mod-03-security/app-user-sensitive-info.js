'use strict';

const {DataTypes, Model} = require("sequelize")
const bcrypt = require('bcryptjs');

class AppUserSensitiveInfo extends Model {
  static associate(models) {
    AppUserSensitiveInfo.belongsTo(models.AppUser, {foreignKey: 'userId'});
  }

  async isValidPassword(password) {
    const compare = await bcrypt.compare(password, this.password);
    return compare;
  }
}

module.exports = function (sequelize) {
  AppUserSensitiveInfo.init({
    userId: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    loginId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    authType: {
      type: DataTypes.CHAR,
      allowNull: false
    }
  }, {
    sequelize, // We need to pass the connection instance
    modelName: 'AppUserSensitiveInfo' // We need to choose the model name
  });
  return AppUserSensitiveInfo;
}
