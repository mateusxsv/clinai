require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Medico = require("../src/model/Medico");
const Usuario = require("../src/model/Usuario");

async function criarUsuarioMedico() {
    try {
        const email = process.argv[2];
        const crm = process.argv[3];
        const senha = process.argv[4];

        if (!email || !crm || !senha) {
            console.log(
                "Uso: node scripts/criarUsuarioMedico.js EMAIL CRM SENHA"
            );
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB conectado");

        const medico = await Medico.findOne({
            email: email.toLowerCase(),
            crm: crm
        });

        if (!medico) {
            console.log("Médico não encontrado");
            process.exit(1);
        }

        const usuarioExistente = await Usuario.findOne({
            email: email.toLowerCase()
        });

        if (usuarioExistente) {
            console.log("Já existe um usuário com esse e-mail");
            process.exit(1);
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const usuario = await Usuario.create({
            nome: medico.nome,
            email: medico.email,
            senha: senhaHash,
            tipo: "medico",
            medico: medico._id
        });

        console.log("Usuário médico criado com sucesso!");
        console.log("Nome:", usuario.nome);
        console.log("Email:", usuario.email);
        console.log("Tipo:", usuario.tipo);

    } catch (error) {
        console.error("Erro:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

criarUsuarioMedico();