const mongoose = require("mongoose");

const consultaSchema = new mongoose.Schema({
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Paciente",
        required: true
    },

    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medico",
        required: true
    },

    preTriagem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PreTriagem",
        required: true
    },

    data: {
        type: Date,
        required: true
    },

    horario: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "agendada"
    }
});

module.exports = mongoose.model("Consulta", consultaSchema);