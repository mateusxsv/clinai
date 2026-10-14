# ClinAi — Backend

Backend da aplicação **ClinAi**, uma plataforma de pré-triagem e agendamento de consultas médicas.

A API é responsável pelo cadastro e autenticação de usuários, gerenciamento de pacientes e médicos, disponibilidade dos profissionais, horários livres, consultas e dados de pré-triagem.

## Tecnologias utilizadas

- Node.js
- Express
- MongoDB
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- Cookie Parser
- CORS
- dotenv
- Nodemon

## Backend publicado

A API está hospedada no Render:

```text
https://clinai-api-ucpj.onrender.com
```

Teste básico:

```text
GET /
```

Resposta esperada:

```json
{
  "mensagem": "API do ClinAi funcionando!"
}
```

---

# Funcionalidades

O backend atualmente possui:

- Cadastro de pacientes
- Cadastro e gerenciamento de médicos
- Cadastro de pré-triagem
- Autenticação com e-mail e senha
- Senhas protegidas com bcrypt
- Sessão utilizando JWT em cookie
- Identificação do usuário autenticado
- Perfil de paciente e médico
- Disponibilidade dos médicos
- Cálculo automático de horários livres
- Agendamento de consultas
- Bloqueio de horários já ocupados
- Consulta da agenda do paciente
- Consulta da agenda do médico
- Confirmação e cancelamento de consultas
- Histórico de saúde associado à consulta
- Relato de pré-triagem associado ao atendimento

---

# Estrutura do projeto

```text
clinai/
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controller/
│   │   ├── authController.js
│   │   ├── pacienteController.js
│   │   ├── medicoController.js
│   │   ├── preTriagemController.js
│   │   ├── consultaController.js
│   │   ├── disponibilidadeController.js
│   │   └── usuarioController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── model/
│   │   ├── Usuario.js
│   │   ├── Paciente.js
│   │   ├── Medico.js
│   │   ├── PreTriagem.js
│   │   ├── Consulta.js
│   │   └── Disponibilidade.js
│   │
│   ├── router/
│   │   ├── authRouter.js
│   │   ├── pacienteRouter.js
│   │   ├── medicoRouter.js
│   │   ├── preTriagemRouter.js
│   │   ├── consultaRouter.js
│   │   ├── disponibilidadeRouter.js
│   │   └── usuarioRouter.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# Pré-requisitos

Antes de executar o projeto, é necessário possuir:

- Node.js instalado
- npm instalado
- Conta no MongoDB Atlas ou MongoDB local
- Git instalado

Confira:

```bash
node -v
npm -v
git --version
```

---

# Clonando o projeto

```bash
git clone https://github.com/mateusxsv/clinai.git
```

Entre na pasta:

```bash
cd clinai
```

Instale as dependências:

```bash
npm install
```

---

# Variáveis de ambiente

Crie um arquivo chamado:

```text
.env
```

na raiz do projeto.

Exemplo:

```env
MONGODB_URI=mongodb+srv://USUARIO:SENHA@cluster.mongodb.net/NOME_DO_BANCO

JWT_SECRET=SUA_CHAVE_SECRETA

PORT=3000
```

## MONGODB_URI

É a string de conexão com o MongoDB.

Exemplo:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/test
```

## JWT_SECRET

É a chave utilizada para assinar os tokens de autenticação.

Ela **não é a URI do MongoDB**.

Uma chave pode ser gerada usando:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copie o resultado para:

```env
JWT_SECRET=resultado_gerado
```

Nunca publique o `.env`.

O `.gitignore` deve possuir:

```gitignore
node_modules/
.env
```

---

# Executando localmente

Modo desenvolvimento:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

O servidor será iniciado em:

```text
http://localhost:3000
```

Se tudo estiver correto:

```text
Servidor rodando na porta 3000
MongoDB conectado!
```

---

# Rotas principais

A API utiliza o prefixo:

```text
/api
```

## Autenticação

### Cadastrar paciente

```http
POST /api/auth/register
```

Exemplo:

```json
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "12345678",
  "birth": "2000-05-20",
  "phone": "81999999999",
  "health": {
    "chronic": "",
    "allergies": "",
    "reaction": "",
    "medications": "",
    "surgeries": "",
    "support": ""
  }
}
```

A senha é criptografada com bcrypt antes de ser armazenada.

---

### Login

```http
POST /api/auth/login
```

Paciente:

```json
{
  "email": "maria@email.com",
  "password": "12345678",
  "role": "patient"
}
```

Médico:

```json
{
  "email": "medico@clinai.com",
  "password": "senha",
  "role": "doctor"
}
```

Após o login, o backend cria um JWT e envia o token através de um cookie HTTP Only.

---

### Logout

```http
POST /api/auth/logout
```

---

### Usuário autenticado

