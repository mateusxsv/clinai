const Consulta = require("../model/Consulta");
const Usuario = require("../model/Usuario");

function formatarConsulta(consulta) {
    return {
        id: consulta._id,
        doctorId: consulta.medico?._id || consulta.medico,
        patientName:
            consulta.paciente?.nome || "Paciente",

        date: consulta.data,
        time: consulta.horario,
        plan: consulta.plano || "Particular",

        status: consulta.status,

        health: {
            chronic:
                consulta.historico?.doencasCronicas || "",

            allergies:
                consulta.historico?.alergias || "",

            reaction:
                consulta.historico?.reacoes || "",

            medications:
                consulta.historico?.medicamentos || "",

            surgeries:
                consulta.historico?.cirurgias || "",

            support:
                consulta.historico?.apoio || ""
        },

        report: consulta.relato
            ? {
                complaint:
                    consulta.relato.queixa || "",

                onset:
                    consulta.relato.inicio || "",

                location:
                    consulta.relato.local || "",

                evolution:
                    consulta.relato.evolucao || "",

                pain:
                    consulta.relato.dor || 0,

                other:
                    consulta.relato.outros || "",

                medication:
                    consulta.relato.medicamento || "",

                pregnancy:
                    consulta.relato.gravidez || ""
            }
            : undefined,

        reviewed: consulta.revisado || false
    };
}

async function criarConsulta(req, res) {
    try {
        const usuario = await Usuario.findById(
            req.usuario._id
        );

        if (
            usuario.tipo !== "paciente" ||
            !usuario.paciente
        ) {
            return res.status(403).json({
                mensagem:
                    "Somente pacientes podem agendar consultas"
            });
        }

        const {
            doctorId,
            date,
            time,
            plan,
            health,
            report
        } = req.body;

        const existente = await Consulta.findOne({
            medico: doctorId,
            data: date,
            horario: time,
            status: { $ne: "cancelled" }
        });

        if (existente) {
            return res.status(409).json({
                mensagem:
                    "Este horário já está ocupado"
            });
        }

        const consulta = await Consulta.create({
            paciente: usuario.paciente,
            medico: doctorId,

            data: date,
            horario: time,
            plano: plan,

            historico: {
                doencasCronicas:
                    health?.chronic || "",

                alergias:
                    health?.allergies || "",

                reacoes:
                    health?.reaction || "",

                medicamentos:
                    health?.medications || "",

                cirurgias:
                    health?.surgeries || "",

                apoio:
                    health?.support || ""
            },

            relato: report
                ? {
                    queixa:
                        report.complaint || "",

                    inicio:
                        report.onset || "",

                    local:
                        report.location || "",

                    evolucao:
                        report.evolution || "",

                    dor:
                        report.pain || 0,

                    outros:
                        report.other || "",

                    medicamento:
                        report.medication || "",

                    gravidez:
                        report.pregnancy || ""
                }
                : undefined
        });

        await consulta.populate("paciente");

        res.status(201).json(
            formatarConsulta(consulta)
        );

    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao criar consulta",
            erro: error.message
        });
    }
}

async function listarConsultas(req, res) {
    try {
        let filtro = {};

        if (req.usuario.tipo === "paciente") {
            filtro.paciente = req.usuario.paciente;
        }

        if (req.usuario.tipo === "medico") {
            filtro.medico = req.usuario.medico;
        }

        const consultas = await Consulta
            .find(filtro)
            .populate("paciente")
            .populate("medico")
            .sort({
                data: 1,
                horario: 1
            });

        res.status(200).json(
            consultas.map(formatarConsulta)
        );

    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao listar consultas",
            erro: error.message
        });
    }
}

async function atualizarConsulta(req, res) {
    try {
        const alteracoes = {};

        if (req.body.status) {
            alteracoes.status = req.body.status;
        }

        if (req.body.reviewed !== undefined) {
            alteracoes.revisado =
                req.body.reviewed;
        }

        const consulta =
            await Consulta.findByIdAndUpdate(
                req.params.id,
                alteracoes,
                { new: true }
            )
            .populate("paciente")
            .populate("medico");

        if (!consulta) {
            return res.status(404).json({
                mensagem:
                    "Consulta não encontrada"
            });
        }

        res.status(200).json(
            formatarConsulta(consulta)
        );

    } catch (error) {
        res.status(500).json({
            mensagem:
                "Erro ao atualizar consulta",
            erro: error.message
        });
    }
}

module.exports = {
    criarConsulta,
    listarConsultas,
    atualizarConsulta
};