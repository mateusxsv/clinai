const Disponibilidade = require("../model/Disponibilidade");
const Consulta = require("../model/Consulta");
const Medico = require("../model/Medico");
const {
  dataValida,
  horarios,
  futuro,
  idValido,
  agendaPadrao,
} = require("../dominio/agenda");
const formatar = (v) => ({
  date: v.data,
  start: v.inicio,
  end: v.fim,
  duration: v.duracao,
});
function medicoDaSessao(req, res) {
  if (req.usuario?.tipo !== "medico" || !req.usuario.medico) {
    res
      .status(403)
      .json({ mensagem: "Somente médicos podem alterar sua disponibilidade" });
    return null;
  }
  return req.usuario.medico;
}
async function listarDisponibilidades(req, res) {
  const medico = medicoDaSessao(req, res);
  if (!medico) return;
  try {
    const lista = await Disponibilidade.find({ medico }).sort({ data: 1 });
    res.json(lista.map(formatar));
  } catch {
    res.status(500).json({ mensagem: "Erro ao buscar disponibilidade" });
  }
}
async function salvarDisponibilidade(req, res) {
  const medico = medicoDaSessao(req, res);
  if (!medico) return;
  const body = req.body;
  const data = body.date ?? body.data;
  const valor = {
    medico,
    data,
    inicio: body.start ?? body.inicio,
    fim: body.end ?? body.fim,
    duracao: body.duration ?? body.duracao,
  };
  if (!dataValida(data) || !horarios(valor).length || !futuro(data, valor.fim))
    return res.status(400).json({
      mensagem:
        "Informe uma data futura, um período válido e duração de 10 a 120 minutos",
    });
  try {
    const salva = await Disponibilidade.findOneAndUpdate(
      { medico, data },
      valor,
      { new: true, upsert: true, runValidators: true },
    );
    res.json(formatar(salva));
  } catch {
    res.status(500).json({ mensagem: "Erro ao salvar disponibilidade" });
  }
}
async function buscarHorarios(req, res) {
  const medico = req.params.id,
    data = req.query.date;
  if (!idValido(medico) || !dataValida(data))
    return res.status(400).json({ mensagem: "Médico ou data inválidos" });
  try {
    if (!(await Medico.exists({ _id: medico })))
      return res.status(404).json({ mensagem: "Médico não encontrado" });
    const disponibilidade = await Disponibilidade.findOne({ medico, data });
    const consultas = await Consulta.find({
      medico,
      data,
      status: { $in: ["scheduled", "confirmed"] },
    });
    const ocupados = new Set(consultas.map((c) => c.horario));
    res.json(
      horarios(disponibilidade ?? agendaPadrao(medico, data)).filter(
        (h) => futuro(data, h) && !ocupados.has(h),
      ),
    );
  } catch {
    res.status(500).json({ mensagem: "Erro ao buscar horários" });
  }
}
module.exports = {
  salvarDisponibilidade,
  listarDisponibilidades,
  buscarHorarios,
};
