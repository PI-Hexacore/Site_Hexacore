const database = require("../database/db");

async function buscarDadosDashboard(idUsuario) {
    const ouvintesBrasilPromise = database.executar(
        `SELECT COALESCE(SUM(m.qt_stream), 0) AS ouvintesBrasil
         FROM Artista a
         LEFT JOIN Musica m 
            ON m.fk_artista = a.id_artista AND m.nm_pais = 'Brasil'
         WHERE a.fk_usuario = ?;`,
        [idUsuario]
    );

    const artistasPromise = database.executar(
        `SELECT 
            a.id_artista AS idArtista,
            a.nm_artista AS nome,
            COALESCE(SUM(m.qt_stream), 0) AS total_streams
         FROM Artista a
         LEFT JOIN Musica m ON m.fk_artista = a.id_artista
         WHERE a.fk_usuario = ?
         GROUP BY a.id_artista
         ORDER BY total_streams DESC;`,
        [idUsuario]
    );

    const generosPromise = database.executar(
        `SELECT 
            a.ds_genero_musical AS genero,
            COALESCE(SUM(m.qt_stream), 0) AS total_streams
         FROM Artista a
         LEFT JOIN Musica m ON m.fk_artista = a.id_artista
         WHERE a.fk_usuario = ?
         GROUP BY a.ds_genero_musical
         ORDER BY total_streams DESC;`,
        [idUsuario]
    );

    const artistasBrasilPromise = database.executar(
        `SELECT 
            a.nm_artista AS nome,
            COALESCE(SUM(m.qt_stream), 0) AS total_streams
         FROM Artista a
         LEFT JOIN Musica m 
            ON m.fk_artista = a.id_artista AND m.nm_pais = 'Brasil'
         WHERE a.fk_usuario = ?
         GROUP BY a.id_artista
         ORDER BY total_streams DESC;`,
        [idUsuario]
    );

    const [ouvintesBrasil, artistas, generos, artistasBrasil] = await Promise.all([
        ouvintesBrasilPromise,
        artistasPromise,
        generosPromise,
        artistasBrasilPromise
    ]);

    const resumoGeneros = generos || [];
    const resumoArtistas = artistas || [];
    const resumoArtistasBrasil = artistasBrasil || [];

    return {
        ouvintesBrasil: Number(ouvintesBrasil?.[0]?.ouvintesBrasil || 0),
        artistaMaisOuvido: resumoArtistas?.[0]?.nome || null,
        generoMaisOuvido: resumoGeneros?.[0]?.genero || null,
        generoMenosOuvido: resumoGeneros.length ? resumoGeneros[resumoGeneros.length - 1].genero : null,
        seuArtistaMaisOuvido: resumoArtistasBrasil?.[0]?.nome || null,
        seuArtistaMenosOuvido: resumoArtistasBrasil.length ? resumoArtistasBrasil[resumoArtistasBrasil.length - 1].nome : null,
        artistasMomento: resumoArtistas.slice(0, 6).map((artista) => ({
            nome: artista.nome,
            ouvintes: Number(artista.total_streams) || 0
        })),
        topGeneros: resumoGeneros.slice(0, 5).map((genero) => ({
            genero: genero.genero,
            audicoes: Number(genero.total_streams) || 0
        }))
    };
}

module.exports = {
    buscarDadosDashboard
};
