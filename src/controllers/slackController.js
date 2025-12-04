const slackModel = require("../models/slackModel");
const { getAuthenticatedUserId } = require("../utils/userContext");

function ensureUser(res, idUsuario) {
  if (!idUsuario) {
    res.status(401).json({ success: false, message: "Usuário não autenticado." });
    return false;
  }
  return true;
}

async function obterConfigSlack(req, res) {
  const idUsuario = getAuthenticatedUserId(req) || req.headers["x-user-id"];
  if (!ensureUser(res, idUsuario)) return;

  try {
    const config = await slackModel.inicializarSeNecessario(idUsuario);
    res.json({
      success: true,
      data: {
        ativo: config.notificacoes_desativadas === 0,
        receber_pais: !!config.receber_pais,
        receber_musica: !!config.receber_musica,
        receber_artista: !!config.receber_artista
      }
    });
  } catch (erro) {
    console.error("Erro ao obter config Slack:", erro);
    res.status(500).json({ success: false, message: "Erro ao obter configurações." });
  }
}

async function inicializarSlackAtivo(req, res) {
  const idUsuario = getAuthenticatedUserId(req) || req.headers["x-user-id"];
  if (!ensureUser(res, idUsuario)) return;

  try {
    const config = await slackModel.inicializarSeNecessario(idUsuario);
    res.json({ success: true, data: config });
  } catch (erro) {
    console.error("Erro ao inicializar SlackAtivo:", erro);
    res.status(500).json({ success: false, message: "Erro ao inicializar." });
  }
}

async function configurarSlack(req, res) {
  const idUsuario = getAuthenticatedUserId(req) || req.headers["x-user-id"];
  if (!ensureUser(res, idUsuario)) return;

  const {
    notificacoes_desativadas, // 0 ou 1
    receber_pais,             // 0 ou 1
    receber_musica,           // 0 ou 1
    receber_artista           // 0 ou 1
  } = req.body || {};

  if ([notificacoes_desativadas, receber_pais, receber_musica, receber_artista].some(v => v === undefined)) {
    return res.status(400).json({ success: false, message: "Payload inválido." });
  }

  try {
    await slackModel.inicializarSeNecessario(idUsuario);
    await slackModel.atualizarConfig(idUsuario, {
      notificacoes_desativadas,
      receber_pais,
      receber_musica,
      receber_artista
    });

    const atual = await slackModel.obterPorUsuario(idUsuario);
    res.json({
      success: true,
      data: {
        ativo: atual.notificacoes_desativadas === 0,
        receber_pais: !!atual.receber_pais,
        receber_musica: !!atual.receber_musica,
        receber_artista: !!atual.receber_artista
      }
    });
  } catch (erro) {
    console.error("Erro ao configurar Slack:", erro);
    res.status(500).json({ success: false, message: "Erro ao configurar notificações." });
  }
}

module.exports = {
  obterConfigSlack,
  inicializarSlackAtivo,
  configurarSlack
};