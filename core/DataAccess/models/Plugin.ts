const sequelize = require('../database'); 
const { DataTypes } = require('sequelize');

const Plugin = sequelize.define('Plugin', {
  // Define attributes/columns of the table
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  authorEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  version: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true
});

export default Plugin;
