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

    dataNascimento: {
        type: Date,
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