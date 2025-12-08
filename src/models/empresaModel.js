var database = require("../database/config");

function autenticar(email, senha) {
    console.log("ACESSEI O EMPRESA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function autenticar():", email, senha)
    var instrucaoSql = `
        SELECT id_usuario as id, nm_razao_social as razaoSocial, nm_fantasia as nome, ds_email as email, ds_senha as senha FROM Usuario WHERE ds_email = '${email}' AND ds_senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(razao, nome, email, cnpj, senha, telefone) {
    console.log("ACESSEI O EMPRESA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", razao, nome, email, cnpj, senha, telefone);
    var instrucaoSql = `
        INSERT INTO Usuario (nm_razao_social, nm_fantasia, ds_email, cd_cnpj, ds_senha, cd_telefone) VALUES ('${razao}', '${nome}', '${email}', '${cnpj}', '${senha}', '${telefone}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPorId(idUsuario) {
    var instrucaoSql = `SELECT id_usuario, nm_razao_social as razaoSocial, nm_fantasia as nomeFantasia, ds_email as email, cd_cnpj as cnpj, cd_telefone as telefone FROM Usuario WHERE id_usuario = ${idUsuario}`;
    return database.executar(instrucaoSql);
}

function atualizar(idUsuario, dadosAtualizacao) {
    console.log("ACESSEI O EMPRESA MODEL \n function atualizar():", idUsuario, dadosAtualizacao);

    var campos = [];

    if (dadosAtualizacao.razaoSocial) {
        campos.push(`nm_razao_social = '${dadosAtualizacao.razaoSocial}'`);
    }
    if (dadosAtualizacao.nomeFantasia) {
        campos.push(`nm_fantasia = '${dadosAtualizacao.nomeFantasia}'`);
    }
    if (dadosAtualizacao.cnpj) {
        campos.push(`cd_cnpj = '${dadosAtualizacao.cnpj}'`);
    }
    if (dadosAtualizacao.email) {
        campos.push(`ds_email = '${dadosAtualizacao.email}'`);
    }
    if (dadosAtualizacao.telefone) {
        campos.push(`cd_telefone = '${dadosAtualizacao.telefone}'`);
    }
    if (dadosAtualizacao.senha != null && dadosAtualizacao.senha !== "") {
        campos.push(`ds_senha = '${dadosAtualizacao.senha}'`);
    }

    if (campos.length === 0) {
        throw new Error("Nenhum campo válido para atualizar o usuário.");
    }

    var instrucaoSql = `
        UPDATE Usuario
        SET ${campos.join(", ")}
        WHERE id_usuario = ${idUsuario};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletar(idUsuario) {
    console.log("ACESSEI O EMPRESA MODEL \n function deletar():", idUsuario);
    var instrucaoSql = `DELETE FROM Usuario WHERE id_usuario = ${idUsuario};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function contar() {
    var instrucaoSql = `SELECT COUNT(*) as total FROM Usuario;`;
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar,
    buscarPorId,
    atualizar,
    deletar,
    contar // Exportando a nova função
};
