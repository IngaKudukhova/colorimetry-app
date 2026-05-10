<template>
  <nav class="navbar">
    <div class="left">
      <RouterLink to="/new-analysis"> Новый анализ </RouterLink>

      <RouterLink to="/history"> История </RouterLink>
    </div>

    <div class="right">
      <span v-if="user">
        {{ user.username }}
        ({{ roleLabel }})
      </span>

      <button @click="logout">Выйти</button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

import { useRouter } from 'vue-router'

const router = useRouter()

const user = JSON.parse(localStorage.getItem('user'))

const roleLabel = computed(() => {
  if (!user) return ''

  return user.role === 'admin' ? 'Администратор' : 'Лаборант'
})

function logout() {
  localStorage.removeItem('token')

  localStorage.removeItem('user')

  router.push('/login')
}
</script>

<style scoped>
.navbar {
  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 20px;

  border-bottom: 1px solid #ccc;
}

.left {
  display: flex;

  gap: 20px;
}

.right {
  display: flex;

  align-items: center;

  gap: 20px;
}

a {
  text-decoration: none;
}

button {
  padding: 8px 12px;
}
</style>
