<template>
  <div class="login-page">
    <div class="login-card">
      <img src="@/components/icons/logo.png" alt="" />
      <!-- <h1>Вход в систему</h1> -->

      <input v-model="username" class="input-icon input-login" type="text" placeholder="Логин" />

      <input
        v-model="password"
        class="input-icon input-pass"
        type="password"
        placeholder="Пароль"
      />

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
  background-color: rgb(121, 212, 194);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.login-card {
  width: 300px;
  background-color: white;
  display: flex;
  height: 450px;
  flex-direction: column;
  gap: 20px;
  padding: 40px;
  padding-top: 100px;
  border: 1px solid #ccc;
  border-radius: 30px;
  box-shadow: 5px 5px 20px;

  img {
    padding-bottom: 20px;
  }
}

input {
  color: rgb(8, 163, 173);
  padding: 6px 10px;
  border-radius: 30px;
  border: 2px solid rgb(8, 163, 173);
  background-color: #fff;
}

input::placeholder {
  color: rgb(8, 163, 173);
}

input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px #fafafc inset; /* фон */
  -webkit-text-fill-color: rgb(8, 163, 173); /* текст */
}

.input-icon {
  background-repeat: no-repeat;
  background-position: 10px center;
  background-size: 20px 20px;
  padding-left: 40px;
}

.input-login {
  background-image: url('../components/icons/login.png');
}

.input-pass {
  background-image: url('../components/icons/pass.png');
}

button {
  padding: 8px 10px;
  border-radius: 30px;
  color: #fff;
  background-color: rgb(121, 212, 194);
  border: none;
}

.error {
  color: red;
}
</style>
