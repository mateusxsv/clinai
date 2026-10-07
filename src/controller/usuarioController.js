const Paciente = require("../model/Paciente");
const Medico = require("../model/Medico");

async function meuPerfil(req, res) {
    try {

        if (req.usuario.tipo === "paciente") {

            const paciente = await Paciente.findById(
                req.usuario.paciente
            );

            if (!paciente) {
                return res.status(404).json({
                    message: "Paciente não encontrado"
                });
            }

            return res.status(200).json({
                id: paciente._id,
                name: paciente.nome,
                email: req.usuario.email,
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
        }

        if (req.usuario.tipo === "medico") {

            const medico = await Medico.findById(
                req.usuario.medico
            );

            return res.status(200).json({
                id: medico._id,
                name: medico.nome,
                email: req.usuario.email,
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

        res.status(403).json({
            message: "Perfil não disponível"
        });

    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar perfil",
            error: error.message
        });
    }
}

module.exports = {
    meuPerfil
};