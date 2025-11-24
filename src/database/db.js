const mysql = require("mysql2/promise");

const mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const ambienteValido = process.env.AMBIENTE_PROCESSO === "producao"
    || process.env.AMBIENTE_PROCESSO === "desenvolvimento";

if (!ambienteValido) {
    console.warn("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM .env OU dev.env OU app.js\n");
}

const pool = mysql.createPool(mySqlConfig);

async function executar(instrucao, params = []) {
    if (!ambienteValido) {
        throw new Error("AMBIENTE NÃO CONFIGURADO EM .env");
    }

    try {
        const [resultados] = await pool.execute(instrucao, params);
        return resultados;
    } catch (erro) {
        console.error("Erro ao executar instrução MySQL:", erro.sqlMessage || erro.message);
        throw erro;
    }
}

module.exports = {
    executar,
    pool
};
