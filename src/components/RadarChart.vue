<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  values: Array,
})

const chartCanvas = ref(null)
let chartInstance = null

function getMaxScale(values) {
  if (!values || values.length === 0) return 100

  const maxValue = Math.max(...values)

  return Math.ceil(maxValue * 1.2)
}

function createChart() {
  const maxScale = getMaxScale(props.values)

  chartInstance = new Chart(chartCanvas.value, {
    type: 'radar',

    data: {
      labels: ['R1', 'G1', 'B1', 'R2', 'G2', 'B2'],

      datasets: [
        {
          data: props.values,

          fill: true,

          backgroundColor: 'rgba(54,162,235,0.2)',
          borderColor: 'rgb(54,162,235)',

          pointBackgroundColor: 'rgb(54,162,235)',
        },
      ],
    },

    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false, // <-- отключаем легенду
        },
      },
      scales: {
        r: {
          min: 0,
          max: maxScale,
        },
      },
    },
  })
}

onMounted(() => {
  createChart()
})

watch(
  () => props.values,
  (newValues) => {
    if (!chartInstance) return

    const maxScale = getMaxScale(newValues)

    chartInstance.data.datasets[0].data = newValues
    chartInstance.options.scales.r.max = maxScale

    chartInstance.update()
  },
)
</script>

<style scoped>
.chart-container {
  width: 420px;
  margin: auto;
}

@media (max-width: 450px) {
  .chart-container {
    width: auto;
    margin: 10px 0px;
  }
}
</style>
