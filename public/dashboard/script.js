const azulPrimario = '#3A86FF';
const azulSecundario = '#00C4FF';
const corTexto = '#E0E0E0';
const corTextoSec = '#B0B0B0';
const corBorda = '#333333';

let graficoGeneros = null;
let graficoArtistas = null;

const numeroFormatter = new Intl.NumberFormat('pt-BR');

function formatarNumero(valor) {
  if (valor === null || valor === undefined) {
    return '--';
  }

  const numero = Number(valor);
  if (!Number.isFinite(numero)) {
    return '--';
  }

  return numeroFormatter.format(numero);
}

function formatarTexto(valor) {
  if (valor === null || valor === undefined || valor === '') {
    return '--';
  }

  return valor;
}

function inicializarGraficoGeneros() {
  const canvas = document.getElementById('topGenerosChart');
  if (!canvas) {
    return;
  }

  const gradGeneros = canvas.getContext('2d').createLinearGradient(0, 0, 0, 400);
  gradGeneros.addColorStop(0, azulSecundario);
  gradGeneros.addColorStop(1, azulPrimario);

  graficoGeneros = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Audições',
        data: [],
        borderWidth: 1,
        backgroundColor: gradGeneros,
        borderColor: azulSecundario,
        borderRadius: 8
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: corTextoSec },
          grid: { color: corBorda }
        },
        x: {
          ticks: { color: corTextoSec },
          grid: { display: false }
        }
      }
    }
  });
}

function inicializarGraficoArtistas() {
  const canvas = document.getElementById('artistasMomentoChart');
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext('2d');
  const gradArtistas = ctx.createLinearGradient(0, 0, 0, 400);
  gradArtistas.addColorStop(0, azulSecundario);
  gradArtistas.addColorStop(1, azulPrimario);

  graficoArtistas = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Ouvintes',
        data: [],
        backgroundColor: gradArtistas,
        borderColor: azulSecundario,
        borderRadius: 6
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Artistas do Momento (Top 6)',
          color: corTexto,
          font: { size: 18 }
        }
      },
      scales: {
        x: {
          ticks: { color: corTextoSec },
          grid: { color: corBorda }
        },
        y: {
          ticks: { color: corTextoSec },
          grid: { color: corBorda }
        }
      }
    }
  });
}

function atualizarGraficoGeneros(topGeneros = []) {
  if (!graficoGeneros) {
    return;
  }

  graficoGeneros.data.labels = topGeneros.map((item) => item.genero || 'Sem gênero');
  graficoGeneros.data.datasets[0].data = topGeneros.map((item) => Number(item.audicoes) || 0);
  graficoGeneros.update();
}

function atualizarGraficoArtistas(artistas = []) {
  if (!graficoArtistas) {
    return;
  }

  graficoArtistas.data.labels = artistas.map((item) => item.nome || 'Sem artista');
  graficoArtistas.data.datasets[0].data = artistas.map((item) => Number(item.ouvintes) || 0);
  graficoArtistas.update();
}

function preencherKpis(dados = {}) {
  const referencia = {
    totalOuvintesBrasil: formatarNumero(dados.ouvintesBrasil),
    artistaMaisOuvido: formatarTexto(dados.artistaMaisOuvido),
    generoMaisOuvido: formatarTexto(dados.generoMaisOuvido),
    generoMenosOuvido: formatarTexto(dados.generoMenosOuvido),
    artistaMaisOuvidoUsuario: formatarTexto(dados.seuArtistaMaisOuvido),
    artistaMenosOuvidoUsuario: formatarTexto(dados.seuArtistaMenosOuvido)
  };

  Object.entries(referencia).forEach(([id, valor]) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.textContent = valor;
    }
  });
}

async function carregarDashboard() {
  const idUsuario = sessionStorage.ID_USUARIO;
  if (!idUsuario) {
    return;
  }

  try {
    const resposta = await fetch('/api/dashboard', {
      headers: {
        'x-user-id': idUsuario
      }
    });

    if (!resposta.ok) {
      throw new Error('Falha ao buscar dados da dashboard');
    }

    const payload = await resposta.json();
    const dados = payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload;

    preencherKpis(dados);
    atualizarGraficoArtistas(dados?.artistasMomento || []);
    atualizarGraficoGeneros(dados?.topGeneros || []);
  } catch (erro) {
    console.error('Erro ao carregar a dashboard:', erro);
    preencherKpis();
    atualizarGraficoArtistas([]);
    atualizarGraficoGeneros([]);
  }
}

function atualizarNomeUsuario() {
  const boasVindas = document.getElementById('nomeUsuarioBoasVindas');
  if (boasVindas) {
    boasVindas.textContent = sessionStorage.NOME_USUARIO || '--';
  }
}

function iniciarDashboard() {
  if (typeof validarSessao === 'function' && !validarSessao()) {
    return;
  }

  atualizarNomeUsuario();
  inicializarGraficoGeneros();
  inicializarGraficoArtistas();
  carregarDashboard();
}

window.addEventListener('load', iniciarDashboard);
