const express = require("express");

const {
    criarPreTriagem,
    listarPreTriagens,
    buscarPreTriagem,
    atualizarPreTriagem,
    deletarPreTriagem
} = require("../controller/preTriagemController");

const router = express.Router();

router.post("/", criarPreTriagem);
router.get("/", listarPreTriagens);
router.get("/:id", buscarPreTriagem);
router.put("/:id", atualizarPreTriagem);
router.delete("/:id", deletarPreTriagem);

module.exports = router;