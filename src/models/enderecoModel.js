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

function atualizar(idUsuario, dadosAtualizacao) {
    var campos = [];

    if (dadosAtualizacao.cep) {
        campos.push(`cd_cep = '${dadosAtualizacao.cep}'`);
    }
    if (dadosAtualizacao.logradouro) {
        campos.push(`nm_logradouro = '${dadosAtualizacao.logradouro}'`);
    }
    if (dadosAtualizacao.numero) {
        campos.push(`nr_logradouro = '${dadosAtualizacao.numero}'`);
    }
    if (dadosAtualizacao.bairro) {
        campos.push(`nm_bairro = '${dadosAtualizacao.bairro}'`);
    }
    if (dadosAtualizacao.cidade) {
        campos.push(`nm_cidade = '${dadosAtualizacao.cidade}'`);
    }
    if (dadosAtualizacao.uf) {
        campos.push(`sg_uf = '${dadosAtualizacao.uf}'`);
    }

    if (campos.length === 0) {
        throw new Error("Nenhum campo válido para atualizar o endereço.");
    }

    var instrucaoSql = `
        UPDATE Endereco 
        SET ${campos.join(", ")} 
        WHERE fk_Usuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    buscarPorId,
    atualizar
};
