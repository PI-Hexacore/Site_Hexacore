document.addEventListener("DOMContentLoaded", () => {
  carregarPaises();
  carregarGeneros();
  carregarFiltrosUsuario();
});

async function criarFiltro() {
  const nomeFiltro = document.getElementById("nomeFiltro").value.trim();
  const tipoAlbum = document.getElementById("tipoAlbum").value;

  const paises = Array.from(document.querySelectorAll(".secao-filtro:nth-of-type(2) input:checked"))
    .map(input => input.value);

  const generos = Array.from(document.querySelectorAll(".secao-filtro:nth-of-type(3) input:checked"))
    .map(input => input.value);

  const idUsuario = sessionStorage.getItem("ID_USUARIO");

  const payload = { nomeFiltro, tipoAlbum, paises, generos, idUsuario };

  try {
    if (window.filtroEditando) {
      // Edição
      payload.idFiltro = window.filtroEditando;

      const response = await fetch("/filtros/editarFiltro", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        alert("Filtro atualizado com sucesso!");
        window.filtroEditando = null;
        document.getElementById("btnCriarFiltro").textContent = "Criar Filtro";
        carregarFiltrosUsuario();
      } else {
        alert("Erro ao editar filtro: " + result.message);
      }
    } else {
      // Criação
      const response = await fetch("/filtros/criarFiltro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        alert("Filtro criado com sucesso!");
        carregarFiltrosUsuario();
      } else {
        alert("Erro ao criar filtro: " + result.message);
      }
    }
  } catch (erro) {
    console.error("Erro ao salvar filtro:", erro);
    alert("Erro inesperado.");
  }
}

async function removerFiltro(idFiltro) {
  const idUsuario = sessionStorage.ID_USUARIO;

  try {
    const resposta = await fetch("/filtros/deletarFiltro", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idFiltro, idUsuario })
    });

    const result = await resposta.json();

    if (result.success) {
      alert("Filtro removido com sucesso!");
      carregarFiltrosUsuario(); // recarrega lista de filtros
    } else {
      alert("Erro ao remover filtro: " + result.message);
    }
  } catch (erro) {
    console.error("Erro ao remover filtro:", erro);
    alert("Erro inesperado ao remover filtro.");
  }
}

async function aplicarFiltro(idFiltro) {
  const idUsuario = sessionStorage.ID_USUARIO;
  if (!idUsuario) {
    return;
  }

  try {
    const resposta = await fetch(`/api/dashboard?idFiltro=${idFiltro}`, {
      headers: {
        'x-user-id': idUsuario
      }
    });

    if (!resposta.ok) {
      throw new Error('Falha ao aplicar filtro na dashboard');
    }

    const payload = await resposta.json();
    const dados = payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload;

    preencherKpis(dados);
    atualizarGraficoArtistas(dados?.artistasMomento || []);
    atualizarGraficoGeneros(dados?.topGeneros || []);
  } catch (erro) {
    console.error('Erro ao aplicar filtro:', erro);
    preencherKpis();
    atualizarGraficoArtistas([]);
    atualizarGraficoGeneros([]);
  }
}

async function editarFiltro(idFiltro) {
  const idUsuario = sessionStorage.getItem("ID_USUARIO");

  try {
    const response = await fetch(`/filtros/listarFiltrosUsuario?idUsuario=${idUsuario}`);
    const result = await response.json();

    if (!result.success) {
      alert("Erro ao carregar filtro.");
      return;
    }

    const filtro = result.data.find(f => f.id_filtro == idFiltro);
    if (!filtro) {
      alert("Filtro não encontrado.");
      return;
    }

    // Preenche campos
    document.getElementById("nomeFiltro").value = filtro.nm_filtro;
    document.getElementById("tipoAlbum").value = filtro.tp_album;

    // Marca países
    document.querySelectorAll(".secao-filtro:nth-of-type(2) input").forEach(input => {
      input.checked = filtro.paises?.includes(input.value);
    });

    // Marca gêneros
    document.querySelectorAll(".secao-filtro:nth-of-type(3) input").forEach(input => {
      input.checked = filtro.generos?.includes(input.value);
    });

    // Salva id do filtro em variável global
    window.filtroEditando = idFiltro;

    // Muda texto do botão
    document.getElementById("btnCriarFiltro").textContent = "Salvar Alterações";
  } catch (erro) {
    console.error("Erro ao carregar filtro:", erro);
  }
}
async function carregarFiltrosUsuario() {
  const idUsuario = sessionStorage.getItem("ID_USUARIO");

  try {
    const response = await fetch(`/filtros/listarFiltrosUsuario?idUsuario=${idUsuario}`);
    const result = await response.json();

    const lista = document.getElementById("listaFiltrosUsuario");
    lista.innerHTML = ""; // limpa

    if (!result.success) {
      console.error("Erro ao buscar filtros:", result.message);
      return;
    }

    const filtros = result.data;

    if (filtros.length === 0) {
      lista.innerHTML = "<p>Nenhum filtro criado ainda.</p>";
      return;
    }

    filtros.forEach(filtro => {
      const div = document.createElement("div");
      div.classList.add("item-filtro");

      div.innerHTML = `
        <span>${filtro.nm_filtro} (${filtro.tp_album})</span>
        <button onclick="aplicarFiltro('${filtro.id_filtro}')">✔️</button>
        <button onclick="removerFiltro('${filtro.id_filtro}')">🗑️</button>
        <button onclick="editarFiltro('${filtro.id_filtro}')">✏️</button>
      `;

      lista.appendChild(div);
    });
  } catch (erro) {
    console.error("Erro ao carregar filtros do usuário:", erro);
  }
}

async function carregarGeneros() {
  try {
    // Faz o fetch para sua rota backend
    const response = await fetch("/filtros/buscarGeneros");
    const result = await response.json();

    if (!result.success) {
      console.error("Erro ao buscar gêneros:", result.message);
      return;
    }

    const generos = result.data; // array vindo do backend
    // Seleciona a seção de gêneros no modal (a terceira secao-filtro)
    const secaoGeneros = document.querySelector(".secao-filtro:nth-of-type(3)");

    if (!secaoGeneros) {
      console.error("Seção de gêneros não encontrada no DOM.");
      return;
    }

    // Limpa opções existentes
    secaoGeneros.innerHTML = "<h3>Gêneros</h3>";

    // Cria dinamicamente os checkboxes
    generos.forEach((genero) => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = genero.ds_genero_musical || genero.genero || genero.nm_genero;
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(" " + checkbox.value));
      secaoGeneros.appendChild(label);
      secaoGeneros.appendChild(document.createElement("br"));
    });
  } catch (erro) {
    console.error("Erro no fetch de gêneros:", erro);
  }
}

async function carregarPaises() {
  try {
    // Faz o fetch para sua rota backend
    const response = await fetch("/filtros/buscarPaises");
    const result = await response.json();

    if (!result.success) {
      console.error("Erro ao buscar países:", result.message);
      return;
    }

    const paises = result.data; // array vindo do backend
    const secaoPaises = document.querySelector(".secao-filtro h3 + label")?.parentNode;

    // Limpa opções existentes
    secaoPaises.innerHTML = "<h3>Países</h3>";

    // Cria dinamicamente os checkboxes
    paises.forEach((pais) => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = pais.nm_pais;
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(" " + pais.nm_pais));
      secaoPaises.appendChild(label);
      secaoPaises.appendChild(document.createElement("br"));
    });
  } catch (erro) {
    console.error("Erro no fetch de países:", erro);
  }
}