import { getTodosLocalStorage, saveTodoLocalStorage, removeTodoLocalStorage, updateTodoStatusLocalStorage, updateTodoLocalStorage } from "./storage.js";
import { createTodoElement } from "./ui.js";
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

let editingTodoId;

//Funções
const saveTodo = (text, done = 0, id = crypto.randomUUID()) => {

    const todo = createTodoElement(text, done, id);
    saveTodoLocalStorage({ text, done, id });
    todoList.appendChild(todo);

};

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
}

const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");
        if (todo.dataset.id === editingTodoId) {
            todoTitle.innerText = text;
        }
    });

    updateTodoLocalStorage(editingTodoId, text);
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

    if (inputValue) {
        saveTodo(inputValue);
        applyFilters();
        todoInput.value = "";
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

    if (editInputValue) {
        // atualizar
        updateTodo(editInputValue);
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
        const todoElement = createTodoElement(todo.text, todo.done, todo.id);
        todoList.appendChild(todoElement);
    });
};

loadTodos();