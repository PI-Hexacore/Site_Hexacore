const database = require("../database/db");

const SEM_DADOS_LABEL = "sem dados";

async function buscarDadosDashboard(idUsuario, idFiltro = null) {
    let paisesFiltro = [];
    let generosFiltro = [];

    // Busca países e gêneros do filtro, se houver
    if (idFiltro) {
        try {
            const paises = await database.executar(
                `SELECT nm_pais FROM FiltroPais WHERE fk_filtro = ?;`,
                [idFiltro]
            );
            const generos = await database.executar(
                `SELECT ds_genero FROM FiltroGenero WHERE fk_filtro = ?;`,
                [idFiltro]
            );

            paisesFiltro = (paises || []).map(p => p.nm_pais).filter(p => p);
            generosFiltro = (generos || []).map(g => g.ds_genero).filter(g => g);
        } catch (erro) {
            console.error("Erro ao buscar países/gêneros do filtro:", erro);
            paisesFiltro = [];
            generosFiltro = [];
        }
    }

    // Helpers para montar cláusulas seguras
    const wherePais = (alias = "m") =>
        paisesFiltro.length
            ? `AND ${alias}.nm_pais IN (${paisesFiltro.map(() => "?").join(",")})`
            : ""; // ✅ sem filtro = global

    const whereGenero = (alias = "a") =>
        generosFiltro.length
            ? `AND ${alias}.ds_genero_musical IN (${generosFiltro.map(() => "?").join(",")})`
            : ""; // ✅ sem filtro = global

    // Ouvintes (agora global por padrão)
    const ouvintesPromise = database.executar(
        `SELECT COALESCE(SUM(m.qt_stream), 0) AS ouvintes
         FROM MusicaClient m
         WHERE 1=1
         ${wherePais("m")}`,
        paisesFiltro.length ? paisesFiltro : []
    );

    // Artistas globais
    const artistasGlobaisPromise = database.executar(
        `SELECT 
            a.id_artista AS idArtista,
            a.nm_artista AS nome,
            COALESCE(SUM(m.qt_stream), 0) AS total_streams
         FROM ArtistaClient a
    LEFT JOIN MusicaClient m ON m.fk_artista = a.id_artista
    WHERE 1=1
    ${wherePais("m")}
    ${whereGenero("a")}
     GROUP BY a.id_artista
     ORDER BY total_streams DESC;`,
        [...(paisesFiltro || []), ...(generosFiltro || [])]
    );

    // Gêneros globais
    const generosGlobaisPromise = database.executar(
        `SELECT 
            a.ds_genero_musical AS genero,
            COALESCE(SUM(m.qt_stream), 0) AS total_streams
         FROM ArtistaClient a
    LEFT JOIN MusicaClient m ON m.fk_artista = a.id_artista
    WHERE 1=1
    ${wherePais("m")}
    ${whereGenero("a")}
     GROUP BY a.ds_genero_musical
     ORDER BY total_streams DESC;`,
        [...(paisesFiltro || []), ...(generosFiltro || [])]
    );

    // Artistas do usuário
    const artistasUsuarioPromise = database.executar(
        `SELECT 
            ag.nm_artista AS nome,
            COALESCE(SUM(m.qt_stream), 0) AS total_streams
         FROM ArtistaGravadora ag
         LEFT JOIN ArtistaClient ac
                ON UPPER(ac.nm_artista) = UPPER(ag.nm_artista)
         LEFT JOIN MusicaClient m
                ON m.fk_artista = ac.id_artista
        WHERE ag.fk_id_usuario = ?
        ${wherePais("m")}
        GROUP BY ag.id_artista, ag.nm_artista
        ORDER BY total_streams DESC;`,
        [idUsuario, ...(paisesFiltro || [])]
    );

    const [ouvintes, artistasGlobais, generosGlobais, artistasUsuario] = await Promise.all([
        ouvintesPromise,
        artistasGlobaisPromise,
        generosGlobaisPromise,
        artistasUsuarioPromise
    ]);

    const resumoGenerosGlobais = generosGlobais || [];
    const resumoArtistasGlobais = artistasGlobais || [];
    const resumoArtistasUsuario = artistasUsuario || [];

    const artistasUsuarioComStreams = resumoArtistasUsuario.filter((artista) => Number(artista.total_streams) > 0);
    const resumoOuvintes = ouvintes?.[0]?.ouvintes;
    const ouvintesNumero = Number(resumoOuvintes);

    // Labels dinâmicos
    const ouvintesLabel = paisesFiltro.length === 1
        ? `N° de ouvintes de ${paisesFiltro[0] || "desconhecido"}`
        : paisesFiltro.length > 1
            ? "N° de ouvintes dos países selecionados"
            : "N° de ouvintes globais"; // ✅ alterado

    const artistaLabel = paisesFiltro.length
        ? "Artista mais ouvido nos países selecionados"
        : "Artista mais ouvido globalmente"; // ✅ alterado

    const generoLabelMais = generosFiltro.length
        ? "Gênero mais ouvido nos gêneros selecionados"
        : "Gênero mais ouvido globalmente"; // ✅ alterado

    const generoLabelMenos = generosFiltro.length
        ? "Gênero menos ouvido nos gêneros selecionados"
        : "Gênero menos ouvido globalmente"; // ✅ alterado

    return {
        // Valores
        ouvintesValor: Number.isFinite(ouvintesNumero) ? ouvintesNumero : null,
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

        // Labels dinâmicos
        ouvintesLabel,
        artistaLabel,
        generoLabelMais,
        generoLabelMenos,
        seuArtistaLabelMais: "Seu artista mais ouvido",
        seuArtistaLabelMenos: "Seu artista menos ouvido",

        // Gráficos
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
