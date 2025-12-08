const database = require("../database/db");

async function buscarPaises() {
    return database.executar(
        `SELECT DISTINCT nm_pais 
         FROM MusicaClient 
         WHERE nm_pais IS NOT NULL 
         ORDER BY nm_pais;`
    );
}

async function buscarGeneros() {
    return database.executar(
        `SELECT DISTINCT ds_genero_musical
           FROM ArtistaClient
          WHERE ds_genero_musical IS NOT NULL
       ORDER BY ds_genero_musical;`
    );
}

async function criarFiltroDashboard(nomeFiltro, tipoAlbum, idUsuario) {
  return database.executar(
    `INSERT INTO FiltroDashboard (nm_filtro, tp_album, fk_id_usuario)
     VALUES (?, ?, ?);`,
    [nomeFiltro, tipoAlbum, idUsuario]
  );
}

async function adicionarPaisesAoFiltro(idFiltro, listaPaises) {
  const inserts = listaPaises.map(pais =>
    database.executar(
      `INSERT INTO FiltroPais (fk_filtro, nm_pais) VALUES (?, ?);`,
      [idFiltro, pais]
    )
  );
  return Promise.all(inserts);
}

async function adicionarGenerosAoFiltro(idFiltro, listaGeneros) {
  const inserts = listaGeneros.map(genero =>
    database.executar(
      `INSERT INTO FiltroGenero (fk_filtro, ds_genero) VALUES (?, ?);`,
      [idFiltro, genero]
    )
  );
  return Promise.all(inserts);
}
async function buscarFiltrosUsuario(idUsuario) {
  return database.executar(
    `SELECT 
        fd.id_filtro,
        fd.nm_filtro,
        fd.tp_album,
        GROUP_CONCAT(DISTINCT fp.nm_pais ORDER BY fp.nm_pais SEPARATOR ', ') AS paises,
        GROUP_CONCAT(DISTINCT fg.ds_genero ORDER BY fg.ds_genero SEPARATOR ', ') AS generos
     FROM FiltroDashboard fd
     LEFT JOIN FiltroPais fp ON fd.id_filtro = fp.fk_filtro
     LEFT JOIN FiltroGenero fg ON fd.id_filtro = fg.fk_filtro
     WHERE fd.fk_id_usuario = ?
     GROUP BY fd.id_filtro, fd.nm_filtro, fd.tp_album
     ORDER BY fd.id_filtro DESC;`,
    [idUsuario]
  );
}
async function deletarFiltro(idFiltro, idUsuario) {
  await database.executar(`DELETE FROM FiltroPais WHERE fk_filtro = ?;`, [idFiltro]);
  await database.executar(`DELETE FROM FiltroGenero WHERE fk_filtro = ?;`, [idFiltro]);
  return database.executar(
    `DELETE FROM FiltroDashboard 
     WHERE id_filtro = ? AND fk_id_usuario = ?;`,
    [idFiltro, idUsuario]
  );
}
async function editarFiltroDashboard(idFiltro, nomeFiltro, tipoAlbum, idUsuario) {
  return database.executar(
    `UPDATE FiltroDashboard
     SET nm_filtro = ?, tp_album = ?
     WHERE id_filtro = ? AND fk_id_usuario = ?;`,
    [nomeFiltro, tipoAlbum, idFiltro, idUsuario]
  );
}

async function atualizarPaisesDoFiltro(idFiltro, listaPaises) {
  // Remove os países antigos
  await database.executar(`DELETE FROM FiltroPais WHERE fk_filtro = ?;`, [idFiltro]);

  // Insere os novos
  const inserts = listaPaises.map(pais =>
    database.executar(
      `INSERT INTO FiltroPais (fk_filtro, nm_pais) VALUES (?, ?);`,
      [idFiltro, pais]
    )
  );
  return Promise.all(inserts);
}

async function atualizarGenerosDoFiltro(idFiltro, listaGeneros) {
  // Remove os gêneros antigos
  await database.executar(`DELETE FROM FiltroGenero WHERE fk_filtro = ?;`, [idFiltro]);

  // Insere os novos
  const inserts = listaGeneros.map(genero =>
    database.executar(
      `INSERT INTO FiltroGenero (fk_filtro, ds_genero) VALUES (?, ?);`,
      [idFiltro, genero]
    )
  );
  return Promise.all(inserts);
}

module.exports = {
  buscarPaises,
  buscarGeneros,
  criarFiltroDashboard,
  adicionarPaisesAoFiltro,
  adicionarGenerosAoFiltro,
  buscarFiltrosUsuario,
  deletarFiltro,
  editarFiltroDashboard,
  atualizarPaisesDoFiltro,
  atualizarGenerosDoFiltro
};
