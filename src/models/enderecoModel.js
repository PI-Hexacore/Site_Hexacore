var database = require("../database/config");

function cadastrar(tipoLogradouro, logradouro, numero, bairro, cidade, uf, cep, fkUsuario) {
    var instrucaoSql = `
        INSERT INTO Endereco (ds_tipo_logradouro, nm_logradouro, nr_logradouro, nm_bairro, nm_cidade, sg_uf, cd_cep, fk_Usuario) 
        VALUES ('${tipoLogradouro}', '${logradouro}', '${numero}', '${bairro}', '${cidade}', '${uf}', '${cep}', ${fkUsuario});
    `;
    return database.executar(instrucaoSql);
}

function buscarPorId(idUsuario) {
    // Supondo que a tabela Endereco tem uma fkUsuario que a liga ao Usuario
    var instrucaoSql = `SELECT ds_tipo_logradouro as tipoLogradouro, nm_logradouro as logradouro, nr_logradouro as numero, nm_bairro as bairro, nm_cidade as cidade, sg_uf as uf, cd_cep as cep FROM Endereco WHERE fk_Usuario = ${idUsuario}`;
    return database.executar(instrucaoSql);
}

function atualizar(idUsuario, cep, logradouro, numero, bairro, cidade, uf) {
    var instrucaoSql = `
        UPDATE Endereco 
        SET cd_cep = '${cep}', nm_logradouro = '${logradouro}', nr_logradouro = '${numero}', nm_bairro = '${bairro}', nm_cidade = '${cidade}', sg_uf = '${uf}' 
        WHERE fk_Usuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    buscarPorId,
    atualizar
};