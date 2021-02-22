const todoModel = require('../models/todoModel')

module.exports = {
    async getTodos() {
        try {
            const todos = await todoModel.findAll()
            return todos;
        } catch(e) {
            throw new Error('Fetch todos is not available')
        }
    },
    async createTodo({ todo }) { //Приймаємо об'єкт, в якому є поле todo (яке ми вказали в схемі)
        try {
            console.warn(todo)
            return await todoModel.create({
                title: todo.title,
                done: todo.done
            }) // При створенні екземпляра таблиці, без занесення цього процесу в окрему змінну, save() писати не потрібно.

        } catch(e) {
            throw new Error('Title and done is required')
        }
    },
    async completedTodo({ id }){ 
        try {
            const todo = await todoModel.findByPk(id)
            todo.done = true;
            await todo.save();
            return todo;
        } catch(e) {
            throw new Error('Fetch todos complete was getting error')
        }
    },
    async deletingTodo({ id }){ 
        try {
            const todo = await todoModel.findAll({ where: { id: id } })
            await todo[0].destroy();
            return true
        } catch(e) {
            throw new Error('Fetch todos delete was getting error')
        }
    }
}