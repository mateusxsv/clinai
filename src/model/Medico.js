const mongoose = require("mongoose");

const medicoSchema = new mongoose.Schema({
    crm: {
        type: String,
        required: true,
        unique: true
    },

    nome: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    idade: {
        type: Number,
        required: true
    },

    foto: {
        type: String
    },

    especialidade: {
        type: String,
        required: true
    },

    clinica: {
        type: String
    }
});

module.exports = mongoose.model("Medico", medicoSchema);