```http
GET /api/me
```

Retorna os dados do paciente ou médico atualmente autenticado.

Essa rota requer uma sessão válida.

---

# Pacientes

Base:

```text
/api/patients
```

Rotas:

```http
POST   /api/patients
GET    /api/patients
GET    /api/patients/:id
PUT    /api/patients/:id
DELETE /api/patients/:id
```

O cadastro principal utilizado pelo frontend ocorre através de:

```http
POST /api/auth/register
```

pois essa rota cria simultaneamente:

```text
Paciente
+
Usuário
+
Senha criptografada
+
Sessão
```

---

# Médicos

Base:

```text
/api/doctors
```

Rotas:

```http
POST   /api/doctors
GET    /api/doctors
GET    /api/doctors/:id
PUT    /api/doctors/:id
DELETE /api/doctors/:id
```

Exemplo de cadastro:

```http
POST /api/doctors
```

```json
{
  "crm": "67890-PE",
  "nome": "Marina Souza",
  "email": "marina.medica@clinai.com",
  "idade": 38,
  "especialidade": "Oftalmologia",
  "clinica": "ClinAi"
}
```

## Importante: médico e usuário são entidades diferentes

Criar um documento em `medicos` não cria automaticamente uma conta de acesso.

O sistema trabalha com:

```text
Medico
    ↑
    │
Usuario
```

O documento de usuário médico deve possuir:

```text
tipo: medico
medico: ObjectId do médico
```

e a senha precisa ser armazenada utilizando bcrypt.

Nunca salve senhas em texto puro diretamente no MongoDB.

---

# Disponibilidade dos médicos

Para cadastrar disponibilidade:

```http
POST /api/availability
```

Exemplo:

```json
{
  "medico": "ID_DO_MEDICO",
  "data": "2026-10-20",
  "inicio": "08:00",
  "fim": "12:00",
  "duracao": 30
}
```

O campo `duracao` representa a duração de cada consulta em minutos.

Com:

```text
08:00 → 12:00
30 minutos
```

o sistema gera:

```text
08:00
08:30
09:00
09:30
10:00
10:30
11:00
11:30
```

---

# Consultando horários livres

```http
GET /api/doctors/:id/slots?date=AAAA-MM-DD
```

Exemplo:

```text
GET /api/doctors/68ef123456789/slots?date=2026-10-20
```

Resposta:

```json
[
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00"
]
```

Horários que já possuem uma consulta não são retornados.

---

# Consultas

Base:

```text
/api/appointments
```

Estas rotas exigem autenticação.

## Criar consulta

```http
POST /api/appointments
```

Exemplo:

```json
{
  "doctorId": "ID_DO_MEDICO",
  "date": "2026-10-20",
  "time": "09:00",
  "plan": "Particular",
  "health": {
    "chronic": "",
    "allergies": "",
    "reaction": "",
    "medications": "",
    "surgeries": "",
    "support": ""
  }
}
```

O paciente é identificado automaticamente através do usuário autenticado.

Não é necessário enviar o ID do paciente.

---

## Listar consultas

```http
GET /api/appointments
```

O resultado depende do usuário autenticado.

### Paciente

Recebe apenas as próprias consultas.

### Médico

Recebe apenas as consultas vinculadas ao próprio médico.

---

## Atualizar consulta

```http
PATCH /api/appointments/:id
```

Confirmar presença:

```json
{
  "status": "confirmed"
}
```

Cancelar:

```json
{
  "status": "cancelled"
}
```

Marcar resumo como revisado:

```json
{
  "reviewed": true
}
```

Status disponíveis:

```text
scheduled
confirmed
cancelled
```

---

# Pré-triagem

Base:

```text
/api/triages
```

Rotas:

```http
POST   /api/triages
GET    /api/triages
GET    /api/triages/:id
PUT    /api/triages/:id
DELETE /api/triages/:id
```

Exemplo:

```json
{
  "paciente": "ID_DO_PACIENTE",
  "queixa": "Dor de cabeça",
  "descricao": "Dor iniciada pela manhã",
  "especialidade": "Clínica geral",
  "medicamentos": "Nenhum"
}
```

---

# Autenticação

O fluxo de autenticação funciona da seguinte forma:

```text
Cadastro/Login
      ↓
Verificação da senha com bcrypt
      ↓
JWT
      ↓
Cookie HTTP Only
      ↓
authMiddleware
      ↓
Usuário identificado
```

O middleware:

```text
src/middleware/authMiddleware.js
```

verifica o JWT e disponibiliza:

```js
req.usuario
```

para as rotas protegidas.

---

# Banco de dados

Principais collections:

```text
usuarios
pacientes
medicos
pretriagens
consultas
disponibilidades
```

## Relacionamentos principais

```text
Usuario
├── paciente → Paciente
└── medico → Medico
```

