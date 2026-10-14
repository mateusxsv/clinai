const Disponibilidade = require("../model/Disponibilidade");
const Consulta = require("../model/Consulta");

async function salvarDisponibilidade(req, res) {
    try {
        const {
            medico,
            data,
            inicio,
            fim,
            duracao
        } = req.body;

        if (!medico || !data || !inicio || !fim || !duracao) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos"
            });
        }

        const disponibilidade =
            await Disponibilidade.findOneAndUpdate(
                { medico, data },
                {
                    medico,
                    data,
                    inicio,
                    fim,
                    duracao
                },
                {
                    new: true,
                    upsert: true
                }
            );

        res.status(200).json(disponibilidade);

    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao salvar disponibilidade",
            erro: error.message
        });
    }
}

async function buscarHorarios(req, res) {
    try {
        const medico = req.params.id;
        const { date } = req.query;

        const disponibilidade =
            await Disponibilidade.findOne({
                medico,
                data: date
            });

        if (!disponibilidade) {
            return res.status(200).json([]);
        }

        const horarios = [];

        const [horaInicio, minutoInicio] =
            disponibilidade.inicio.split(":").map(Number);

        const [horaFim, minutoFim] =
            disponibilidade.fim.split(":").map(Number);

        let atual = horaInicio * 60 + minutoInicio;
        const fim = horaFim * 60 + minutoFim;

        while (atual + disponibilidade.duracao <= fim) {
            const hora = Math.floor(atual / 60);
            const minuto = atual % 60;

            horarios.push(
                `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`
            );

            atual += disponibilidade.duracao;
        }

        const consultas = await Consulta.find({
            medico,
            data: date,
            status: { $ne: "cancelled" }
        });

        const ocupados = consultas.map(
            consulta => consulta.horario
        );

        const livres = horarios.filter(
            horario => !ocupados.includes(horario)
        );

        res.status(200).json(livres);

    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao buscar horários",
            erro: error.message
        });
    }
}

module.exports = {
    salvarDisponibilidade,
    buscarHorarios
};