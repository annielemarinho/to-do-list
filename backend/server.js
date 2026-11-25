const express = require("express")
const crypto = require("node:crypto")
const app = express()
const port = 3001
const todos = []
const allowedPriorities = ["low", "medium", "high"];
const allowedCategories = ["none", "studies", "work", "personal"];

app.use(express.json());

app.get("/", function (req, res) {
    res.send("API de tarefas funcionando");
})

app.get("/todos", function (req, res) {
    res.json(todos);
});

app.post("/todos", function (req, res) {
    const text = req.body?.text;
    const priority = req.body?.priority;
    const category = req.body?.category;
    const deadline = req.body?.deadline;

    if (priority !== undefined && !allowedPriorities.includes(priority)) {
        return res.status(400).json({
            error: 'A prioridade deve ser low, medium ou high'
        })
    }

    if (category !== undefined && !allowedCategories.includes(category)) {
        return res.status(400).json({
            error: 'A categoria deve ser none, studies, work ou personal'
        })
    }

    if (deadline !== undefined && typeof deadline !== "string") {
        return res.status(400).json({
            error: 'O prazo deve ser um texto'
        })
    }

    if (deadline) {
        const deadlinePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!deadlinePattern.test(deadline)) {
            return res.status(400).json({
                error: 'O prazo deve estar no formato AAAA-MM-DD'
            })
        }
        const deadlineDate = new Date(deadline + "T00:00:00.000Z");
        const [year, month, day] = deadline.split("-").map(Number);
        if (deadlineDate.getUTCFullYear() !== year || deadlineDate.getUTCMonth() !== month - 1 || deadlineDate.getUTCDate() !== day) {
            return res.status(400).json({
                error: 'Data inválida'
            })
        }
    }

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
        id: crypto.randomUUID(),
        priority: priority ?? "medium",
        category: category ?? "none",
        deadline: deadline ?? null
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

    const priority = req.body?.priority;
    const category = req.body?.category;
    const deadline = req.body?.deadline;

    if (priority !== undefined) {
        if (!allowedPriorities.includes(priority)) {
            return res.status(400).json({
                error: "A prioridade deve ser low, medium ou high",
            });
        }
    }

    if (category !== undefined && !allowedCategories.includes(category)) {
        return res.status(400).json({
            error: 'A categoria deve ser none, studies, work ou personal'
        })
    }

    if (deadline !== undefined && deadline !== null && typeof deadline !== "string") {
        return res.status(400).json({
            error: 'O prazo deve ser um texto'
        })
    }

    if (deadline !== undefined && deadline !== null) {
        const deadlinePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!deadlinePattern.test(deadline)) {
            return res.status(400).json({
                error: 'O prazo deve estar no formato AAAA-MM-DD'
            })
        }
        const deadlineDate = new Date(deadline + "T00:00:00.000Z");
        const [year, month, day] = deadline.split("-").map(Number);
        if (deadlineDate.getUTCFullYear() !== year || deadlineDate.getUTCMonth() !== month - 1 || deadlineDate.getUTCDate() !== day) {
            return res.status(400).json({
                error: 'Data inválida'
            })
        }
    }
    const text = req.body?.text;
    const done = req.body?.done;
    if (done !== undefined && typeof done !== "boolean") {
        return res.status(400).json({
            error: 'O status deve ser um valor booleano'
        })
    }
    let trimmedText = ""
    if (text !== undefined) {
        if (typeof text !== "string") {
            return res.status(400).json({
                error: 'O título deve ser um texto'
            })
        }
        trimmedText = text.trim();
        if (!trimmedText) {
            return res.status(400).json({
                error: 'O título não pode estar vazio'
            })
        }
    }

    if (priority !== undefined) {
        todo.priority = priority;
    }

    if (category !== undefined) {
        todo.category = category;
    }

    if (deadline === null) {
        todo.deadline = null;
    }

    if (typeof deadline === "string") {
        todo.deadline = deadline;
    }

    if (text !== undefined) {
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