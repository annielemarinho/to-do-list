const express = require("express")
const crypto = require("node:crypto")
const app = express()
const port = 3001
const todos = []

app.use(express.json());

app.get("/", function (req, res) {
    res.send("API de tarefas funcionando");
})

app.get("/todos", function (req, res) {
    res.json(todos);
});

app.post("/todos", function (req, res) {
    const text = req.body?.text;
    if (typeof text !== "string") {
        return res.status(400).json({
            error: 'O título deve ser um texto'
        })
    }
    const trimmedText = text.trim();
    if (!trimmedText) {
        return res.status(400).json({
            error: 'O título não pode estar vazio'
        })
    }
    const newTodo = {
        text: trimmedText,
        done: false,
        id: crypto.randomUUID()
    };
    todos.push(newTodo);
    res.status(201).json(newTodo)
});

app.get("/todos/:id", function (req, res) {
    const id = req.params.id;
    const todo = todos.find((item) => {
        return item.id === id;
    })
    if (!todo) {
        return res.status(404).json({
            error: 'Tarefa não encontrada'
        })
    }
    res.json(todo);
});

app.delete("/todos/:id", function (req, res) {
    const id = req.params.id;
    const todoIndex = todos.findIndex((item) => {
        return item.id === id;
    })
    if (todoIndex === -1) {
        return res.status(404).json({
            error: 'Tarefa não encontrada'
        })
    }
    todos.splice(todoIndex, 1);
    res.status(204).send();
});

app.patch("/todos/:id", function (req, res) {
    const id = req.params.id;
    const todo = todos.find((item) => {
        return item.id === id;
    });
    if (!todo) {
        return res.status(404).json({
            error: 'Tarefa não encontrada'
        })
    }
    const text = req.body?.text;
    const done = req.body?.done;
    if (done !== undefined && typeof done !== "boolean") {
        return res.status(400).json({
            error: 'O status deve ser um valor booleano'
        })
    }
    if (text !== undefined) {
        if (typeof text !== "string") {
            return res.status(400).json({
                error: 'O título deve ser um texto'
            })
        }
        const trimmedText = text.trim();
        if (!trimmedText) {
            return res.status(400).json({
                error: 'O título não pode estar vazio'
            })
        }
        todo.text = trimmedText;
    }
    if (done !== undefined) {
        todo.done = done;
    }
    res.json(todo);
});

app.listen(port, () => {
    console.log("Servidor rodando na porta 3001");
})