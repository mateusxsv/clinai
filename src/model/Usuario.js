const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({

    tipo: {
        type: String,
         enum: ["paciente", "medico", "admin"]
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