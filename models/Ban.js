const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Ban = sequelize.define('Ban', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  banned_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = Ban;
