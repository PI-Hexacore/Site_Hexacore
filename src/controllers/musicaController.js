const musicaModel = require("../models/musicaModel");
const { getAuthenticatedUserId } = require("../utils/userContext");

async function listarPorPais(req, res) {
    const idUsuario = getAuthenticatedUserId(req);
    const paisFiltro = (req.query.pais || "").trim();

    if (!idUsuario) {
        return res.status(401).json({
            success: false,
            message: "Usuário não autenticado."
        });
    }

    if (!paisFiltro) {
        return res.status(400).json({
            success: false,
            message: "O parâmetro 'pais' é obrigatório."
        });
    }

    try {
        const musicas = await musicaModel.buscarPorPais(idUsuario, paisFiltro);

        return res.json({
            success: true,
            data: musicas
        });
    } catch (erro) {
        console.error("Erro ao buscar músicas:", erro);
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar músicas."
        });
    }
}

module.exports = {
    listarPorPais
};
