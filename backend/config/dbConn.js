const { Sequelize } = require('sequelize');

const CONNECTION_URI = process.env.MYSQL_CONNECTION

const sequelize = new Sequelize(CONNECTION_URI);

module.exports = sequelize;