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

        res.status(201).json(consultas)
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao listar consultas",
            erro: error.message
        })
    }
}

exports = {
    criarConsulta,
    listarConsultas,
    buscarConsulta,
    atualizarConsulta,
    deletarConsulta
}