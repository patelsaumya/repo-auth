'use strict';

const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('AppUserSensitiveInfo', {
      userId: {
        primaryKey: true,
        type: Sequelize.UUID,
        references: {
          model: 'AppUser',
          key: 'userId',
        },
      },
      loginId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mobileNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      authType: {
        type: Sequelize.CHAR,
        allowNull: false
      },
      version: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('AppUserSensitiveInfo');
  }
};
