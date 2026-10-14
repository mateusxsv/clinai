const express = require("express");
const autenticar = require("../middleware/authMiddleware");
const {
  salvarDisponibilidade,
  listarDisponibilidades,
} = require("../controller/disponibilidadeController");
const router = express.Router();
router.get("/", autenticar, listarDisponibilidades);
router.post("/", autenticar, salvarDisponibilidade);
module.exports = router;
