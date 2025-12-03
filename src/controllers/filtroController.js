const filtroModel = require("../models/filtroModel");
// você tinha importado { listar } do artistaController, mas não está sendo usado aqui
// pode remover se não precisar

// Listar países
async function listarPaises(req, res) {
    try {
        const paises = await filtroModel.buscarPaises();

        return res.json({
            success: true,
            data: paises
        });
    } catch (erro) {
        console.error("Erro ao buscar países:", erro);
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar países."
        });
    }
}

// Listar gêneros
async function listarGeneros(req, res) {
    try {
        const generos = await filtroModel.buscarGeneros();

        return res.json({
            success: true,
            data: generos
        });
    } catch (erro) {
        console.error("Erro ao buscar gêneros:", erro);
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar gêneros."
        });
    }
}

// Criar filtro
async function criar(req, res) {
    const { nomeFiltro, tipoAlbum, paises, generos, idUsuario } = req.body;

    if (!idUsuario || !nomeFiltro || !tipoAlbum) {
        return res.status(400).json({
            success: false,
            message: "Dados obrigatórios ausentes."
        });
    }

    try {
        // cria o filtro principal
        const resultado = await filtroModel.criarFiltroDashboard(nomeFiltro, tipoAlbum, idUsuario);
        const idFiltro = resultado.insertId;

        // adiciona países
        if (Array.isArray(paises) && paises.length > 0) {
            await filtroModel.adicionarPaisesAoFiltro(idFiltro, paises);
        }

        // adiciona gêneros
        if (Array.isArray(generos) && generos.length > 0) {
            await filtroModel.adicionarGenerosAoFiltro(idFiltro, generos);
        }

        return res.json({
            success: true,
            message: "Filtro criado com sucesso.",
            idFiltro
        });
    } catch (erro) {
        console.error("Erro ao criar filtro:", erro);
        return res.status(500).json({
            success: false,
            message: "Erro ao criar filtro."
        });
    }
}

async function listarFiltrosUsuario(req, res) {
    const { idUsuario } = req.query; // ou req.body, dependendo de como você envia

    if (!idUsuario) {
        return res.status(400).json({
            success: false,
            message: "O parâmetro 'idUsuario' é obrigatório."
        });
    }

    try {
        const filtros = await filtroModel.buscarFiltrosUsuario(idUsuario);

        if (!filtros || filtros.length === 0) {
            return res.json({
                success: true,
                data: [] // retorna lista vazia
            });
        }

        return res.json({
            success: true,
            data: filtros
        });
    } catch (erro) {
        console.error("Erro ao buscar filtros do usuário:", erro);
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar filtros do usuário."
        });
    }
}

async function deletar(req, res) {
  const { idFiltro, idUsuario } = req.body;

  if (!idFiltro || !idUsuario) {
    return res.status(400).json({
      success: false,
      message: "Parâmetros obrigatórios ausentes."
    });
  }

  try {
    const resultado = await filtroModel.deletarFiltro(idFiltro, idUsuario);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Filtro não encontrado ou não pertence ao usuário."
      });
    }

    return res.json({
      success: true,
      message: "Filtro deletado com sucesso."
    });
  } catch (erro) {
    console.error("Erro ao deletar filtro:", erro);
    return res.status(500).json({
      success: false,
      message: "Erro ao deletar filtro."
    });
  }
}

async function editar(req, res) {
  const { idFiltro, nomeFiltro, tipoAlbum, paises, generos, idUsuario } = req.body;

  if (!idFiltro || !idUsuario || !nomeFiltro || !tipoAlbum) {
    return res.status(400).json({
      success: false,
      message: "Parâmetros obrigatórios ausentes."
    });
  }

  try {
    const resultado = await filtroModel.editarFiltroDashboard(idFiltro, nomeFiltro, tipoAlbum, idUsuario);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Filtro não encontrado ou não pertence ao usuário."
      });
    }

    if (Array.isArray(paises)) {
      await filtroModel.atualizarPaisesDoFiltro(idFiltro, paises);
    }

    if (Array.isArray(generos)) {
      await filtroModel.atualizarGenerosDoFiltro(idFiltro, generos);
    }

    return res.json({
      success: true,
      message: "Filtro atualizado com sucesso."
    });
  } catch (erro) {
    console.error("Erro ao editar filtro:", erro);
    return res.status(500).json({
      success: false,
      message: "Erro ao editar filtro."
    });
  }
}

module.exports = {
    listarPaises,
    listarGeneros,
    criar,
    listarFiltrosUsuario,
    deletar,
    editar
};
