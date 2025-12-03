const database = require("../database/db");

async function buscarPorNome(idUsuario, nomeArtista) {
    const resultado = await database.executar(
        `SELECT id_artista 
         FROM ArtistaGravadora
         WHERE fk_id_usuario = ? 
           AND UPPER(nm_artista) = UPPER(?) 
         LIMIT 1;`,
        [idUsuario, nomeArtista]
    );

    return resultado[0] || null;
}

async function buscarPorId(idUsuario, idArtista) {
    const resultado = await database.executar(
        `SELECT id_artista,
                nm_artista,
                ds_genero_musical
           FROM ArtistaGravadora
          WHERE fk_id_usuario = ?
            AND id_artista = ?
          LIMIT 1;`,
        [idUsuario, idArtista]
    );

    return resultado[0] || null;
}

async function listarPorUsuario(idUsuario) {
    return database.executar(
        `SELECT a.id_artista,
                a.nm_artista,
                a.ds_genero_musical
           FROM ArtistaGravadora a
          WHERE a.fk_id_usuario = ?
       ORDER BY a.nm_artista ASC;`,
        [idUsuario]
    );
}

async function cadastrar({ nome, genero, fkUsuario}) {
    const resultado = await database.executar(
        `INSERT INTO ArtistaGravadora (
            nm_artista,
            ds_genero_musical,
            fk_id_usuario
        ) VALUES (?, ?, ?);`,
        [nome, genero || null, fkUsuario]
    );

    return resultado.insertId;
}

async function atualizar({ idArtista, idUsuario, nome, genero}) {
    return database.executar(
        `UPDATE ArtistaGravadora
            SET nm_artista = ?,
                ds_genero_musical = ?
          WHERE id_artista = ?
            AND fk_id_usuario = ?;`,
        [nome, genero || null, idArtista, idUsuario]
    );
}

async function excluir(idUsuario, idArtista) {
    return database.executar(
        `DELETE FROM ArtistaGravadora
          WHERE id_artista = ?
            AND fk_id_usuario = ?;`,
        [idArtista, idUsuario]
    );
}

module.exports = {
    buscarPorNome,
    buscarPorId,
    listarPorUsuario,
    cadastrar,
    atualizar,
    excluir
};
