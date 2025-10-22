const ctx = document.getElementById('topGenerosChart');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Pop', 'Rock', 'Sertanejo', 'Funk', 'Trap'],
    datasets: [{
      label: 'Audições (em milhões)',
      data: [12, 9, 7, 5, 4],
      borderWidth: 1,
      backgroundColor: '#05c8f8',
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
        ticks: { color: 'white' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      x: {
        ticks: { color: 'white' },
        grid: { display: false }
      }
    }
  }
});
  const ctxArtistas = document.getElementById('artistasMomentoChart').getContext('2d');

  const artistasMomentoChart = new Chart(ctxArtistas, {
    type: 'bar',
    data: {
      labels: ['The Weeknd', 'Taylor Swift', 'Travis Scott', 'Bad Bunny', 'Drake', 'Billie Eilish'],
      datasets: [{
        label: 'Ouvintes (milhões)',
        data: [98, 95, 90, 87, 83, 78],
        backgroundColor: [
          '#1db954',
          '#1aa34a',
          '#178f40',
          '#147b36',
          '#10682d',
          '#0d5524'
        ],
        borderRadius: 6,
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Artistas do Momento (Top 6)',
          color: '#fff',
          font: { size: 18 }
        }
      },
      scales: {
        x: {
          ticks: { color: '#ccc' },
          grid: { color: '#222' }
        },
        y: {
          ticks: { color: '#ccc' },
          grid: { color: '#222' }
        }
      }
    }
  });