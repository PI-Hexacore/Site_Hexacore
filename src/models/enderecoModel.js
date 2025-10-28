var database = require("../database/config");

function cadastrar(tipoLogradouro, logradouro, numero, bairro, cidade, uf, cep) {
  var instrucaoSql = `INSERT INTO endereco (tipoLogradouro, logradouro, numero, bairro, cidade, uf, cep) VALUES ('${tipoLogradouro}', '${logradouro}', '${numero}', '${bairro}', '${cidade}', '${uf}', '${cep}')`;

  return database.executar(instrucaoSql);
}

module.exports = { cadastrar };