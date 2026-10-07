const jwt = require("jsonwebtoken");
const Usuario = require("../model/Usuario");

async function autenticar(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Usuário não autenticado"
            });
        }

        const dados = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const usuario = await Usuario.findById(dados.id);

        if (!usuario) {
            return res.status(401).json({
                message: "Usuário não encontrado"
            });
        }

        req.usuario = usuario;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Sessão inválida"
        });
    }
}

module.exports = autenticar;