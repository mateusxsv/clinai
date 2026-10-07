const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const pacienteRouter = require("./router/pacienteRouter");
const medicoRouter = require("./router/medicoRouter");
const preTriagemRouter = require("./router/preTriagemRouter");
const consultaRouter = require("./router/consultaRouter");

const authRouter = require("./router/authRouter");
const usuarioRouter = require("./router/usuarioRouter");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());


// ROTAS ANTIGAS

app.use("/pacientes", pacienteRouter);
app.use("/medicos", medicoRouter);
app.use("/pre-triagens", preTriagemRouter);
app.use("/consultas", consultaRouter);


// ROTAS PARA O FRONTEND

app.use("/api/auth", authRouter);
app.use("/api/me", usuarioRouter);


app.get("/", (req, res) => {
    res.json({
        mensagem: "API do Postinho funcionando!"
    });
});

module.exports = app;