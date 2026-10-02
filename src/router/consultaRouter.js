const express = require("express");

const {
    criarConsulta,
    listarConsultas,
    buscarConsulta,
    atualizarConsulta,
    deletarConsulta
} = require("../controller/consultaController");

const router = express.Router();

router.post("/", criarConsulta);
router.get("/", listarConsultas);
router.get("/:id", buscarConsulta);
router.put("/:id", atualizarConsulta);
router.delete("/:id", deletarConsulta);

module.exports = router;