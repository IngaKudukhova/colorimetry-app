<template>
  <div class="page">
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

      <RadarChart :values="chartValues" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import ImageUploader from '../components/ImageUploader.vue'
import RadarChart from '../components/RadarChart.vue'

const substances = ref([
  { id: 1, name: 'Парацетамол' },
  { id: 2, name: 'Инсулин' },
  { id: 3, name: 'Глицин' },
  { id: 4, name: 'Резорцин' },
  { id: 5, name: 'Инфезол' },
])

const selectedSubstance = ref(null)

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
</script>
