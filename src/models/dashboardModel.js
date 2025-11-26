const database = require("../database/db");

const SEM_DADOS_LABEL = "sem dados";

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

    const possuiArtistas = resumoArtistas.length > 0;
    const possuiGeneros = resumoGeneros.length > 0;
    const artistasBrasilComStreams = resumoArtistasBrasil.filter((artista) => Number(artista.total_streams) > 0);
    const resumoOuvintesBrasil = ouvintesBrasil?.[0]?.ouvintesBrasil;
    const ouvintesBrasilNumero = possuiArtistas && resumoOuvintesBrasil !== undefined && resumoOuvintesBrasil !== null
        ? Number(resumoOuvintesBrasil)
        : null;

    return {
        ouvintesBrasil: Number.isFinite(ouvintesBrasilNumero) ? ouvintesBrasilNumero : null,
        artistaMaisOuvido: possuiArtistas ? resumoArtistas?.[0]?.nome || null : null,
        generoMaisOuvido: possuiGeneros ? resumoGeneros?.[0]?.genero || null : null,
        generoMenosOuvido: possuiGeneros ? resumoGeneros[resumoGeneros.length - 1].genero : null,
        seuArtistaMaisOuvido: artistasBrasilComStreams.length
            ? artistasBrasilComStreams[0].nome
            : SEM_DADOS_LABEL,
        seuArtistaMenosOuvido: artistasBrasilComStreams.length
            ? artistasBrasilComStreams[artistasBrasilComStreams.length - 1].nome
            : SEM_DADOS_LABEL,
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
