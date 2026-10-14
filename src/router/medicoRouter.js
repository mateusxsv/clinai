const express = require("express");

const {
    criarMedico,
    listarMedicos,
    buscarMedico,
    atualizarMedico,
    deletarMedico,
} = require("../controller/medicoController");

const {
    buscarHorarios
} = require("../controller/disponibilidadeController");

const router = express.Router();

router.post("/", criarMedico);
router.get("/", listarMedicos);
router.get("/:id/slots", buscarHorarios);
router.get("/:id", buscarMedico);
router.put("/:id", atualizarMedico);
router.delete("/:id", deletarMedico);

module.exports = router;