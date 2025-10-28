var database = require("../database/config");


function cadastrar(razaoEmp ,nomeEmp, emailEmp, cnpjEmp, senhaEmp, telefoneEmp) {
  var instrucaoSql = `INSERT INTO usuario (razaoSocial , nomeFantasia, cnpj, email, senhaEmpresa, telefone) VALUES ('${razaoEmp}', '${nomeEmp}', '${cnpjEmp}', '${emailEmp}', '${senhaEmp}', '${telefoneEmp}')`;

  return database.executar(instrucaoSql);
}

function autenticar(emailEmp, senhaEmp) {
    var instrucaoSql = `
        SELECT id, nomeEmpresa, emailEmpresa, cnpj FROM usuario WHERE email = '${emailEmp}' AND senha = '${senhaEmp}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {autenticar, cadastrar};
