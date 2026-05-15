<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Вход в систему</h1>

      <input v-model="username" type="text" placeholder="Логин" />

      <input v-model="password" type="password" placeholder="Пароль" />

      <button @click="login">Войти</button>

      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import api from '../services/api'

import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')

const password = ref('')

const errorMessage = ref('')

async function login() {
  try {
    const response = await api.post(
      'http://localhost:3000/auth/login',

      {
        username: username.value,
        password: password.value,
      },
    )

    localStorage.setItem('token', response.data.token)

    localStorage.setItem('user', JSON.stringify(response.data.user))

    router.push('/new-analysis')
  } catch (error) {
    errorMessage.value = 'Неверный логин или пароль'
  }
}
</script>

<style scoped>
.login-page {
  display: flex;

  justify-content: center;

  align-items: center;

  min-height: 100vh;
}

.login-card {
  width: 300px;

  display: flex;

  flex-direction: column;

  gap: 15px;

  padding: 30px;

  border: 1px solid #ccc;

  border-radius: 10px;
}

input {
  padding: 10px;
}

button {
  padding: 10px;
}

.error {
  color: red;
}
</style>
