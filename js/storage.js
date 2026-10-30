export const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    let updated = false;

    todos.forEach((todo) => {
        if (!todo.id) {
            todo.id = crypto.randomUUID();
            updated = true;
        }
    });

    if (updated) {
        localStorage.setItem("todos", JSON.stringify(todos));
    }
    return todos;
};

export const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();

    const newTodo = {
        ...todo,
    };
    todos.push(newTodo);

    localStorage.setItem("todos", JSON.stringify(todos));
};

export const removeTodoLocalStorage = (todoId) => {
    const todos = getTodosLocalStorage();
    const filteredTodos = todos.filter((todo) => todo.id !== todoId);
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

export const updateTodoStatusLocalStorage = (todoId) => {
    const todos = getTodosLocalStorage();
    todos.forEach((todo) => {
        if (todo.id === todoId) {
            todo.done = !todo.done;
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
};

export const updateTodoLocalStorage = (todoId, todoNewText, priority) => {
    const todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        if (todo.id === todoId) {
            todo.text = todoNewText;
            todo.priority = priority;
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
};