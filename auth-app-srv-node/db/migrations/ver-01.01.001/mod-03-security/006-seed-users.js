'use strict';

const Sequelize = require('sequelize');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const db = require('../../../db');
const encrypt = require('../../../../config/encrypt.config');
const types = require('../../../../types/types');

module.exports = {
  up: async (queryInterface) => {
    const t = await db.sequelize.transaction();
    try {
      let user = await db.models.AppUser.create({
        userId: uuid.v4(),
        fullName: 'Builtin System Administrator',
        userType: types.EnumUserTypes.Employee
      }, { transaction: t });

      const salt = await bcrypt.genSalt(encrypt.passwordSaltRounds);

      let encryptedPassword = await bcrypt.hash('manager', salt);
      let userSensitiveInfo = await db.models.AppUserSensitiveInfo.create({
        userId: user.userId,
        loginId: 'admin' + '_l',
        password: encryptedPassword,
        mobileNumber: uuid.v4(),
        authType: 'l'
      }, { transaction: t });


      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  },
  down: async (queryInterface) => {
  }
};
