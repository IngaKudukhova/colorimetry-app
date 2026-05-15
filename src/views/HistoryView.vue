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

      <button
        v-if="currentUser && currentUser.role === 'admin'"
        @click="deleteAnalysis(analysis._id)"
      >
        Удалить
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import api from '../services/api'

const analyses = ref([])
const currentUser = JSON.parse(localStorage.getItem('user') || 'null')

async function loadAnalyses() {
  try {
    const response = await api.get('http://localhost:3000/analyses')

    analyses.value = response.data
  } catch (error) {
    console.log(error)
  }
}

async function deleteAnalysis(id) {
  try {
    await api.delete(`http://localhost:3000/analyses/${id}`)

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
