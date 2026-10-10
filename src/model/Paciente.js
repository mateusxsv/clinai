const mongoose = require("mongoose");

const pacienteSchema = new mongoose.Schema({

    cpf: {
        type: String
    },

    nome: {
        type: String,
        required: true
    },

    email: {
        type: String
    },

    dataNascimento: {
        type: Date
    },

    telefone: {
        type: String
    },

    sexo: {
        type: String
    },

    peso: {
        type: Number
    },

    altura: {
        type: Number
    },

    historico: {
        doencasCronicas: String,
        alergias: String,
        reacoes: String,
        medicamentos: String,
        cirurgias: String,
        apoio: String,
        doencasFamilia: String
    }

});

module.exports = mongoose.model("Paciente", pacienteSchema);