const mongoose = require("mongoose");

const disponibilidadeSchema = new mongoose.Schema({
    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medico",
        required: true
    },

    data: {
        type: String,
        required: true
    },

    inicio: {
        type: String,
        required: true
    },

    fim: {
        type: String,
        required: true
    },

    duracao: {
        type: Number,
        required: true,
        default: 30
    }
});

disponibilidadeSchema.index(
    { medico: 1, data: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "Disponibilidade",
    disponibilidadeSchema
);