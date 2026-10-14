const Disponibilidade = require("../model/Disponibilidade");
const Medico = require("../model/Medico");
const { futuro, horarios, idValido } = require("../dominio/agenda");
const Consulta = require("../model/Consulta");
const Usuario = require("../model/Usuario");

function formatarConsulta(consulta) {
  return {
    id: consulta._id,
    doctorId: consulta.medico?._id || consulta.medico,
    patientName: consulta.paciente?.nome || "Paciente",

    date: consulta.data,
    time: consulta.horario,
    plan: consulta.plano || "Particular",

    status: consulta.status,

    health: {
      chronic: consulta.historico?.doencasCronicas || "",

      allergies: consulta.historico?.alergias || "",

      reaction: consulta.historico?.reacoes || "",

      medications: consulta.historico?.medicamentos || "",

      surgeries: consulta.historico?.cirurgias || "",

      support: consulta.historico?.apoio || "",
    },

    report: consulta.relato
      ? {
          complaint: consulta.relato.queixa || "",

          onset: consulta.relato.inicio || "",

          location: consulta.relato.local || "",

          evolution: consulta.relato.evolucao || "",

          pain: consulta.relato.dor || 0,

          other: consulta.relato.outros || "",

          medication: consulta.relato.medicamento || "",

          pregnancy: consulta.relato.gravidez || "",
        }
      : undefined,

    reviewed: consulta.revisado || false,
  };
}

async function criarConsulta(req, res) {
  try {
    const usuario = await Usuario.findById(req.usuario._id);

    if (!usuario || usuario.tipo !== "paciente" || !usuario.paciente) {
      return res.status(403).json({
        mensagem: "Somente pacientes podem agendar consultas",
      });
    }

    const { doctorId, date, time, plan, health, report } = req.body;

    if (!idValido(doctorId) || !futuro(date, time))
      return res
        .status(400)
        .json({ mensagem: "Selecione uma data e um horário futuros válidos" });
    if (!(await Medico.exists({ _id: doctorId })))
      return res.status(404).json({ mensagem: "Médico não encontrado" });
    const disponibilidade = await Disponibilidade.findOne({
      medico: doctorId,
      data: date,
    });
    if (!horarios(disponibilidade).includes(time))
      return res
        .status(409)
        .json({
          mensagem: "Este horário não está mais disponível. Escolha outro.",
        });

    const existente = await Consulta.findOne({
      medico: doctorId,
      data: date,
      horario: time,
      status: { $ne: "cancelled" },
    });

    if (existente) {
      return res.status(409).json({
        mensagem: "Este horário já está ocupado",
      });
    }

    await Consulta.init();
    const consulta = await Consulta.create({
      paciente: usuario.paciente,
      medico: doctorId,

      data: date,
      horario: time,
      plano: plan,

      historico: {
        doencasCronicas: health?.chronic || "",

        alergias: health?.allergies || "",

        reacoes: health?.reaction || "",

        medicamentos: health?.medications || "",

        cirurgias: health?.surgeries || "",

        apoio: health?.support || "",
      },

      relato: report
        ? {
            queixa: report.complaint || "",

            inicio: report.onset || "",

            local: report.location || "",

            evolucao: report.evolution || "",

            dor: report.pain || 0,

            outros: report.other || "",

            medicamento: report.medication || "",

            gravidez: report.pregnancy || "",
          }
        : undefined,
    });

    await consulta.populate("paciente");

    res.status(201).json(formatarConsulta(consulta));
  } catch (error) {
    if (error.code === 11000)
      return res
        .status(409)
        .json({ mensagem: "Este horário já está ocupado. Escolha outro." });
    res.status(500).json({
      mensagem: "Erro ao criar consulta",
      erro: error.message,
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

    const consultas = await Consulta.find(filtro)
      .populate("paciente")
      .populate("medico")
      .sort({
        data: 1,
        horario: 1,
      });

    res.status(200).json(consultas.map(formatarConsulta));
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao listar consultas",
      erro: error.message,
    });
  }
}

async function atualizarConsulta(req, res) {
  if (!idValido(req.params.id))
    return res.status(400).json({ mensagem: "Consulta inválida" });
  const usuario = req.usuario;
  const filtro = {
    _id: req.params.id,
    status: { $in: ["scheduled", "confirmed"] },
  };
  const alteracoes = {};
  if (usuario.tipo === "paciente" && usuario.paciente) {
    filtro.paciente = usuario.paciente;
    if (
      !["confirmed", "cancelled"].includes(req.body.status) ||
      req.body.reviewed !== undefined
    )
      return res
        .status(400)
        .json({ mensagem: "Alteração de consulta inválida" });
    alteracoes.status = req.body.status;
  } else if (usuario.tipo === "medico" && usuario.medico) {
    filtro.medico = usuario.medico;
    if (typeof req.body.reviewed !== "boolean" || req.body.status !== undefined)
      return res
        .status(400)
        .json({ mensagem: "Alteração de consulta inválida" });
    alteracoes.revisado = req.body.reviewed;
  } else return res.status(403).json({ mensagem: "Acesso não permitido" });
  try {
    const consulta = await Consulta.findOneAndUpdate(filtro, alteracoes, {
      new: true,
      runValidators: true,
    })
      .populate("paciente")
      .populate("medico");
    if (!consulta)
      return res
        .status(404)
        .json({ mensagem: "Consulta não encontrada ou já cancelada" });
    res.json(formatarConsulta(consulta));
  } catch {
    res.status(500).json({ mensagem: "Erro ao atualizar consulta" });
  }
}

module.exports = {
  criarConsulta,
  listarConsultas,
  atualizarConsulta,
};
