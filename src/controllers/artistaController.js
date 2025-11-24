const artistaModel = require("../models/artistaModel");
const { getAuthenticatedUserId } = require("../utils/userContext");

async function cadastrar(req, res) {
    const idUsuario = getAuthenticatedUserId(req);

    if (!idUsuario) {
        return res.status(401).json({
            success: false,
            message: "Usuário não autenticado."
        });
    }

    const {
        nm_artista: nomeArtista,
        ds_genero_musical: genero,
        fk_dados_spotify_top: fkSpotifyTop,
        fk_dados_spotify_youtube: fkSpotifyYoutube
    } = req.body;

    const nomeNormalizado = (nomeArtista || "").trim();
    const spotifyTopId = Number.parseInt(fkSpotifyTop, 10);
    const spotifyYoutubeId = Number.parseInt(fkSpotifyYoutube, 10);

    if (!nomeNormalizado || Number.isNaN(spotifyTopId) || Number.isNaN(spotifyYoutubeId)) {
        return res.status(400).json({
            success: false,
            message: "nm_artista, fk_dados_spotify_top e fk_dados_spotify_youtube são obrigatórios."
        });
    }

    try {
        const artistaExistente = await artistaModel.buscarPorNome(idUsuario, nomeNormalizado);

        if (artistaExistente) {
            return res.status(409).json({
                success: false,
                message: "Este artista já está cadastrado."
            });
        }

        const novoArtistaId = await artistaModel.cadastrar({
            nome: nomeNormalizado,
            genero,
            fkUsuario: idUsuario,
            fkSpotifyTop: spotifyTopId,
            fkSpotifyYoutube: spotifyYoutubeId
        });

        return res.status(201).json({
            success: true,
            message: "Artista cadastrado com sucesso.",
            data: {
                id_artista: novoArtistaId
            }
        });
    } catch (erro) {
        console.error("Erro ao cadastrar artista:", erro);
        return res.status(500).json({
            success: false,
            message: "Erro ao cadastrar artista."
        });
    }
}

module.exports = {
    cadastrar
};
