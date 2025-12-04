
const database = require("../database/db");

async function obterPorUsuario(idUsuario) {
  const rows = await database.executar(
    `SELECT id_slack_ativo,
            notificacoes_desativadas,
            receber_pais,
            receber_musica,
            receber_artista
       FROM SlackAtivo
      WHERE fk_usuario = ?;`,
    [idUsuario]
  );
  return rows[0] || null;
}

async function inicializarSeNecessario(idUsuario) {
  const existente = await obterPorUsuario(idUsuario);
  if (!existente) {
    await database.executar(
      `INSERT INTO SlackAtivo (
         notificacoes_desativadas,
         receber_pais,
         receber_musica,
         receber_artista,
         fk_usuario
       ) VALUES (0, 1, 1, 1, ?);`,
      [idUsuario]
    );
  }
  return obterPorUsuario(idUsuario);
}

async function atualizarConfig(idUsuario, { notificacoes_desativadas, receber_pais, receber_musica, receber_artista }) {
  return database.executar(
    `UPDATE SlackAtivo
        SET notificacoes_desativadas = ?,
            receber_pais = ?,
            receber_musica = ?,
            receber_artista = ?
      WHERE fk_usuario = ?;`,
    [
      Number(notificacoes_desativadas) || 0,
      Number(receber_pais) || 0,
      Number(receber_musica) || 0,
      Number(receber_artista) || 0,
      idUsuario
    ]
  );
}

module.exports = {
  obterPorUsuario,
  inicializarSeNecessario,
  atualizarConfig
};