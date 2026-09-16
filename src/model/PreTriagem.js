const mongoose = require("mongoose");

const preTriagemSchema = new mongoose.Schema({
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Paciente",
        required: true
    },

    queixa: {
        type: String,
        required: true
    },

    descricao: {
        type: String,
        required: true
    },

    especialidade: {
        type: String,
        required: true
    },

    medicamentos: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("PreTriagem", preTriagemSchema);