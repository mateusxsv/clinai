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

async function buscarPaciente(req, res) {
    try {
        const paciente = await Paciente.findById(req.params.id);

        if (!paciente) {
            return res.status(404).json({
                mensagem: "Paciente não encontrado",
                erro: error.message
            })
        }

        res.json(paciente);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao buscar paciente",
            erro: error.message
        })
    }
}

async function atualizarPaciente(req, res) {
    try {
        const paciente = await Paciente.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!paciente) {
            return res.status(404).json({
                mensagem: "Paciente não encontrado"
            });
        }

        res.json(paciente);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao atualizar paciente",
            erro: error.message
        });
    }
}

async function deletarPaciente(req, res) {
    try {
        const paciente = await Paciente.findByIdAndDelete(req.params.id);

        if (!paciente) {
            return res.status(404).json({
                mensagem: "Paciente não encontrado"
            });
        }

        res.json(paciente);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao deletar paciente",
            erro: error.message
        });
    }
}

module.exports = {
    criarPaciente,
    listarPacientes,
    buscarPaciente,
    atualizarPaciente,
    deletarPaciente
}
