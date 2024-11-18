// app.js
const express = require('express');
const { initDB } = require('./models');

const app = express();

// Initialize the database and create tables if not present
initDB();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
