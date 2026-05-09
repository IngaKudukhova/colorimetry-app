<template>
  <div class="page">
    <div v-if="!analysisDone">
      <h1>Новый анализ</h1>

      <div class="form-block">
        <label>Выберите вещество</label>

        <v-select
          :options="substances"
          label="name"
          v-model="selectedSubstance"
          placeholder="Начните вводить название..."
        />
      </div>

      <ImageUploader title="Реакция 1" @rgbCalculated="setRGB1" />

      <ImageUploader title="Реакция 2" @rgbCalculated="setRGB2" />

      <div v-if="rgb1 && rgb2">
        <h2>RGB параметры</h2>

        <p>R1: {{ rgb1.r }}</p>
        <p>G1: {{ rgb1.g }}</p>
        <p>B1: {{ rgb1.b }}</p>
        <div
          class="color-preview"
          :style="{ background: `rgb(${rgb1.r},${rgb1.g},${rgb1.b})` }"
        ></div>

        <p>R2: {{ rgb2.r }}</p>
        <p>G2: {{ rgb2.g }}</p>
        <p>B2: {{ rgb2.b }}</p>
        <div
          class="color-preview"
          :style="{ background: `rgb(${rgb2.r},${rgb2.g},${rgb2.b})` }"
        ></div>
      </div>
      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>

      <button type="button" @click="runAnalysis">Провести анализ</button>
    </div>

    <!-- ЭКРАН 2 -->
    <div v-else>
      <h2>Результаты анализа</h2>

      <RadarChart :values="chartValues" />

      <p>Площадь: {{ area.toFixed(2) }}</p>
      <p>Периметр: {{ perimeter.toFixed(2) }}</p>

      <p>
        Концентрация (по площади):
        {{ concentrationArea?.toFixed(3) }} г/л
      </p>

      <p>
        Концентрация (по периметру):
        {{ concentrationPerimeter?.toFixed(3) }} г/л
      </p>

      <button @click="saveAnalysis">Сохранить результат</button>

      <button @click="resetAnalysis">Новый анализ</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import axios from 'axios'

import ImageUploader from '../components/ImageUploader.vue'
import RadarChart from '../components/RadarChart.vue'

const substances = ref([])

const selectedSubstance = ref(null)

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/substances')

    substances.value = response.data
  } catch (error) {
    console.log(error)
  }
})

const rgb1 = ref(null)
const rgb2 = ref(null)

function setRGB1(data) {
  rgb1.value = data
}

function setRGB2(data) {
  rgb2.value = data
}

const chartValues = computed(() => {
  if (!rgb1.value || !rgb2.value) return []

  return [rgb1.value.r, rgb1.value.g, rgb1.value.b, rgb2.value.r, rgb2.value.g, rgb2.value.b]
})

const errorMessage = ref('')

function runAnalysis() {
  if (!selectedSubstance.value) {
    errorMessage.value = 'Пожалуйста, выберите вещество'
    return
  }

  errorMessage.value = ''

  calculateResults()

  analysisDone.value = true
}

function calculateArea(values) {
  const sin60 = Math.sin(Math.PI / 3)

  let sum = 0

  for (let i = 0; i < values.length; i++) {
    const current = values[i]
    const next = values[(i + 1) % values.length]

    sum += current * next
  }

  return 0.5 * sin60 * sum
}

function calculatePerimeter(values) {
  let sum = 0

  for (let i = 0; i < values.length; i++) {
    const r1 = values[i]
    const r2 = values[(i + 1) % values.length]

    const angle = Math.PI / 3

    const side = Math.sqrt(r1 * r1 + r2 * r2 - 2 * r1 * r2 * Math.cos(angle))

    sum += side
  }

  return sum
}

function calculateConcentration(S, P, substance) {
  let c_area = null
  let c_perimeter = null

  switch (substance.name) {
    case 'Парацетамол':
      c_area = (12847 - S) / 12590
      c_perimeter = (580.1 - P) / 377.5

      break

    case 'Инсулин':
      c_area = (7580.7 - S) / 1976.5
      c_perimeter = (492.49 - P) / 90.033

      break

    case 'Глицин':
      c_area = Math.pow(S / 11999, 1 / 0.3281)
      c_perimeter = Math.pow(P / 425.92, 1 / -0.147)

      break

    case 'Резорцин':
      c_area = solveQuadratic(S, -204890, 92330, 26197)
      c_perimeter = solveQuadratic(P, -2716.2, 1356.7, 654.09)

      break

    case 'Инфезол':
      c_area = -Math.log(S / 53393) / 1.294
      c_perimeter = -Math.log(P / 885.11) / 0.558

      break
  }

  return { c_area, c_perimeter }
}

function solveQuadratic(y, a, b, c) {
  const D = b * b - 4 * a * (c - y)

  if (D < 0) return null

  const x1 = (-b + Math.sqrt(D)) / (2 * a)
  const x2 = (-b - Math.sqrt(D)) / (2 * a)

  return Math.max(x1, x2)
}

const area = ref(null)
const perimeter = ref(null)
const concentrationArea = ref(null)
const concentrationPerimeter = ref(null)

function calculateResults() {
  const values = chartValues.value

  area.value = calculateArea(values)
  perimeter.value = calculatePerimeter(values)

  const result = calculateConcentration(area.value, perimeter.value, selectedSubstance.value)

  concentrationArea.value = result.c_area
  concentrationPerimeter.value = result.c_perimeter
}

const analysisDone = ref(false)

function resetAnalysis() {
  analysisDone.value = false

  rgb1.value = null
  rgb2.value = null

  area.value = null
  perimeter.value = null

  concentrationArea.value = null
  concentrationPerimeter.value = null

  selectedSubstance.value = null
}

async function saveAnalysis() {
  try {
    const analysisData = {
      substance: selectedSubstance.value.name,

      rgb1: rgb1.value,

      rgb2: rgb2.value,

      area: area.value,

      perimeter: perimeter.value,

      concentrationArea: concentrationArea.value,

      concentrationPerimeter: concentrationPerimeter.value,
    }

    const response = await axios.post('http://localhost:3000/analyses', analysisData)

    alert('Анализ сохранён')

    console.log(response.data)
  } catch (error) {
    console.log(error)

    alert('Ошибка сохранения')
  }
}
</script>
