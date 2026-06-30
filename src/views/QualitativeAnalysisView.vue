<template>
  <div class="page">
    <!-- ЭКРАН 1 -->

    <div v-if="!analysisDone">
      <h1 class="h1">Качественный анализ</h1>

      <div class="form-block">
        <label>Выберите группу веществ</label>

        <select v-model="selectedGroup">
          <option disabled value="">Выберите группу</option>

          <option value="amino">Аминокислоты</option>

          <option value="phenols">Фенолы</option>
        </select>
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
                  :style="{
                    background: `rgb(${rgb1.r},${rgb1.g},${rgb1.b})`,
                  }"
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
                  :style="{
                    background: `rgb(${rgb2.r},${rgb2.g},${rgb2.b})`,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>

      <button type="button" @click="runPrediction">Провести анализ</button>
    </div>

    <!-- ЭКРАН 2 -->

    <div v-else>
      <h2 class="h1">Результаты анализа</h2>
      <div class="radar-charts">
        <div class="radar-chart-box">
          <h3 class="h3">Профиль образца</h3>

          <RadarChart :values="chartValues" />
        </div>
        <div class="radar-chart-box">
          <h3 class="h3">Модельный профиль</h3>

          <RadarChart :values="modelChartValues" />
        </div>
      </div>

      <p class="result">
        Определенное вещество:
        <strong>
          {{ prediction }}
        </strong>
      </p>

      <p>
        Степень уверенности:
        <strong> {{ confidencePercent }}% </strong>
      </p>

      <button @click="resetAnalysis">Новый анализ</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from '../api/axios'
import ImageUploader from '../components/ImageUploader.vue'
import RadarChart from '../components/RadarChart.vue'

const selectedGroup = ref('')
const rgb1 = ref(null)
const rgb2 = ref(null)
const prediction = ref('')
const confidence = ref(null)
const modelProfile = ref(null)
const errorMessage = ref('')
const analysisDone = ref(false)

function setRGB1(data) {
  rgb1.value = data
}

function setRGB2(data) {
  rgb2.value = data
}

const chartValues = computed(() => {
  if (!rgb1.value || !rgb2.value) {
    return []
  }

  return [rgb1.value.r, rgb1.value.g, rgb1.value.b, rgb2.value.r, rgb2.value.g, rgb2.value.b]
})

const modelChartValues = computed(() => {
  if (!modelProfile.value) {
    return []
  }

  return [
    modelProfile.value.r1,
    modelProfile.value.g1,
    modelProfile.value.b1,

    modelProfile.value.r2,
    modelProfile.value.g2,
    modelProfile.value.b2,
  ]
})

const confidencePercent = computed(() => {
  if (!confidence.value) {
    return 0
  }

  return Math.round(confidence.value * 100)
})

async function runPrediction() {
  if (!selectedGroup.value) {
    errorMessage.value = 'Пожалуйста, выберите группу веществ'

    return
  }

  if (!rgb1.value || !rgb2.value) {
    errorMessage.value = 'Пожалуйста, загрузите оба изображения'

    return
  }

  errorMessage.value = ''

  try {
    const response = await api.post(
      '/ml/predict',

      {
        group: selectedGroup.value,

        r1: rgb1.value.r,
        g1: rgb1.value.g,
        b1: rgb1.value.b,

        r2: rgb2.value.r,
        g2: rgb2.value.g,
        b2: rgb2.value.b,
      },
    )

    prediction.value = response.data.substance

    confidence.value = response.data.confidence

    modelProfile.value = response.data.modelProfile

    analysisDone.value = true
  } catch (error) {
    console.log(error)
  }
}

function resetAnalysis() {
  selectedGroup.value = ''

  rgb1.value = null

  rgb2.value = null

  prediction.value = ''

  confidence.value = null

  modelProfile.value = null

  errorMessage.value = ''

  analysisDone.value = false
}
</script>

<style scoped>
.note {
  margin-bottom: 30px;
}
.radar-charts {
  display: flex;
  justify-content: space-around;
}
.radar-chart-box {
  display: flex;
  flex-direction: column;
}
h2 {
  font-size: 25px;
  text-align: center;
  padding-bottom: 20px;
}
h3 {
  font-size: 20px;
  text-align: center;
}
.chart-container {
  width: 380px;
}
.result {
  padding-top: 10px;
}
.image-uploder {
  margin-top: 15px;
}
.form-block {
  label {
    margin-bottom: 5px;
  }
  select {
    padding: 6px;
    border: 1px solid rgb(194, 192, 192);
    color: rgb(53, 53, 53);
    font-size: 16px;
  }
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
    font-size: 18px;
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
  .radar-charts {
    flex-direction: column;
  }
  .chart-container {
    width: auto;
    margin: 10px 0px;
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
}
</style>
