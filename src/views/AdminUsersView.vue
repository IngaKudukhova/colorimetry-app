<template>
  <div class="page">
    <h1 class="h1">Управление пользователями</h1>

    <!-- ФОРМА -->

    <div class="form-block">
      <h2 class="h2">Создать пользователя</h2>

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

      <p v-if="errorMessage2" class="error">
        {{ errorMessage2 }}
      </p>
    </div>

    <hr />

    <!-- ТАБЛИЦА -->

    <h2 class="h2">Пользователи</h2>

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

const errorMessage2 = ref('')

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
    errorMessage2.value = ''

    await api.delete(`/users/${id}`)

    loadUsers()
  } catch (error) {
    console.log(error)

    errorMessage2.value = error.response.data.message
  }
}

async function updateRole(id, role) {
  try {
    errorMessage2.value = ''

    await api.put(
      `/users/${id}`,

      { role },
    )

    loadUsers()
  } catch (error) {
    console.log(error)

    errorMessage2.value = error.response.data.message

    loadUsers()
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
h2 {
  font-size: 22px;
}
.form-block {
  display: flex;

  flex-direction: column;

  gap: 10px;

  max-width: 400px;
}

input,
select {
  padding: 5px 10px;
  background-color: white;
}

input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px white inset;
}

button {
  padding: 5px 10px;
}

.users-table {
  width: 100%;
  background-color: white;
  border-collapse: collapse;

  margin-top: 20px;
}

.users-table th,
.users-table td {
  border: 1px solid #ccc;

  padding: 10px;

  text-align: left;
}

hr {
  margin: 40px 0;
}

@media (max-width: 450px) {
  .form-box {
    flex-direction: column;
    gap: 15px;
  }
  .page {
    padding: 20px;
    margin: 10px;
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
  .users-table {
    font-size: 16px;
  }

  p {
    font-size: 16px !important;
  }
  button {
    padding: 4px 10px;
    font-size: 16px;
  }
  hr {
    margin: 5px;
    margin-bottom: 10px;
  }
}
</style>
