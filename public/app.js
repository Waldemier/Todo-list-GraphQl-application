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
      fetch('/api/todo', { 
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      })
      .then(response_data => response_data.json()) //парсимо дані, які прийшли з серверу. 
                                                  //(Робимо це для того, щоб за допомогою json() 
                                                  //програма дала можливість перевести json формат
                                                  // у формат об'єкту, для доступу до полів). 
                                                  //Інакше програма не зможе зрозуміти які фрагменти є полями, 
                                                  //оскільки передалася сплошна стрічка.
                                                  //PS. .json() дає можливість з рядка формату json перевести його в формат об'єкту.

      //Витягуємо поле todos, з об'єкту, який передав сервер
      .then(({todos}) => this.todos = todos)
      .catch(err => console.error(err))
    },
    methods: {
      addTodo() {
        const title = this.todoTitle.trim()
        if (!title) {
          return
        }
        fetch('/api/todo', {
          method: 'POST',
          headers:  { 'Content-Type': 'application/json' }, //Передаємо на сервер json формат даних
          body: JSON.stringify({ title: title, done: false }),
        })
        .then(response_data => response_data.json())
        //Витягуємо поле todo, з об'єкту, який прийшов від сервера. Ex: const { title,password } = req.body;
        .then(({todo}) => { this.todos.push(todo) }) //пушимо в масив, який відповідає за вивід цих даних на екран (реалізація у vue, ми до цього не причетні)
        .catch(error => console.error(error))
        this.todoTitle = ''
      },
      completeTodo(id) {
        //console.log("PASSED", id)
        fetch('/api/todo/' + id, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'}, //Без цього хедера ми не зможемо зрозуміти в якому форматі прийшли данні.
          //body: JSON.stringify({done:true})
        })
        .then(response_data => response_data.json())
        .then(({todo}) => {

          const indx = this.todos.findIndex(t => t.id === todo.id)
          console.log(indx)
          this.todos[indx].updatedAt = todo.updatedAt

        })
        .catch(err => { console.error(err) })
      },
      removeTodo(id) {

        fetch('/api/todo/' + id, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'}
        }) 
        //Парсити немає що, тому .. => ..json() не пишимо (Глянути метод delete в роутах, для кращого розуміння)
        .then(() => { 
          console.log("Deleting was succefull")
          this.todos = this.todos.filter(t => t.id !== id) //Переприсвоюємо todo кожного разу як видаляємо новий елемент (для того, щоб оновити дані).
        })
        .catch(err => { console.error(err) })
        //console.log(this.todos)
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
        return new Intl.DateTimeFormat('ua-UA', options).format(new Date(value))
      }
    }
})