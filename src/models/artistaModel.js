const database = require("../database/db");

async function buscarPorNome(idUsuario, nomeArtista) {
    const resultado = await database.executar(
        `SELECT id_artista 
         FROM Artista 
         WHERE fk_usuario = ? 
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
                ds_genero_musical,
                fk_dados_spotify_top,
                fk_dados_spotify_youtube
           FROM Artista
          WHERE fk_usuario = ?
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
                a.ds_genero_musical,
                a.fk_dados_spotify_top,
                a.fk_dados_spotify_youtube,
                COALESCE(SUM(m.qt_stream), 0) AS total_streams
           FROM Artista a
      LEFT JOIN Musica m ON m.fk_artista = a.id_artista
          WHERE a.fk_usuario = ?
       GROUP BY a.id_artista
       ORDER BY a.nm_artista ASC;`,
        [idUsuario]
    );
}

async function cadastrar({ nome, genero, fkUsuario, fkSpotifyTop, fkSpotifyYoutube }) {
    const resultado = await database.executar(
        `INSERT INTO Artista (
            nm_artista,
            ds_genero_musical,
            fk_usuario,
            fk_dados_spotify_top,
            fk_dados_spotify_youtube
        ) VALUES (?, ?, ?, ?, ?);`,
        [nome, genero || null, fkUsuario, fkSpotifyTop, fkSpotifyYoutube]
    );

    return resultado.insertId;
}

async function atualizar({ idArtista, idUsuario, nome, genero, fkSpotifyTop, fkSpotifyYoutube }) {
    return database.executar(
        `UPDATE Artista
            SET nm_artista = ?,
                ds_genero_musical = ?,
                fk_dados_spotify_top = ?,
                fk_dados_spotify_youtube = ?
          WHERE id_artista = ?
            AND fk_usuario = ?;`,
        [nome, genero || null, fkSpotifyTop, fkSpotifyYoutube, idArtista, idUsuario]
    );
}

async function excluir(idUsuario, idArtista) {
    return database.executar(
        `DELETE FROM Artista
          WHERE id_artista = ?
            AND fk_usuario = ?;`,
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
