function normalizeId(value) {
    if (value === undefined || value === null || value === "") {
        return null;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
}

function getAuthenticatedUserId(req) {
    if (!req) {
        return null;
    }

    const candidateIds = [
        req.user && (req.user.id_usuario || req.user.idUsuario || req.user.id),
        req.auth && (req.auth.id_usuario || req.auth.idUsuario || req.auth.id),
        req.session && (req.session.id_usuario || req.session.idUsuario),
        req.headers && (req.headers["x-user-id"] || req.headers["x-usuario-id"]),
        req.params && (req.params.idUsuario || req.params.id_usuario || req.params.usuarioId),
        req.query && (req.query.idUsuario || req.query.id_usuario),
        req.body && (req.body.idUsuario || req.body.id_usuario)
    ];

    for (const value of candidateIds) {
        const parsed = normalizeId(value);
        if (parsed !== null) {
            return parsed;
        }
    }

    return null;
}

module.exports = {
    getAuthenticatedUserId
};
