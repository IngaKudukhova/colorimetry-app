<template>
  <div class="page">
    <div v-if="!analysisDone">
      <h1>Новый анализ</h1>

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
        <ImageUploader title="Реакция 1" @rgbCalculated="setRGB1" />

        <ImageUploader title="Реакция 2" @rgbCalculated="setRGB2" />

        <div v-if="rgb1 && rgb2" class="rgb-block">
          <h2>RGB параметры</h2>
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

          <RouterLink to="/new-analysis" class="reset-btn"> Сбросить </RouterLink>

          <p v-if="errorMessage" class="error">
            {{ errorMessage }}
          </p>
        </div>
      </div>
      <button type="button" @click="runAnalysis">Определить вещество</button>
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
.page {
  background-color: white;
  padding: 20px 40px;
  margin: 20px;
  border-radius: 30px;
}

h1 {
  font-size: 30px;
  margin-bottom: 20px;
}

.form-text::placeholder {
  color: rgb(89, 89, 89);
}

button {
  width: max-content;
  padding: 6px 15px;
  font-size: 17px;
  margin-top: 10px;
  background-color: rgb(121, 212, 194);
  color: white;
  border-radius: 30px;
  border: 1px solid rgb(8, 163, 173);
}
button:hover {
  transform: scale(1.1);
  display: inline-block;
}

.reset-btn {
  display: inline-block;
  width: fit-content;
  text-decoration: none;
  border: 1px solid black;
  color: black;
  background-color: rgb(233, 233, 233);
  padding: 2px 8px;
  font-size: 15px;
  margin-top: 100px;
}
.image-uploder {
  display: flex;
  flex-direction: row;
  gap: 40px;
  margin: 30px 0;
  font-size: 17px;
}
.rgb-block {
  margin: 20px 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: auto;
  border: 1px solid rgb(222, 221, 221);
}
.note {
  padding-bottom: 30px;
  padding-top: 10px;
}
.rgb-box {
  display: flex;
  gap: 80px;
}
.rgb-param {
  display: flex;
  p {
    padding-bottom: 10px;
  }
}
.color-preview {
  border-radius: 50%;
  margin-bottom: 30px;
  margin-left: 30px;
}
.btn-save {
  margin-right: 10px;
  margin-top: 5px;
}
</style>
