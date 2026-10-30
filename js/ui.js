export const priorityNames = {
        high: "Alta",
        medium: "Média",
        low: "Baixa"

    };

export const createTodoElement = (text, done, id, priority = "medium") => {
    const todo = document.createElement("div");
    todo.classList.add("todo");
    todo.dataset.id = id;
    todo.dataset.priority = priority;

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const priorityLabel = document.createElement("span");
    priorityLabel.classList.add("todo-priority");
    priorityLabel.classList.add(priority);
    priorityLabel.innerText = priorityNames[priority];
    todo.appendChild(priorityLabel);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);

    if (done) {
        todo.classList.add("done");
    }
    return todo;
};
