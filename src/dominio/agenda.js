function dataValida(data) {
  if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data))
    return false;
  const valor = new Date(`${data}T12:00:00Z`);
  return (
    Number.isFinite(valor.getTime()) &&
    valor.toISOString().slice(0, 10) === data
  );
}
function minutos(hora) {
  if (typeof hora !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(hora))
    return NaN;
  return Number(hora.slice(0, 2)) * 60 + Number(hora.slice(3));
}
function futuro(data, hora, agora = Date.now()) {
  return (
    dataValida(data) &&
    Number.isFinite(minutos(hora)) &&
    Date.parse(`${data}T${hora}:00-03:00`) > agora
  );
}
function horarios(disponibilidade) {
  if (!disponibilidade) return [];
  const { inicio, fim, duracao } = disponibilidade;
  const inicioMin = minutos(inicio),
    fimMin = minutos(fim);
  if (
    !Number.isInteger(duracao) ||
    duracao < 10 ||
    duracao > 120 ||
    !Number.isFinite(inicioMin) ||
    !Number.isFinite(fimMin) ||
    inicioMin >= fimMin
  )
    return [];
  const lista = [];
  for (let atual = inicioMin; atual + duracao <= fimMin; atual += duracao)
    lista.push(
      `${String(Math.floor(atual / 60)).padStart(2, "0")}:${String(atual % 60).padStart(2, "0")}`,
    );
  return lista;
}
const idValido = (id) => typeof id === "string" && /^[a-f\d]{24}$/i.test(id);
module.exports = { dataValida, minutos, futuro, horarios, idValido };

// Ciclo estável por médico: qualquer janela de 14 dias contém 5 dias
// fechados e 2 dias reduzidos. Cadastros explícitos têm prioridade.
function agendaPadrao(medico, data) {
  if (!dataValida(data)) return null;
  let seed = 2166136261;
  for (const letra of String(medico))
    seed = Math.imul(seed ^ letra.charCodeAt(0), 16777619) >>> 0;
  const ordem = Array.from({ length: 14 }, (_, i) => i);
  for (let i = 13; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [ordem[i], ordem[j]] = [ordem[j], ordem[i]];
  }
  const dia = Math.floor(Date.parse(data + "T12:00:00Z") / 86400000);
  const posicao = ordem.indexOf(((dia % 14) + 14) % 14);
  if (posicao < 5) return null;
  return {
    medico,
    data,
    inicio: "08:00",
    fim: posicao < 7 ? "09:00" : "12:00",
    duracao: 30,
  };
}
module.exports.agendaPadrao = agendaPadrao;
