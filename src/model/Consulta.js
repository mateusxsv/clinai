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
        default: null
    },

    data: {
        type: String,
        required: true
    },

    horario: {
        type: String,
        required: true
    },

    plano: {
        type: String,
        default: "Particular"
    },

    historico: {
        doencasCronicas: String,
        alergias: String,
        reacoes: String,
        medicamentos: String,
        cirurgias: String,
        apoio: String
    },

    relato: {
        queixa: String,
        inicio: String,
        local: String,
        evolucao: String,
        dor: Number,
        outros: String,
        medicamento: String,
        gravidez: String
    },

    status: {
        type: String,
        enum: ["scheduled", "confirmed", "cancelled"],
        default: "scheduled"
    },

    revisado: {
        type: Boolean,
        default: false
    }
});

consultaSchema.index(
    {
        medico: 1,
        data: 1,
        horario: 1
    },
    {
        unique: true,
        partialFilterExpression: {
            status: { $ne: "cancelled" }
        }
    }
);

module.exports = mongoose.model(
    "Consulta",
    consultaSchema
);