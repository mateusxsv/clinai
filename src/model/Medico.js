const mongoose = require("mongoose");

// adição de senha para médico e usuário (pode criar uma classe usuário como guarda chuva)

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