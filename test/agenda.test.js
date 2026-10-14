const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const agenda = require("../src/dominio/agenda");
const id = "a".repeat(24);
const disponibilidade = { inicio: "08:00", fim: "09:00", duracao: 30 };
function controller(nome, models) {
  const module = { exports: {} };
  vm.runInNewContext(
    fs.readFileSync(path.join(__dirname, "../src/controller", nome), "utf8"),
    {
      module,
      exports: module.exports,
      require: (n) =>
        n.includes("/dominio/") ? agenda : models[n.split("/").pop()],
    },
  );
  return module.exports;
}
function response() {
  return {
    code: 200,
    status(n) {
      this.code = n;
      return this;
    },
    json(v) {
      this.body = v;
      return this;
    },
  };
}
function setup() {
  const models = {
    Usuario: {
      findById: async () => ({ tipo: "paciente", paciente: "paciente-1" }),
    },
    Medico: { exists: async () => true },
    Disponibilidade: { findOne: async () => disponibilidade },
    Consulta: {
      findOne: async () => null,
      init: async () => {},
      create: async (v) => ({
        ...v,
        _id: id,
        status: "scheduled",
        populate: async () => {},
      }),
    },
  };
  return {
    models,
    c: controller("consultaController.js", models),
    req: {
      usuario: { _id: id },
      body: { doctorId: id, date: "2099-05-10", time: "08:00" },
    },
    res: response(),
  };
}
test("valida datas, fuso e duração sem gerar loops inválidos", () => {
  assert.equal(agenda.dataValida("2099-02-30"), false);
  assert.equal(
    agenda.futuro("2099-05-10", "10:00", Date.parse("2099-05-10T13:00:00Z")),
    false,
  );
  assert.deepEqual(agenda.horarios(disponibilidade), ["08:00", "08:30"]);
  for (const duracao of [0, -1, NaN, Infinity, 1.5, "30"])
    assert.deepEqual(agenda.horarios({ ...disponibilidade, duracao }), []);
});
test("reserva válida preserva contrato do frontend", async () => {
  const { c, req, res } = setup();
  await c.criarConsulta(req, res);
  assert.equal(res.code, 201);
  assert.equal(res.body.time, "08:00");
  assert.equal(res.body.plan, "Particular");
});
test("rejeita passado, data inválida e horário fora da agenda", async () => {
  for (const [date, time, status] of [
    ["2000-01-01", "08:00", 400],
    ["2099-02-30", "08:00", 400],
    ["2099-05-10", "08:15", 409],
  ]) {
    const { c, req, res } = setup();
    req.body.date = date;
    req.body.time = time;
    await c.criarConsulta(req, res);
    assert.equal(res.code, status);
  }
});
test("converte conflito concorrente do índice único em 409", async () => {
  const { c, models, req, res } = setup();
  models.Consulta.create = async () => {
    throw { code: 11000 };
  };
  await c.criarConsulta(req, res);
  assert.equal(res.code, 409);
});
test("atualização exige titular e não reativa canceladas", async () => {
  const { c, models, res } = setup();
  let filtro;
  models.Consulta.findOneAndUpdate = (f) => {
    filtro = f;
    return {
      populate() {
        return this;
      },
      then(resolve) {
        return Promise.resolve(null).then(resolve);
      },
    };
  };
  await c.atualizarConsulta(
    {
      params: { id },
      usuario: { tipo: "paciente", paciente: "paciente-1" },
      body: { status: "confirmed" },
    },
    res,
  );
  assert.equal(filtro.paciente, "paciente-1");
  assert.equal(
    JSON.stringify(filtro.status),
    JSON.stringify({ $in: ["scheduled", "confirmed"] }),
  );
  assert.equal(res.code, 404);
});
test("horários excluem reservas ativas e dados inválidos", async () => {
  const models = {
    Medico: { exists: async () => true },
    Disponibilidade: { findOne: async () => disponibilidade },
    Consulta: { find: async () => [{ horario: "08:00" }] },
  };
  const c = controller("disponibilidadeController.js", models),
    res = response();
  await c.buscarHorarios(
    { params: { id }, query: { date: "2099-05-10" } },
    res,
  );
  assert.equal(JSON.stringify(res.body), '["08:30"]');
  models.Disponibilidade.findOne = async () => ({
    ...disponibilidade,
    duracao: 0,
  });
  const invalid = response();
  await c.buscarHorarios(
    { params: { id }, query: { date: "2099-05-10" } },
    invalid,
  );
  assert.equal(JSON.stringify(invalid.body), "[]");
});
test("disponibilidade pertence ao médico autenticado", async () => {
  let filtro;
  const models = {
    Disponibilidade: {
      findOneAndUpdate: async (f, v) => {
        filtro = f;
        return v;
      },
    },
  };
  const c = controller("disponibilidadeController.js", models),
    res = response();
  await c.salvarDisponibilidade(
    {
      usuario: { tipo: "medico", medico: id },
      body: {
        medico: "outro",
        date: "2099-05-10",
        start: "08:00",
        end: "09:00",
        duration: 30,
      },
    },
    res,
  );
  assert.equal(res.code, 200);
  assert.equal(filtro.medico, id);
  assert.equal(res.body.start, "08:00");
  const denied = response();
  await c.salvarDisponibilidade(
    { usuario: { tipo: "paciente" }, body: {} },
    denied,
  );
  assert.equal(denied.code, 403);
});
