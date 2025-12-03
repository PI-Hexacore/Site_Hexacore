const dashboardModel = require("../models/dashboardModel");
const { getAuthenticatedUserId } = require("../utils/userContext");

async function obterDashboard(req, res) {
    const idUsuario = getAuthenticatedUserId(req);
    const { idFiltro } = req.query;

    if (!idUsuario) {
        return res.status(401).json({
            success: false,
            message: "Usuário não autenticado."
        });
    }

    try {
        const dadosDashboard = await dashboardModel.buscarDadosDashboard(idUsuario, idFiltro);
        return res.json(dadosDashboard);
    } catch (erro) {
        console.error("Erro ao carregar a dashboard:", erro);
        return res.status(500).json({
            success: false,
            message: "Erro ao carregar a dashboard."
        });
    }

}

module.exports = {
    obterDashboard
};
