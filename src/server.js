require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

connectDatabase();

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});