import { getTodosLocalStorage, saveTodoLocalStorage, removeTodoLocalStorage, updateTodoStatusLocalStorage, updateTodoLocalStorage } from "./storage.js";
import { createTodoElement, priorityNames } from "./ui.js";
//Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const filterSelect = document.querySelector("#filter-select");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const todoPriority = document.querySelector("#todo-priority");
const editPriority = document.querySelector("#edit-priority");

let editingTodoId;

//Funções
const saveTodo = (text, priority = "medium", done = 0, id = crypto.randomUUID()) => {

    const todo = createTodoElement(text, done, id, priority);
    saveTodoLocalStorage({ text, done, id, priority });
    todoList.appendChild(todo);

};

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
}

const updateTodo = (text, priority) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");
        
        if (todo.dataset.id === editingTodoId) {
            todoTitle.innerText = text;
            todo.dataset.priority = priority;
            const priorityLabel = todo.querySelector(".todo-priority");
            priorityLabel.classList.remove('low', 'medium', 'high');
            priorityLabel.classList.add(priority);
            priorityLabel.innerText = priorityNames[priority];
        }
    });

    updateTodoLocalStorage(editingTodoId, text, priority);
    applyFilters();
};

const applyFilters = () => {
    const search = searchInput.value.trim().toLowerCase();
    const filter = filterSelect.value;
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        const text = todo.querySelector("h3").innerText.toLowerCase();
        const matchesSearch = text.includes(search);
        const isDone = todo.classList.contains("done");
        const matchesStatus = filter === "all" || (filter === "done" && isDone) || (filter === "todo" && !isDone);
        const shouldShow = matchesSearch && matchesStatus;
        if (shouldShow === true) {
            todo.style.display = "flex";
        } else {
            todo.style.display = "none";
        }
    });
};


//Eventos
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value.trim();
    const priority = todoPriority.value;

    if (inputValue) {
        saveTodo(inputValue, priority);
        applyFilters();
        todoInput.value = "";
        todoPriority.value = "medium";
        todoInput.focus();
    }
});

document.addEventListener("click", (e) => {
    const targetEl = e.target.closest("button");
    if (!targetEl) {
        return;
    }

    const parentEl = targetEl.closest(".todo");
    if (!parentEl) {
        return;
    }

    const todoId = parentEl.dataset.id;
    let todoTitle;

    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
        updateTodoStatusLocalStorage(todoId);
        applyFilters();
    }

    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
        removeTodoLocalStorage(todoId);
    }

    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();

        editInput.value = todoTitle;
        editPriority.value = parentEl.dataset.priority;
        editingTodoId = todoId;
    }
});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value.trim();
    const priority = editPriority.value;

    if (editInputValue) {
        // atualizar
        updateTodo(editInputValue, priority);
        toggleForms();
    }
})

filterSelect.addEventListener("change", () => {
    applyFilters();
});

searchInput.addEventListener("input", () => {
    applyFilters();
});

eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.value = "";
    applyFilters();
});

//LocalStorage
const loadTodos = () => {
    const todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        const todoElement = createTodoElement(todo.text, todo.done, todo.id, todo.priority);
        todoList.appendChild(todoElement);
    });
};

loadTodos();