const database = require("../database/db");

const SEM_DADOS_LABEL = "sem dados";

async function buscarDadosDashboard(idUsuario) {
    const ouvintesBrasilPromise = database.executar(
        `SELECT COALESCE(SUM(m.qt_stream), 0) AS ouvintesBrasil
           FROM Musica m
          WHERE UPPER(TRIM(m.nm_pais)) IN ('BRASIL', 'BRAZIL');`
    );

    const artistasGlobaisPromise = database.executar(
        `SELECT 
            a.id_artista AS idArtista,
            a.nm_artista AS nome,
            COALESCE(SUM(m.qt_stream), 0) AS total_streams
         FROM Artista a
    LEFT JOIN Musica m ON m.fk_artista = a.id_artista
     GROUP BY a.id_artista
     ORDER BY total_streams DESC;`
    );

    const generosGlobaisPromise = database.executar(
        `SELECT 
            a.ds_genero_musical AS genero,
            COALESCE(SUM(m.qt_stream), 0) AS total_streams
         FROM Artista a
    LEFT JOIN Musica m ON m.fk_artista = a.id_artista
     GROUP BY a.ds_genero_musical
     ORDER BY total_streams DESC;`
    );

    const artistasBrasilUsuarioPromise = database.executar(
        `SELECT 
            a.nm_artista AS nome,
            COALESCE(SUM(m.qt_stream), 0) AS total_streams
         FROM Artista a
    LEFT JOIN Musica m 
           ON m.fk_artista = a.id_artista 
          AND m.nm_pais = 'Brasil'
        WHERE a.fk_usuario = ?
     GROUP BY a.id_artista
     ORDER BY total_streams DESC;`,
        [idUsuario]
    );

    const [ouvintesBrasil, artistasGlobais, generosGlobais, artistasBrasilUsuario] = await Promise.all([
        ouvintesBrasilPromise,
        artistasGlobaisPromise,
        generosGlobaisPromise,
        artistasBrasilUsuarioPromise
    ]);

    const resumoGenerosGlobais = generosGlobais || [];
    const resumoArtistasGlobais = artistasGlobais || [];
    const resumoArtistasUsuario = artistasBrasilUsuario || [];

    const artistasUsuarioComStreams = resumoArtistasUsuario.filter((artista) => Number(artista.total_streams) > 0);
    const resumoOuvintesBrasil = ouvintesBrasil?.[0]?.ouvintesBrasil;
    const ouvintesBrasilNumero = Number(resumoOuvintesBrasil);

    return {
        ouvintesBrasil: Number.isFinite(ouvintesBrasilNumero) ? ouvintesBrasilNumero : null,
        artistaMaisOuvido: resumoArtistasGlobais?.[0]?.nome || null,
        generoMaisOuvido: resumoGenerosGlobais?.[0]?.genero || null,
        generoMenosOuvido: resumoGenerosGlobais.length
            ? resumoGenerosGlobais[resumoGenerosGlobais.length - 1].genero
            : null,
        seuArtistaMaisOuvido: artistasUsuarioComStreams.length
            ? artistasUsuarioComStreams[0].nome
            : SEM_DADOS_LABEL,
        seuArtistaMenosOuvido: artistasUsuarioComStreams.length
            ? artistasUsuarioComStreams[artistasUsuarioComStreams.length - 1].nome
            : SEM_DADOS_LABEL,
        artistasMomento: resumoArtistasGlobais.slice(0, 6).map((artista) => ({
            nome: artista.nome,
            ouvintes: Number(artista.total_streams) || 0
        })),
        topGeneros: resumoGenerosGlobais.slice(0, 5).map((genero) => ({
            genero: genero.genero,
            audicoes: Number(genero.total_streams) || 0
        }))
    };
}

module.exports = {
    buscarDadosDashboard
};
