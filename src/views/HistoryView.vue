<template>
  <div class="page">
    <h1>История анализов</h1>

    <div v-for="analysis in analyses" :key="analysis._id" class="analysis-card">
      <h3>{{ analysis.substance }}</h3>

      <p>
        Дата:
        {{ formatDate(analysis.createdAt) }}
      </p>

      <p>
        Площадь:
        {{ analysis.area.toFixed(2) }}
      </p>

      <p>
        Периметр:
        {{ analysis.perimeter.toFixed(2) }}
      </p>

      <p>
        Концентрация (S):
        {{ analysis.concentrationArea?.toFixed(3) }}
        г/л
      </p>

      <p>
        Концентрация (P):
        {{ analysis.concentrationPerimeter?.toFixed(3) }}
        г/л
      </p>

      <button @click="deleteAnalysis(analysis._id)">Удалить</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import axios from 'axios'

const analyses = ref([])

async function loadAnalyses() {
  try {
    const response = await axios.get('http://localhost:3000/analyses')

    analyses.value = response.data
  } catch (error) {
    console.log(error)
  }
}

async function deleteAnalysis(id) {
  try {
    await axios.delete(`http://localhost:3000/analyses/${id}`)

    analyses.value = analyses.value.filter((analysis) => analysis._id !== id)
  } catch (error) {
    console.log(error)
  }
}

function formatDate(date) {
  return new Date(date).toLocaleString()
}

onMounted(() => {
  loadAnalyses()
})
</script>

<style scoped>
.analysis-card {
  border: 1px solid #ccc;

  padding: 20px;

  margin-bottom: 20px;

  border-radius: 10px;
}

button {
  margin-top: 10px;
}
</style>
