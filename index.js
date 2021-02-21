const express = require('express')
const path = require('path')
const todoRoutes = require('./routes/todo')
const sequelize = require('./database/sequilizeDbConfig')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, 'public')))

//По дефолту параметру body не існує (він є, але перебуває у форматі буферу), для того щоб він з'явився,
// та ми змогли парсити дані json формату, прописуємо наступне:
app.use(express.json())

app.use('/api/todo', todoRoutes)

app.use((request, response, next) => {
    response.sendFile('/index.html')
})

async function start()
{
    try {
        await sequelize.sync() //Запуск роботи бази даних || {force: true} за допомогою цієї опції, перезібрали нашу модель, в якій видалили зайве поле (оновили модель в базі)
        app.listen(PORT)
        console.log('Connected to db and server started was successful.')
    } catch (err) {
        console.error(err)
    }
}

start();