const {Sequelize} = require('sequelize')
const sequelize = require('../database/sequilizeDbConfig')

const todoModel = sequelize.define('Todo', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    done: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    // date: { 
    //     type: Sequelize.DATE,
    //     allowNull: false
    // }
})

module.exports = todoModel;

