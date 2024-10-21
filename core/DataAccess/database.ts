const { Sequelize } = require('sequelize');

// Initialize Sequelize with MySQL connection details
const sequelize = new Sequelize('ovec', 'web', 'web', {
  host: 'localhost', // or your remote host
  dialect: 'mysql'   // Specify the database type (MySQL in this case)
});

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default sequelize;
