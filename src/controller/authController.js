const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Usuario = require("../model/Usuario");
const Paciente = require("../model/Paciente");

function gerarToken(usuario) {
    return jwt.sign({
        id: usuario._id,
        tipo: usuario.tipo
        }, 
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);
}

async function registrar(req, res) {
    try {
        const {
            name,
            email,
            password,
            birth,
            phone,
            health
        } = req.body;

        const usuarioExistente = await Usuario.findOne({ email });

        if (usuarioExistente) {
            return res.status(409).json({
                message: "E-mail já cadastrado"
            });
        }

        const senhaHash = await bcrypt.hash(password, 10);

        const paciente = await Paciente.create({
            nome: name,
            email,
            dataNascimento: birth,
            telefone: phone,

            historico: {
                doencasCronicas: health?.chronic || "",
                alergias: health?.allergies || "",
                reacoes: health?.reaction || "",
                medicamentos: health?.medications || "",
                cirurgias: health?.surgeries || "",
                apoio: health?.support || ""
            }
        });

        const usuario = await Usuario.create({
            nome: name,
            email,
            senha: senhaHash,
            tipo: "paciente",
            paciente: paciente._id
        });

        const token = gerarToken(usuario);

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax"
        });

        res.status(201).json({
            id: paciente._id,
            name: paciente.nome,
            email: paciente.email,
            birth: paciente.dataNascimento,
            phone: paciente.telefone,
            role: "patient",

            health: {
                chronic: paciente.historico?.doencasCronicas || "",
                allergies: paciente.historico?.alergias || "",
                reaction: paciente.historico?.reacoes || "",
                medications: paciente.historico?.medicamentos || "",
                surgeries: paciente.historico?.cirurgias || "",
                support: paciente.historico?.apoio || ""
            }
        });

    } catch (error) {
    console.error("ERRO AO CADASTRAR PACIENTE:");
    console.error(error);

    res.status(500).json({
        message: "Erro ao cadastrar paciente",
        error: error.message
    });
    }
}

async function login(req, res) {
    try {
        const { email, password, role } = req.body;

        const usuario = await Usuario
            .findOne({ email })
            .populate("paciente")
            .populate("medico");

        if (!usuario) {
            return res.status(401).json({
                message: "E-mail ou senha inválidos"
            });
        }

        const senhaCorreta = await bcrypt.compare(
            password,
            usuario.senha
        );

        if (!senhaCorreta) {
            return res.status(401).json({
                message: "E-mail ou senha inválidos"
            });
        }

        const tipoEsperado =
            role === "doctor" ? "medico" : "paciente";

        if (usuario.tipo !== tipoEsperado && usuario.tipo !== "admin") {
            return res.status(403).json({
                message: "Tipo de usuário inválido"
            });
        }

        const token = gerarToken(usuario);

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax"
        });

        if (usuario.tipo === "medico") {
            const medico = usuario.medico;

            return res.status(200).json({
                id: medico._id,
                name: medico.nome,
                email: usuario.email,
                birth: "",
                phone: "",
                role: "doctor",
                health: {
                    chronic: "",
                    allergies: "",
                    reaction: "",
                    medications: "",
                    surgeries: "",
                    support: ""
                }
            });
        }

        const paciente = usuario.paciente;

        res.status(200).json({
            id: paciente._id,
            name: paciente.nome,
            email: usuario.email,
            birth: paciente.dataNascimento || "",
            phone: paciente.telefone || "",
            role: "patient",

            health: {
                chronic: paciente.historico?.doencasCronicas || "",
                allergies: paciente.historico?.alergias || "",
                reaction: paciente.historico?.reacoes || "",
                medications: paciente.historico?.medicamentos || "",
                surgeries: paciente.historico?.cirurgias || "",
                support: paciente.historico?.apoio || ""
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Erro ao realizar login",
            error: error.message
        });
    }
}

function logout(req, res) {
    res.clearCookie("token");

    res.status(200).json({
        message: "Logout realizado com sucesso"
    });
}

module.exports = {
    registrar,
    login,
    logout
};