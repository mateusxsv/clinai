const Medico = require("../model/Medico");

async function criarMedico(req, res) {
    try {
        const medico = await Medico.create(req.body);

        res.status(201).json(medico)
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao criar médico!",
            erro: error.message
        });
    }
}

async function listarMedicos(req, res) {
    try {
        const medicos = await Medico.find();

        res.status(201).json(medicos);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao listar médicos",
            erro: error.message
        })
    }
}

async function buscarMedico(req, res) {
    try {
        const medico = await Medico.findById(req.params.id);

        if (!medico) {
            return res.status(404).json({
                mensagem: "Médico não encontrado",
                erro: error.message
            })
        }

        res.json(medico);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao buscar médico",
            erro: error.message
        })
    }
}

async function atualizarMedico(req, res) {
    try {
        const medico = await Medico.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!medico) {
            return res.status(404).json({
                mensagem: "Médico não encontrado"
            });
        }

        res.json(medico);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao atualizar médico",
            erro: error.message
        });
    }
}

async function deletarMedico(req, res) {
    try {
        const medico = await Medico.findByIdAndDelete(req.params.id);

        if (!medico) {
            return res.status(404).json({
                mensagem: "Médico não encontrado"
            });
        }

        res.json(medico);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao deletar médico",
            erro: error.message
        });
    }
}

module.exports = {
    criarMedico,
    listarMedicos,
    buscarMedico,
    atualizarMedico,
    deletarMedico
}