var database = require("../database/config");


function cadastrar(razaoEmp ,nomeEmp, emailEmp, cnpjEmp, senhaEmp, telefoneEmp) {
  var instrucaoSql = `INSERT INTO Usuario (nm_razao_social , nm_fantasia, cd_cnpj, ds_email, ds_senha, cd_telefone) VALUES ('${razaoEmp}', '${nomeEmp}', '${cnpjEmp}', '${emailEmp}', '${senhaEmp}', '${telefoneEmp}')`;

  return database.executar(instrucaoSql);
}

function autenticar(emailEmp, senhaEmp) {
    var instrucaoSql = `
        SELECT id_usuario, nm_razao_social, ds_email, cd_cnpj FROM Usuario WHERE email = '${emailEmp}' AND senha = '${senhaEmp}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {autenticar, cadastrar};
