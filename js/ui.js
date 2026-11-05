export const priorityNames = {
        high: "Alta",
        medium: "Média",
        low: "Baixa"

};

export const categoryNames = {
    none: "Sem categoria",
    studies: "Estudos",
    work: "Trabalho",
    personal: "Pessoal"
};

export const createTodoElement = (text, done, id, priority = "medium", category = "none", deadline = "") => {
    const todo = document.createElement("div");
    todo.classList.add("todo");
    todo.dataset.id = id;
    todo.dataset.priority = priority;
    todo.dataset.category = category;
    todo.dataset.deadline = deadline;

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const priorityLabel = document.createElement("span");
    priorityLabel.classList.add("todo-priority");
    priorityLabel.classList.add(priority);
    priorityLabel.innerText = priorityNames[priority];
    todo.appendChild(priorityLabel);

    const categoryLabel = document.createElement("span");
    categoryLabel.classList.add("todo-category");
    categoryLabel.innerText = categoryNames[category];
    todo.appendChild(categoryLabel);

    const deadlineLabel = document.createElement("span");
    deadlineLabel.classList.add("todo-deadline");
    if (deadline) {
        const dateParts = deadline.split("-");
        deadlineLabel.innerText = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];
    } else {
        deadlineLabel.innerText = "Sem Prazo";
    }
    todo.appendChild(deadlineLabel);

    const actions = document.createElement("div");
    actions.classList.add("todo-actions");

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    actions.appendChild(doneBtn);
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    actions.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    actions.appendChild(deleteBtn);
    todo.appendChild(actions);

    if (done) {
        todo.classList.add("done");
    }
    return todo;
};
