const {Sequelize} = require('sequelize') //npm пакет для роботи з базою даних sql на nodejs

const DB_NAME = 'node-todos';
const USER_NAME = 'root'
const PASSWORD = '1234567w'

const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = sequelize;