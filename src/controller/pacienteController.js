const Paciente = require("../model/Paciente.js");

async function criarPaciente(req, res) {
    try {
        const paciente = await Paciente.create(req.body);

        res.status(201).json(paciente);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao criar paciente",
            erro: error.message
        });
    }
}

async function listarPacientes(req, res) {
    try {
        const pacientes = await Paciente.find();

        res.status(201).json(pacientes);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao listar pacientes",
            erro: error.message
        })
    }
}

module.exports = {
    criarPaciente,
    listarPacientes
}