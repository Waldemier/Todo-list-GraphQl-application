new Vue({
    el: '#app',
    data() {
      return {
        isDark: true,
        show: true,
        todoTitle: '',
        todos: []
      }
    },
    created() {

      const query = `
        query { 
          getTodos { id title done createdAt updatedAt }
        }
      `
      fetch('/graphql', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({query: query})
      })
      .then(response_data => response_data.json()) //парсимо дані, які прийшли з серверу. 
                                                  //(Робимо це для того, щоб за допомогою json() 
                                                  //програма дала можливість перевести json формат
                                                  // у формат об'єкту, для доступу до полів). 
                                                  //Інакше програма не зможе зрозуміти які фрагменти є полями, 
                                                  //оскільки передалася сплошна стрічка.
                                                  //PS. .json() дає можливість з рядка формату json перевести його в формат об'єкту.
      .then(response => { this.todos = response.data.getTodos })
      .catch(err => console.error(err))
    },
    methods: {

      addTodo() {

        const title = this.todoTitle.trim()
        if (!title) {
          return
        }

        const query = `
            mutation {
              createTodo(todo: { title: "${title}", done: ${false}}) { id, title, done, createdAt, updatedAt }
            }
        `
        fetch('/graphql', {
          method: 'POST',
          headers:  { 'Content-Type': 'application/json', 'Accept': 'application/json' }, //Хеддер Accept не обов'язковий, оскільки він вказує на те, що ми маємо приймати json, хоча і так його в любому випадку приймаємо від graphql
          body: JSON.stringify({query: query}),
        })
        .then(response_data => response_data.json())
        .then(response => { this.todos.push(response.data.createTodo) })
        .catch(error => console.error(error))
        this.todoTitle = ''

      },
      completeTodo(id) {
        const query = `
            mutation { 
              completedTodo(id: ${id}) { updatedAt }
            }
        `
        fetch('/graphql', {
          method: 'POST', //В роботі з graphql завжди вказуємо метод post (навіть якщо це get або що)
          headers: {'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({query})
        })
        .then(response_data => response_data.json())
        .then(response => {

          const indx = this.todos.findIndex(t => t.id === id)

          this.todos[indx].updatedAt = response.data.completedTodo.updatedAt

        })
        .catch(err => { console.error(err) })
      },
      removeTodo(id) {
        const query = `
          mutation { 
            deletingTodo(id: ${id})
          }  
        `
        fetch('/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({query})
        }) 
        .then(() => { 
          console.log("Deleting was succefull")
          this.todos = this.todos.filter(t => t.id !== id)
        })
        .catch(err => { console.error(err) })
      }
    },
    filters: {
      capitalize(value) {
        return value.toString().charAt(0).toUpperCase() + value.slice(1)
      },
      date(value, withTime) {
        const options = {
          year: 'numeric',
          month: 'long',
          day: '2-digit'
        }

        if(withTime) //В теорії можна було обійтись без зайвого параметру та цієї перевірки
        {
          options.hour = '2-digit',
          options.minute = '2-digit',
          options.second = '2-digit'
        }
        return new Intl.DateTimeFormat('ua-UA', options).format(new Date(+value))
      }
    }
})