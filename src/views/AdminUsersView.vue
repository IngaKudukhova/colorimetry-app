<template>
  <div class="page">
    <h1>Управление пользователями</h1>

    <!-- ФОРМА -->

    <div class="form-block">
      <h2>Создать пользователя</h2>

      <input v-model="form.username" placeholder="Логин" />

      <input v-model="form.password" type="password" placeholder="Пароль" />

      <select v-model="form.role">
        <option value="lab_assistant">Лаборант</option>

        <option value="admin">Администратор</option>
      </select>

      <button @click="createUser">Создать</button>

      <p v-if="successMessage">
        {{ successMessage }}
      </p>

      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>
    </div>

    <hr />

    <!-- ТАБЛИЦА -->

    <h2>Пользователи</h2>

    <table class="users-table">
      <thead>
        <tr>
          <th>Логин</th>

          <th>Роль</th>

          <th>Изменить роль</th>

          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>
            {{ user.username }}
          </td>

          <td>
            {{ user.role }}
          </td>

          <td>
            <select :value="user.role" @change="updateRole(user._id, $event.target.value)">
              <option value="lab_assistant">Лаборант</option>

              <option value="admin">Администратор</option>
            </select>
          </td>

          <td>
            <button @click="removeUser(user._id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'

import api from '../services/api'

const users = ref([])

const successMessage = ref('')

const errorMessage = ref('')

const form = reactive({
  username: '',

  password: '',

  role: 'lab_assistant',
})

async function loadUsers() {
  try {
    const response = await api.get('http://localhost:3000/users')

    users.value = response.data
  } catch (error) {
    console.log(error)
  }
}

async function createUser() {
  try {
    errorMessage.value = ''

    await api.post(
      'http://localhost:3000/users',

      form,
    )

    successMessage.value = 'Пользователь создан'

    resetForm()

    loadUsers()
  } catch (error) {
    console.log(error)

    errorMessage.value = 'Ошибка создания пользователя'
  }
}

async function removeUser(id) {
  try {
    await api.delete(`http://localhost:3000/users/${id}`)

    loadUsers()
  } catch (error) {
    console.log(error)
  }
}

async function updateRole(id, role) {
  try {
    await api.put(
      `http://localhost:3000/users/${id}`,

      { role },
    )

    loadUsers()
  } catch (error) {
    console.log(error)
  }
}

function resetForm() {
  form.username = ''

  form.password = ''

  form.role = 'lab_assistant'
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.page {
  padding: 20px;
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

.users-table {
  width: 100%;

  border-collapse: collapse;

  margin-top: 20px;
}

.users-table th,
.users-table td {
  border: 1px solid #ccc;

  padding: 10px;

  text-align: left;
}

.error {
  color: red;
}

hr {
  margin: 40px 0;
}
</style>
