<template>
  <div class="page">
    <h1>Управление веществами</h1>

    <div class="form-block">
      <h2>Добавить вещество</h2>

      <input v-model="form.name" placeholder="Название вещества" />

      <h3>Формула площади</h3>

      <p class="equation-hint">
        {{ getEquationHint(form.areaEquation.type) }}
      </p>

      <select v-model="form.areaEquation.type">
        <option value="linear">Линейное</option>

        <option value="power">Степенное</option>

        <option value="polynomial">Полиномиальное</option>

        <option value="exponential">Экспоненциальное</option>
      </select>

      <input v-model.number="form.areaEquation.a" placeholder="Коэффициент a" type="number" />

      <input v-model.number="form.areaEquation.b" placeholder="Коэффициент b" type="number" />

      <input
        v-if="form.areaEquation.type === 'polynomial'"
        v-model.number="form.areaEquation.c"
        placeholder="Коэффициент c"
        type="number"
      />

      <input v-model.number="form.areaEquation.r2" placeholder="R²" type="number" step="0.0001" />

      <h3>Формула периметра</h3>

      <p class="equation-hint">
        {{ getEquationHint(form.perimeterEquation.type) }}
      </p>

      <select v-model="form.perimeterEquation.type">
        <option value="linear">Линейное</option>

        <option value="power">Степенное</option>

        <option value="polynomial">Полиномиальное</option>

        <option value="exponential">Экспоненциальное</option>
      </select>

      <input v-model.number="form.perimeterEquation.a" placeholder="Коэффициент a" type="number" />

      <input v-model.number="form.perimeterEquation.b" placeholder="Коэффициент b" type="number" />

      <input
        v-if="form.perimeterEquation.type === 'polynomial'"
        v-model.number="form.perimeterEquation.c"
        placeholder="Коэффициент c"
        type="number"
      />

      <input
        v-model.number="form.perimeterEquation.r2"
        placeholder="R²"
        type="number"
        step="0.0001"
      />

      <button @click="createSubstance">Сохранить</button>

      <p v-if="successMessage">
        {{ successMessage }}
      </p>

      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>
    </div>
    <hr />

    <h2>Список веществ</h2>

    <input v-model="search" placeholder="Поиск вещества" />

    <table class="substances-table">
      <thead>
        <tr>
          <th>Название</th>

          <th>Уравнение площади</th>

          <th>Уравнение периметра</th>

          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="substance in filteredSubstances" :key="substance._id">
          <td>
            {{ substance.name }}
          </td>

          <td class="equation-cell">
            {{ formatEquation(substance.areaEquation) }}
          </td>

          <td class="equation-cell">
            {{ formatEquation(substance.perimeterEquation) }}
          </td>

          <td>
            <button @click="deleteSubstance(substance._id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'

import api from '../services/api'

function getEquationHint(type) {
  switch (type) {
    case 'linear':
      return 'y = ax + b'

    case 'power':
      return 'y = a*x^b'

    case 'polynomial':
      return 'y = ax² + bx + c'

    case 'exponential':
      return 'y = a*e^(bx)'

    default:
      return ''
  }
}

function formatEquation(equation) {
  switch (equation.type) {
    case 'linear':
      return `y = ${equation.a}x + ${equation.b} | R² = ${equation.r2})`

    case 'power':
      return `y = ${equation.a}x${toSuperscript(equation.b)} | R² = ${equation.r2}`

    case 'polynomial':
      return `y = ${equation.a}x² + ${equation.b}x + ${equation.c} | R² = ${equation.r2}`

    case 'exponential':
      return `y = ${equation.a}e${toSuperscript(`${equation.b}x`)} | R² = ${equation.r2}`

    default:
      return ''
  }
}

function toSuperscript(value) {
  const map = {
    0: '⁰',
    1: '¹',
    2: '²',
    3: '³',
    4: '⁴',
    5: '⁵',
    6: '⁶',
    7: '⁷',
    8: '⁸',
    9: '⁹',
    x: 'ˣ',

    '-': '⁻',

    '.': '·',
  }

  return value
    .toString()
    .split('')
    .map((char) => map[char] || char)
    .join('')
}

const substances = ref([])

const search = ref('')

async function loadSubstances() {
  try {
    const response = await api.get('http://localhost:3000/substances')

    substances.value = response.data
  } catch (error) {
    console.log(error)
  }
}

const filteredSubstances = computed(() => {
  return substances.value.filter((substance) =>
    substance.name.toLowerCase().includes(search.value.toLowerCase()),
  )
})

async function deleteSubstance(id) {
  try {
    await api.delete(`http://localhost:3000/substances/${id}`)

    loadSubstances()
  } catch (error) {
    console.log(error)
  }
}

const successMessage = ref('')

const errorMessage = ref('')

const form = reactive({
  name: '',

  areaEquation: {
    type: 'linear',

    a: null,

    b: null,

    c: null,

    r2: null,
  },

  perimeterEquation: {
    type: 'linear',

    a: null,

    b: null,

    c: null,

    r2: null,
  },
})

async function createSubstance() {
  try {
    errorMessage.value = ''

    await api.post(
      'http://localhost:3000/substances',

      form,
    )

    successMessage.value = 'Вещество успешно добавлено'

    resetForm()
  } catch (error) {
    console.log(error)

    errorMessage.value = 'Ошибка при добавлении вещества'
  }
  loadSubstances()
}

function resetForm() {
  form.name = ''

  form.areaEquation = {
    type: 'linear',

    a: null,

    b: null,

    c: null,

    r2: null,
  }

  form.perimeterEquation = {
    type: 'linear',

    a: null,

    b: null,

    c: null,

    r2: null,
  }
}

onMounted(() => {
  loadSubstances()
})
</script>

<style scoped>
.page {
  padding: 20px;
  margin-left: 10px;
}

.form-block {
  display: flex;

  flex-direction: column;

  gap: 10px;

  max-width: 400px;
}

input,
select {
  padding: 10px;
}

button {
  padding: 10px;
}

.error {
  color: red;
}
.equation-hint {
  font-style: italic;

  color: #666;

  margin-bottom: 10px;
}
.substances-table {
  width: 100%;
  background-color: white;
  border-collapse: collapse;

  margin-top: 20px;
}

.substances-table th,
.substances-table td {
  border: 1px solid #ccc;

  padding: 10px;

  text-align: left;
}

hr {
  margin: 40px 0;
}
.equation-cell {
  white-space: pre-line;

  max-width: 300px;
}

h1 {
  margin-top: -10px;
  margin-bottom: 5px;
  font-size: 35px;
}
h2 {
  font-size: 23px;
}
</style>
