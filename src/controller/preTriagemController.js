const PreTriagem = require('../model/PreTriagem');

async function criarPreTriagem(req, res) {
    try {
        const preTriagem = await PreTriagem.create(req.body);

        res.status(201).json(preTriagem);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao criar pré-triagem",
            erro: error.message
        })
    }
}

async function listarPreTriagens(req, res) {
    try {
        const preTriagens = await PreTriagem.find();

        res.status(201).json(preTriagens);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao listar pré-triagens",
            erro: error.message
        })
    }
}

exports = {
    criarPreTriagem,
    listarPreTriagens,
}