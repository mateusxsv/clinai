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
        const preTriagens = await PreTriagem.find().populate("paciente");

        res.status(200).json(preTriagens);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao listar pré-triagens",
            erro: error.message
        })
    }
}

async function buscarPreTriagem(req, res) {
    try {
        const preTriagem = await PreTriagem.findById(req.params.id).populate("paciente");

        if (!preTriagem) {
            res.status(404).json({
                mensagem: "Pré-triagem não encontrada",
                erro: error.message
            })
        }

        res.status(200).json(preTriagem);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao buscar pré-triagem",
            erro: error.message
        })
    }
}

async function atualizarPreTriagem(req, res) {
    try {
        const preTriagem = await PreTriagem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!preTriagem) {
            return res.status(404).json({
                mensagem: "Pré-triagem não encontrada"
            });
        }

        res.status(200).json(preTriagem);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao atualizar pré-triagem",
            erro: error.message
        });
    }
}

async function deletarPreTriagem(req, res) {
    try {
        const preTriagem = await PreTriagem.findByIdAndDelete(req.params.id);

        if (!preTriagem) {
            return res.status(404).json({
                mensagem: "Pré-triagem não encontrada"
            });
        }

        res.status(200).json({
            mensagem: "Pré-triagem deletada com sucesso",
            preTriagem
        });
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao deletar pré-triagem",
            erro: error.message
        });
    }
}

module.exports = {
    criarPreTriagem,
    listarPreTriagens,
    buscarPreTriagem,
    atualizarPreTriagem,
    deletarPreTriagem
}