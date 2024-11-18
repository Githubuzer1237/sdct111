const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('student', 'admin', 'moder', 'creator'),
    defaultValue: 'student'
  },
  birth_year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  birth_year_private: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country_private: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = User;
