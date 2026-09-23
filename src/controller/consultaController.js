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