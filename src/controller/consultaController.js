const Consulta = require('../model/Consulta');

async function criarConsulta(req, res) {
    try {
        const consulta = await Consulta.create(req.body);

        res.status(201).json(consulta);
    } catch (error) {
        res.status(500).json({
            mensagem: "erro ao criar consulta",
            erro: error.message
        })
    }
}

async function listarConsultas(req, res) {
    try {
        const consultas = Consulta.find()
        .populate("paciente")
        .populate("medico")
        .populate("preTriagem")

        res.status(200).json(consultas)
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao listar consultas",
            erro: error.message
        })
    }
}

async function buscarConsulta(req, res) {
    try {
        const consulta = await Consulta.findById(req.params.id)
        .populate("paciente")
        .populate("medico")
        .populate("preTriagem");

        if (!consulta) {
            return res.status(404).json({
                mensagem: "Consulta não encontrado"
            })
        }

        res.status(200).json(consulta);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao buscar consulta",
            erro: error.message
        })
    }
}

async function atualizarConsulta(req, res) {
    try {
        const consulta = await Consulta.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!consulta) {
            return res.status(404).json({
                mensagem: "Consulta não encontrada"
            });
        }

        res.status(200).json(consulta);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao atualizar consulta",
            erro: error.message
        });
    }
}

async function deletarConsulta(req, res) {
    try {
        const consulta = await Consulta.findByIdAndDelete(req.params.id);

        if (!consulta) {
            return res.status(404).json({
                mensagem: "Consulta não encontrado"
            });
        }

        res.status(200).json({
            mensagem: "Consulta deletada com sucesso",
            consulta
        });
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao deletar consulta",
            erro: error.message
        });
    }
}

module.exports = {
    criarConsulta,
    listarConsultas,
    buscarConsulta,
    atualizarConsulta,
    deletarConsulta
}