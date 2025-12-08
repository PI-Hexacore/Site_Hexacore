const database = require("../database/db");

async function buscarPorPais(idUsuario, pais) {
    return database.executar(
        `SELECT 
            m.id_musica,
            m.nm_musica,
            ag.nm_artista,
            m.rank_pais,
            m.qt_stream,
            m.nm_album,
            m.tp_album
         FROM ArtistaGravadora ag
         INNER JOIN ArtistaClient ac
                 ON UPPER(ac.nm_artista) = UPPER(ag.nm_artista)
         INNER JOIN MusicaClient m
                 ON m.fk_artista = ac.id_artista
         WHERE ag.fk_id_usuario = ?
           AND UPPER(m.nm_pais) = UPPER(?)
         ORDER BY m.rank_pais ASC, m.qt_stream DESC;`,
        [idUsuario, pais]
    );
}

module.exports = {
    buscarPorPais
};
