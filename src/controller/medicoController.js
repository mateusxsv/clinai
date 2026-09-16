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

module.exports = {
    criarMedico,
    listarMedicos
}