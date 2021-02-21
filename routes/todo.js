const {Router} = require('express')
const todoModel = require('../models/todoModel')

const router = Router();

//Get todo list
router.get('/', async (request, response) => {
    try {

        //mysql findAll method
        const todos = await todoModel.findAll()

        //Переводимо дані у рядок типу json, оскільки фронтенд, приймаючи відповідь, не зможе розпарсити формат звичайного об'єкту.
        response.status(200).json({todos}); //Можемо передати параметр у вигляді об'єкту (щоб було зрозуміліше), а можемо як звичайним параметром

    } catch(e) {

        response.status(500).json({message: `Server error ${e}`})
        console.error(e)

    }
});

//Task create
router.post('/', async (request, response) => {
    try {

        //mysql create method
        const todo = await todoModel.create({
            title: request.body.title,
            done: request.body.done
        })
        
        response.status(201).json({todo});

    } catch(e) {

        response.status(500).json({message: `Server error ${e}`})
        console.error(e)

    }
});

//Task change
router.put('/:id', async (request, response) => {
    try {

        //mysql findByPk (primaryKey) method
        const todo = await todoModel.findByPk(+request.params.id) //Доставили "+", провсяк випадок (для явного вказання числового типу)
        todo.done = !todo.done;
        await todo.save();
        
        response.status(200).json({todo});

    } catch(e) {

        response.status(500).json({message: `Server error ${e}`})
        console.error(e)

    }
});

//Task delete
router.delete('/:id', async (request, response) => {
    try {

        //mysql select method
        const todo = await todoModel.findOne({
            where: {id: +request.params.id} //Ще один типовий спосіб знайти об'єкт, притаманний my sql
        })
        await todo.destroy();
        
        response.status(204).json({});

    } catch(e) {

        response.status(500).json({message: `Server error ${e}`})
        console.error(e)

    }
});

module.exports = router;