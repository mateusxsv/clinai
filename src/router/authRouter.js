const express = require("express");

const {
    registrar,
    login,
    logout
} = require("../controller/authController");

const router = express.Router();

router.post("/register", registrar);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;