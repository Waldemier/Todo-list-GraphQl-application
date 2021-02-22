const express = require('express')
const path = require('path')
const sequelize = require('./database/sequilizeDbConfig')
const { graphqlHTTP } = require('express-graphql') // npm пакет для роботи express та graphql
const schema = require('./graphql/schema')
const resolver = require('./graphql/resolver')


const app = express()
const PORT = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, 'public')))

//По дефолту параметру body не існує (він є, але перебуває у форматі буферу), для того щоб він з'явився,
// та ми змогли парсити дані json формату, прописуємо наступне:
app.use(express.json())

app.use(graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true //added interactive interface on /graphql url rout
}))

app.use((request, response, next) => {
    response.sendFile('/index.html')
})

async function start()
{
    try {
        await sequelize.sync() //Запуск роботи бази даних || {force: true} за допомогою цієї опції, перезібрали нашу модель, в якій видалили зайве поле (оновили модель в базі)
        app.listen(PORT, () => console.log('Connected to db and server started was successful.'))  
    } catch (err) {
        console.error(err)
    }
}

start();