const { buildSchema } = require('graphql') // npm

module.exports = buildSchema(`  

    type Todo {
        id: ID!
        title: String!
        done: Boolean!
        createdAt: String
        updatedAt: String
    }

    type Query {
        getTodos: [Todo!]!
    }

    input TodoInput {
        title: String!
        done: Boolean!
    } 
    type Mutation {
        createTodo(todo: TodoInput!): Todo!
        completedTodo(id: ID!): Todo!
        deletingTodo(id: ID!): Boolean!
    }
`)