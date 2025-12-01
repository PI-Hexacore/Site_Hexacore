const database = require("../database/db");

async function buscarPorPais(idUsuario, pais) {
    return database.executar(
        `SELECT 
            m.id_musica,
            m.nm_musica,
            a.nm_artista,
            m.rank_pais,
            m.qt_stream,
            m.nm_album,
            m.tp_album
         FROM Musica m
         INNER JOIN Artista a ON m.fk_artista = a.id_artista
         WHERE a.fk_usuario = ?
           AND UPPER(m.nm_pais) = UPPER(?)
         ORDER BY m.rank_pais ASC, m.qt_stream DESC;`,
        [idUsuario, pais]
    );
}

module.exports = {
    buscarPorPais
};
