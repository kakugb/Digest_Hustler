const db = require('../config/db.js');

const createUser = (name, email, hashedPassword, callback) => {
  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, hashedPassword], callback);
};

const findUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], callback);
};

module.exports = { createUser, findUserByEmail };
