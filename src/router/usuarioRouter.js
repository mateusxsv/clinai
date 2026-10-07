const express = require("express");

const autenticar = require("../middleware/authMiddleware");
const { meuPerfil } = require("../controller/usuarioController");

const router = express.Router();

router.get("/", autenticar, meuPerfil);

module.exports = router;