const express = require("express");

const {
    criarPaciente,
    listarPacientes,
    buscarPaciente,
    atualizarPaciente,
    deletarPaciente
} = require("../controller/pacienteController");

const router = express.Router();

router.post("/", criarPaciente);
router.get("/", listarPacientes);
router.get("/:id", buscarPaciente);
router.put("/:id", atualizarPaciente);
router.delete("/:id", deletarPaciente);

module.exports = router;