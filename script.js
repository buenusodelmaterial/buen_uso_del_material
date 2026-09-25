// Datos observados de los 10 sujetos
const sujetosData = [
  { sujeto: "Sujeto 1", x: 15 },
  { sujeto: "Sujeto 2", x: 14 },
  { sujeto: "Sujeto 3", x: 26 },
  { sujeto: "Sujeto 4", x: 25 },
  { sujeto: "Sujeto 5", x: 18 },
  { sujeto: "Sujeto 6", x: 22 },
  { sujeto: "Sujeto 7", x: 12 },
  { sujeto: "Sujeto 8", x: 14 },
  { sujeto: "Sujeto 9", x: 20 },
  { sujeto: "Sujeto 10", x: 18 }
];

// Caudal estimado (mL por segundo)
const CAUDAL = 100;

let chartInstance = null;

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  renderTable();
  initChart();
  updateSimulation();
});

// Calcula Y basado en la fórmula Y = 100 * X
function calculateY(x) {
  return x * CAUDAL;
}

// Renderizar la tabla con los 10 pares reales
function renderTable() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  sujetosData.forEach((item) => {
    const y = calculateY(item.x);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.sujeto}</td>
      <td>${item.x} s</td>
      <td>${y} mL</td>
    `;
    tableBody.appendChild(row);
  });
}

// Establecer un valor de escenario predefinido
function setScenario(seconds) {
  document.getElementById("timeInput").value = seconds;
  updateSimulation();
}

// Actualizar valores de cálculo e interfaz
function updateSimulation() {
  const timeInput = document.getElementById("timeInput");
  const xVal = parseFloat(timeInput.value) || 0;
  const yVal = calculateY(xVal);

  // Actualizar indicadores
  document.getElementById("volumeResult").textContent = `${yVal} mL`;
  document.getElementById("litersResult").textContent = `${(yVal / 1000).toFixed(2)} L`;
  document.getElementById("bottlesResult").textContent = `${(yVal / 500).toFixed(1)} botellas`;

  // Actualizar punto en el gráfico
  updateChartHighlight(xVal, yVal);
}

// Inicializar Gráfico con Chart.js
function initChart() {
  const ctx = document.getElementById("scatterChart").getContext("2d");

  // Puntos de los sujetos
  const scatterData = sujetosData.map((item) => ({
    x: item.x,
    y: calculateY(item.x)
  }));

  // Puntos para dibujar la línea de tendencia (0s a 30s)
  const lineData = [
    { x: 0, y: 0 },
    { x: 30, y: calculateY(30) }
  ];

  chartInstance = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Punto Seleccionado (X, Y)",
          data: [{ x: 18, y: calculateY(18) }],
          backgroundColor: "#ef4444",
          pointRadius: 8,
          pointHoverRadius: 10,
          order: 1
        },
        {
          label: "Datos Observados (Sujetos)",
          data: scatterData,
          backgroundColor: "#0284c7",
          pointRadius: 5,
          order: 2
        },
        {
          label: "Modelo Lineal (Y = 100X)",
          data: lineData,
          type: "line",
          borderColor: "#93c5fd",
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          order: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { display: true, text: "Tiempo X (segundos)" },
          min: 0,
          max: 30
        },
        y: {
          title: { display: true, text: "Volumen Y (mL)" },
          min: 0,
          max: 3000
        }
      }
    }
  });
}

// Actualizar el punto destacado en la gráfica
function updateChartHighlight(x, y) {
  if (chartInstance) {
    chartInstance.data.datasets[0].data = [{ x: x, y: y }];
    chartInstance.update();
  }
}