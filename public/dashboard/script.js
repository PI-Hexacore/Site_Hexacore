
const azulPrimario = '#3A86FF';
const azulSecundario = '#00C4FF';
const corTexto = '#E0E0E0';    
const corTextoSec = '#B0B0B0'; 
const corBorda = '#333333';    

const ctx = document.getElementById('topGenerosChart');


const gradGeneros = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
gradGeneros.addColorStop(0, azulSecundario); 
gradGeneros.addColorStop(1, azulPrimario);   

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Pop', 'Rock', 'Sertanejo', 'Funk', 'Trap'],
    datasets: [{
      label: 'Audições (em milhões)',
      data: [12, 9, 7, 5, 4],
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

const ctxArtistas = document.getElementById('artistasMomentoChart').getContext('2d');

// gradiente
const gradArtistas = ctxArtistas.createLinearGradient(0, 0, 0, 400);
gradArtistas.addColorStop(0, azulSecundario); 
gradArtistas.addColorStop(1, azulPrimario);   

const artistasMomentoChart = new Chart(ctxArtistas, {
  type: 'bar',
  data: {
    labels: ['The Weeknd', 'Taylor Swift', 'Travis Scott', 'Bad Bunny', 'Drake', 'Billie Eilish'],
    datasets: [{
      label: 'Ouvintes (milhões)',
      data: [98, 95, 90, 87, 83, 78],
      backgroundColor: gradArtistas, 
      borderColor: azulSecundario, 
      borderRadius: 6,
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

