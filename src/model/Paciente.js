const mongoose = require("mongoose");

const pacienteSchema = new mongoose.Schema({
    cpf: {
        type: String,
        required: true,
        unique: true
    },

    nome: {
        type: String,
        required: true
    },

    idade: {
        type: Number,
        required: true
    },

    sexo: {
        type: String,
        required: true
    },

    peso: {
        type: Number
    },

    altura: {
        type: Number
    },

    historico: {
        alergias: {
            type: String
        },

        doencasFamilia: {
            type: String
        },

        cirurgias: {
            type: String
        }
    }
});

module.exports = mongoose.model("Paciente", pacienteSchema);