const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    senha: {
        type: String,
        required: true
    },

    tipo: {
        type: String,
        enum: ["paciente", "medico", "admin"],
        required: true
    },

    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Paciente",
        default: null
    },

    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medico",
        default: null
    }

});

module.exports = mongoose.model("Usuario", usuarioSchema);