```text
Consulta
├── paciente → Paciente
├── medico → Medico
└── preTriagem → PreTriagem
```

```text
Disponibilidade
└── medico → Medico
```

---

# Regra contra horários duplicados

O sistema verifica se já existe uma consulta para:

```text
médico
+
data
+
horário
```

antes de realizar o agendamento.

Também existe um índice no MongoDB para impedir que duas consultas utilizem simultaneamente o mesmo horário do mesmo médico.

Consultas canceladas deixam o horário novamente disponível.

---

# MongoDB Atlas

Ao utilizar MongoDB Atlas, configure:

```text
Database Access
```

com um usuário e senha do banco.

Depois configure:

```text
Network Access
```

Para ambientes de teste/deploy pode ser necessário permitir:

```text
0.0.0.0/0
```

Nunca publique usuário, senha ou URI do MongoDB no GitHub.

---

# Problema conhecido: índice antigo de CPF

Versões anteriores do projeto utilizavam:

```js
cpf: {
  unique: true
}
```

Se o MongoDB ainda possuir o índice:

```text
cpf_1 UNIQUE
```

o cadastro de mais de um paciente sem CPF pode gerar:

```text
E11000 duplicate key error
dup key: { cpf: null }
```

Nesse caso:

1. Abra o MongoDB Atlas.
2. Entre na collection `pacientes`.
3. Abra `Indexes`.
4. Localize `cpf_1`.
5. Remova somente `cpf_1`.
6. **Nunca remova `_id_`.**

No Mongo Shell:

```js
db.pacientes.dropIndex("cpf_1")
```

---

# Deploy no Render

O backend está preparado para funcionar no Render.

O `server.js` utiliza:

```js
const PORT = process.env.PORT || 3000;
```

e:

```js
app.listen(PORT, "0.0.0.0");
```

No Render configure:

```text
Build Command:
npm install
```

```text
Start Command:
npm start
```

Configure também as variáveis:

```env
MONGODB_URI=SUA_URI
JWT_SECRET=SUA_CHAVE
NODE_ENV=production
```

Não é necessário configurar manualmente `PORT`, pois o Render fornece essa variável.

---

# Integração com o frontend

O frontend do ClinAi é uma aplicação React + TypeScript + Vite.

Repositório:

```text
https://github.com/paywin/clinai-front
```

Em desenvolvimento:

```text
Frontend
http://localhost:5173

Backend
http://localhost:3000
```

A URL utilizada pelo frontend local deve ser:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Na versão publicada, o frontend utiliza `/api` e redireciona as chamadas para o backend hospedado no Render.

---

# CORS

Durante desenvolvimento local, o backend aceita requisições do frontend em:

```text
http://localhost:5173
```

Configuração:

```js
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
```

Caso frontend e backend sejam utilizados diretamente em domínios diferentes, configure a origem de produção adequadamente.

---

# Scripts

Executar em desenvolvimento:

```bash
npm run dev
```

Executar em produção:

```bash
npm start
```

---

# Testando com Postman

Exemplos úteis:

### Ver médicos

```http
GET http://localhost:3000/api/doctors
```

### Criar médico

```http
POST http://localhost:3000/api/doctors
```

### Criar disponibilidade

```http
POST http://localhost:3000/api/availability
```

### Consultar horários

```http
GET http://localhost:3000/api/doctors/ID_DO_MEDICO/slots?date=2026-10-20
```

Para rotas autenticadas, é necessário fazer login primeiro para que o cookie JWT seja criado.

---

# Segurança

O projeto utiliza algumas práticas básicas de segurança:

- Senhas armazenadas com bcrypt
- JWT para autenticação
- Cookie HTTP Only
- Variáveis sensíveis armazenadas em `.env`
- Rotas de consultas protegidas por middleware
- Identificação automática do paciente autenticado
- Separação entre `Usuario`, `Paciente` e `Medico`

Nunca envie para o GitHub:

```text
.env
MONGODB_URI
JWT_SECRET
senhas
credenciais do MongoDB Atlas
```

---

# Fluxo principal do sistema

```text
Paciente cria conta
        ↓
Login
        ↓
Perfil e histórico de saúde
        ↓
Consulta médicos
        ↓
Escolhe profissional
        ↓
Seleciona data
        ↓
Backend calcula horários disponíveis
        ↓
Paciente seleciona horário
        ↓
Consulta é salva
        ↓
Horário deixa de ficar disponível
        ↓
Paciente acompanha consulta
        ↓
Médico visualiza sua agenda
        ↓
Médico acessa resumo do paciente
```

---

# Desenvolvido para

Projeto acadêmico **ClinAi**, desenvolvido como uma aplicação Full Stack para auxiliar o processo de pré-triagem, organização de atendimentos e agendamento entre pacientes e profissionais da saúde.