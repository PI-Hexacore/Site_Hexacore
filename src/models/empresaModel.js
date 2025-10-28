var database = require("../database/config");


function cadastrarEmpresa(nomeEmp, emailEmp, cnpj, senha) {
  var instrucaoSql = `INSERT INTO empresa (nomeEmpresa, emailEmpresa, CNPJ, senhaEmpresa) VALUES ('${nomeEmp}', '${emailEmp}', '${cnpj}', '${senha}')`;

  return database.executar(instrucaoSql);
}

function autenticar(emailEmp, senha) {
    var instrucaoSql = `
        SELECT id, nomeEmpresa, emailEmpresa, cnpj FROM Empresa WHERE emailEmpresa = '${emailEmp}' AND senhaEmpresa = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = { autenticar, cadastrarEmpresa};
