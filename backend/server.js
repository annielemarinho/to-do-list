const express = require("express")
const app = express()
const port = 3001

app.get("/", function (req, res){
    res.send("API de tarefas funcionando");
})


app.listen(port, () => {
    console.log("Servidor rodando na porta 3001");
})