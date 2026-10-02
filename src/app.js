const express = require("express");
const cors = require("cors");

const pacienteRouter = require("./router/pacienteRouter");
const medicoRouter = require("./router/medicoRouter");
const preTriagemRouter = require("./router/preTriagemRouter");
const consultaRouter = require("./router/consultaRouter");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/pacientes", pacienteRouter);
app.use("/medicos", medicoRouter);
app.use("/pre-triagens", preTriagemRouter);
app.use("/consultas", consultaRouter);

app.get("/", (req, res) => {
    res.json({
        mensagem: "API do Postinho funcionando!"
    });
});

module.exports = app;