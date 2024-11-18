// db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('stdc', 'sdtc_api_test', 'qwertyuiop123456789', {
  host: 'localhost', // or your host
  dialect: 'mysql'
});

async function connect() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

connect();

module.exports = sequelize;
