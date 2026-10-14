const express = require("express");

const autenticar =
    require("../middleware/authMiddleware");

const {
    criarConsulta,
    listarConsultas,
    atualizarConsulta
} = require("../controller/consultaController");

const router = express.Router();

router.get(
    "/",
    autenticar,
    listarConsultas
);

router.post(
    "/",
    autenticar,
    criarConsulta
);

router.patch(
    "/:id",
    autenticar,
    atualizarConsulta
);

module.exports = router;