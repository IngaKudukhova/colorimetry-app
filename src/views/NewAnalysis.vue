<template>
  <div class="page">
    <div v-if="!analysisDone">
      <h1 class="h1">Количественный анализ</h1>

      <div class="form-block">
        <label>Выберите вещество</label>

        <v-select
          :options="substances"
          label="name"
          class="form-text"
          v-model="selectedSubstance"
          placeholder="Начните вводить название..."
        />
      </div>
      <div class="image-uploder">
        <ImageUploader title="Реакция 1" class="uploder-title" @rgbCalculated="setRGB1" />

        <ImageUploader title="Реакция 2" class="uploder-title" @rgbCalculated="setRGB2" />

        <div v-if="rgb1 && rgb2" class="rgb-block">
          <h2 class="h2">RGB параметры</h2>
          <p class="note">Убедитесь в правильности извлечения цветовых компонент</p>
          <div class="rgb-box">
            <div class="rgb-box-1">
              <div class="rgb-param">
                <div>
                  <p>R1: {{ rgb1.r }}</p>
                  <p>G1: {{ rgb1.g }}</p>
                  <p>B1: {{ rgb1.b }}</p>
                </div>
                <div
                  class="color-preview"
                  :style="{ background: `rgb(${rgb1.r},${rgb1.g},${rgb1.b})` }"
                ></div>
              </div>
            </div>

            <div class="rgb-box-2">
              <div class="rgb-param">
                <div>
                  <p>R2: {{ rgb2.r }}</p>
                  <p>G2: {{ rgb2.g }}</p>
                  <p>B2: {{ rgb2.b }}</p>
                </div>

                <div
                  class="color-preview"
                  :style="{ background: `rgb(${rgb2.r},${rgb2.g},${rgb2.b})` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>
      <button type="button" @click="runAnalysis">Определить концентрацию</button>
    </div>

    <!-- ЭКРАН 2 -->
    <div v-else>
      <h2 class="h2">Результаты анализа</h2>

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

      <button @click="saveAnalysis" class="btn-save">Сохранить результат</button>

      <button @click="resetAnalysis" class="btn-save">Новый анализ</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import api from '../services/api'

import ImageUploader from '../components/ImageUploader.vue'
import RadarChart from '../components/RadarChart.vue'

const substances = ref([])

const selectedSubstance = ref(null)

onMounted(async () => {
  try {
    const response = await api.get('http://localhost:3000/substances')

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

async function runAnalysis() {
  if (!selectedSubstance.value) {
    errorMessage.value = 'Пожалуйста, выберите вещество'
    return
  }

  errorMessage.value = ''

  await calculateResults()

  analysisDone.value = true
}

const area = ref(null)
const perimeter = ref(null)
const concentrationArea = ref(null)
const concentrationPerimeter = ref(null)

async function calculateResults() {
  try {
    const response = await api.post(
      'http://localhost:3000/analyses/calculate',

      {
        rgb1: rgb1.value,

        rgb2: rgb2.value,

        substance: selectedSubstance.value.name,
      },
    )

    area.value = response.data.area

    perimeter.value = response.data.perimeter

    concentrationArea.value = response.data.concentrationArea

    concentrationPerimeter.value = response.data.concentrationPerimeter
  } catch (error) {
    console.log(error)
  }
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

    const response = await api.post('http://localhost:3000/analyses', analysisData)

    alert('Анализ сохранён')

    console.log(response.data)
  } catch (error) {
    console.log(error)

    alert('Ошибка сохранения')
  }
}
</script>

<style scoped>
:deep(.vs__search::placeholder) {
  color: rgb(89, 89, 89);
  font-size: 16px;
}
@media (max-width: 450px) {
  .page {
    padding: 20px;
    margin: 10px;
  }

  .image-uploder {
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 18px;
  }

  .uploader {
    margin: 5px 0px;
    padding-top: 15px;
  }
  .form-block {
    label {
      margin-bottom: 10px;
    }
  }
  .h1 {
    font-size: 22px !important;
    margin-bottom: 15px;
    text-align: center;
  }

  .h2 {
    font-size: 18px !important;
  }

  .h3 {
    font-size: 18px !important;
  }

  p {
    font-size: 16px !important;
  }
  button {
    padding: 4px 10px;
    font-size: 16px;
  }
  .uploder-title {
    font-size: 16px;
  }

  .rgb-block {
    .h2 {
      padding-bottom: 0px;
      text-align: center;
    }
    align-items: center;
  }
  .note {
    text-align: center;
    margin-bottom: 10px;
  }

  .rgb-box {
    flex-direction: row;
    gap: 20px;
  }
  .rgb-param {
    gap: 8px;
  }
  .rgb-param {
    p {
      padding-bottom: 3px;
    }
  }

  .color-preview {
    margin: auto;
  }
  .btn-save {
    margin-top: 10px;
  }
}
</style>
