// models/index.js
const sequelize = require('../db');
const User = require('./User');
const Mute = require('./Mute');
const Ban = require('./Ban');

// Define associations if necessary
User.hasMany(Mute, { foreignKey: 'user_id' });
User.hasMany(Ban, { foreignKey: 'user_id' });

const initDB = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Tables have been created');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

module.exports = { initDB, User, Mute, Ban };
