const artistaModel = require("../models/artistaModel");
const { getAuthenticatedUserId } = require("../utils/userContext");

function normalizarId(value) {
    if (value === undefined || value === null || value === "") {
        return null;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
}

async function listar(req, res) {
    const idUsuario = getAuthenticatedUserId(req);

    if (!idUsuario) {
        return res.status(401).json({
            success: false,
            message: "Usuário não autenticado."
        });
    }

    try {
        const artistas = await artistaModel.listarPorUsuario(idUsuario);
        return res.json({
            success: true,
            data: artistas
        });
    } catch (erro) {
        console.error("Erro ao listar artistas:", erro);
        return res.status(500).json({
            success: false,
            message: "Erro ao listar artistas."
        });
    }
}

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
    const generoNormalizado = (genero || "").trim() || null;
    const spotifyTopId = normalizarId(fkSpotifyTop);
    const spotifyYoutubeId = normalizarId(fkSpotifyYoutube);

    if (!nomeNormalizado) {
        return res.status(400).json({
            success: false,
            message: "O campo nm_artista é obrigatório."
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
            genero: generoNormalizado,
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

async function atualizar(req, res) {
    const idUsuario = getAuthenticatedUserId(req);
    const idArtista = normalizarId(req.params.id);

    if (!idUsuario) {
        return res.status(401).json({ success: false, message: "Usuário não autenticado." });
    }

    if (!idArtista) {
        return res.status(400).json({ success: false, message: "ID do artista inválido." });
    }

    const {
        nm_artista: nomeArtista,
        ds_genero_musical: genero,
        fk_dados_spotify_top: fkSpotifyTop,
        fk_dados_spotify_youtube: fkSpotifyYoutube
    } = req.body;

    const nomeNormalizado = (nomeArtista || "").trim();
    const generoNormalizado = (genero || "").trim() || null;
    const spotifyTopId = normalizarId(fkSpotifyTop);
    const spotifyYoutubeId = normalizarId(fkSpotifyYoutube);

    if (!nomeNormalizado) {
        return res.status(400).json({ success: false, message: "O campo nm_artista é obrigatório." });
    }

    try {
        const artistaExistente = await artistaModel.buscarPorId(idUsuario, idArtista);

        if (!artistaExistente) {
            return res.status(404).json({ success: false, message: "Artista não encontrado." });
        }

        await artistaModel.atualizar({
            idArtista,
            idUsuario,
            nome: nomeNormalizado,
            genero: generoNormalizado,
            fkSpotifyTop: spotifyTopId,
            fkSpotifyYoutube: spotifyYoutubeId
        });

        return res.json({ success: true, message: "Artista atualizado com sucesso." });
    } catch (erro) {
        console.error("Erro ao atualizar artista:", erro);
        return res.status(500).json({ success: false, message: "Erro ao atualizar artista." });
    }
}

async function excluir(req, res) {
    const idUsuario = getAuthenticatedUserId(req);
    const idArtista = normalizarId(req.params.id);

    if (!idUsuario) {
        return res.status(401).json({ success: false, message: "Usuário não autenticado." });
    }

    if (!idArtista) {
        return res.status(400).json({ success: false, message: "ID do artista inválido." });
    }

    try {
        const artistaExistente = await artistaModel.buscarPorId(idUsuario, idArtista);

        if (!artistaExistente) {
            return res.status(404).json({ success: false, message: "Artista não encontrado." });
        }

        await artistaModel.excluir(idUsuario, idArtista);

        return res.json({ success: true, message: "Artista removido com sucesso." });
    } catch (erro) {
        console.error("Erro ao excluir artista:", erro);
        return res.status(500).json({ success: false, message: "Erro ao excluir artista." });
    }
}

module.exports = {
    listar,
    cadastrar,
    atualizar,
    excluir
};
