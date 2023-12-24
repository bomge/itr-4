const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConn'); 

const User = sequelize.define('User', {

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  password: {
    type: DataTypes.STRING
  },  

  email: {
    type: DataTypes.STRING,
    unique: true
  },
  
  regDate: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  
  lastLogin: {
    type: DataTypes.DATE,
    defaultValue: new Date('January 1, 1970 00:00:00') 
  },

  status: {
    type: DataTypes.ENUM('active', 'banned'),
    defaultValue: 'active'
  }

});

module.exports = User;