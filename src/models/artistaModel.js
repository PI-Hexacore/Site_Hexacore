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

module.exports = {
    buscarPorNome,
    cadastrar
};
