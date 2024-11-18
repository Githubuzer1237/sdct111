const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Mute = sequelize.define('Mute', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  muted_by: {
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

module.exports = Mute;
