const ctx = document.getElementById("genreChart").getContext("2d");

let genreChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Pop", "Sertanejo", "Funk", "Rap", "Forró"],
    datasets: [
      {
        label: "Milhões de reproduções",
        data: [50, 45, 38, 30, 22],
        backgroundColor: [
          "#2563eb",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
        ],
        borderRadius: 8,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

const dadosPorRegiao = {
  brasil: {
    ouvintes: "125M ouvintes",
    artista: "Anitta",
    generoMais: "Pop",
    generoMenos: "Jazz",
    chart: [50, 45, 38, 30, 22],
  },
  sudeste: {
    ouvintes: "60M ouvintes",
    artista: "Luan Santana",
    generoMais: "Sertanejo",
    generoMenos: "Forró",
    chart: [40, 60, 30, 25, 15],
  },
  nordeste: {
    ouvintes: "30M ouvintes",
    artista: "Wesley Safadão",
    generoMais: "Forró",
    generoMenos: "Rock",
    chart: [25, 30, 20, 15, 40],
  },
  sul: {
    ouvintes: "20M ouvintes",
    artista: "Melim",
    generoMais: "Pop",
    generoMenos: "Funk",
    chart: [45, 25, 15, 20, 18],
  },
  norte: {
    ouvintes: "10M ouvintes",
    artista: "Gusttavo Lima",
    generoMais: "Sertanejo",
    generoMenos: "Rock",
    chart: [15, 40, 10, 8, 5],
  },
  "centro-oeste": {
    ouvintes: "5M ouvintes",
    artista: "Marília Mendonça",
    generoMais: "Sertanejo",
    generoMenos: "Pop",
    chart: [20, 55, 15, 10, 12],
  },
};

document.getElementById("regionSelect").addEventListener("change", (e) => {
  const regiao = e.target.value;
  const dados = dadosPorRegiao[regiao];
  const map = document.querySelector(".map-placeholder");

  document.getElementById("ouvintes").textContent = dados.ouvintes;
  document.getElementById("artista").textContent = `Artista: ${dados.artista}`;
  document.getElementById("generoMais").textContent = `Mais ouvido: ${dados.generoMais}`;
  document.getElementById("generoMenos").textContent = `Menos ouvido: ${dados.generoMenos}`;
  map.textContent = `🗺️ ${regiao.charAt(0).toUpperCase() + regiao.slice(1)}`;

  genreChart.data.datasets[0].data = dados.chart;
  genreChart.update();
});
