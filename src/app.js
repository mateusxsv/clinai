const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const pacienteRouter = require("./router/pacienteRouter");
const medicoRouter = require("./router/medicoRouter");
const preTriagemRouter = require("./router/preTriagemRouter");
const consultaRouter = require("./router/consultaRouter");
const disponibilidadeRouter = require("./router/disponibilidadeRouter");

const authRouter = require("./router/authRouter");
const usuarioRouter = require("./router/usuarioRouter");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());


// Rotas principais da API

app.use("/api/patients", pacienteRouter);
app.use("/api/doctors", medicoRouter);
app.use("/api/triages", preTriagemRouter);
app.use("/api/appointments", consultaRouter);
app.use("/api/availability", disponibilidadeRouter);

app.use("/api/auth", authRouter);
app.use("/api/me", usuarioRouter);


app.get("/", (req, res) => {
    res.json({
        mensagem: "API do ClinAi funcionando!"
    });
});

module.exports = app;