const mongoose = require('mongoose');

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
    }

    
});

module.exports = mongoose.model("Consulta", consultaSchema);