var database = require("../database/config");

function cadastrar(tipoLogradouro, logradouro, numero, bairro, cidade, uf, cep) {
  var instrucaoSql = `INSERT INTO Endereco (ds_tipo_logradouro, nm_logradouro, nr_logradouro, nm_bairro, nm_cidade, sg_uf, cd_cep) VALUES ('${tipoLogradouro}', '${logradouro}', '${numero}', '${bairro}', '${cidade}', '${uf}', '${cep}')`;

  return database.executar(instrucaoSql);
}

module.exports = { cadastrar };