<template>
  <div class="page">
    <h1 class="h1">История анализов</h1>

    <div v-for="analysis in analyses" :key="analysis._id" class="analysis-card">
      <h3 class="h3">{{ analysis.substance }}</h3>

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
h1 {
  margin-top: 2px;
  font-size: 20px;
}
h3 {
  margin-bottom: 5px;
  font-size: 20px;
}
p {
  font-size: 18px;
}

@media (max-width: 450px) {
  .page {
    padding: 20px;
    margin: 10px;
  }
  .analysis-card {
    margin: 12px 0;
    padding: 15px;
  }
  .h1 {
    font-size: 20px !important;
    margin-bottom: 0px;
    text-align: center;
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
}
</style>
