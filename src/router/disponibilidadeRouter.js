const express = require("express");

const {
    salvarDisponibilidade
} = require("../controller/disponibilidadeController");

const router = express.Router();

router.post("/", salvarDisponibilidade);

module.exports = router;