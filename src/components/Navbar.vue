<template>
  <div class="header">
    <p>Автоматизированная система цифрового цветометрического анализа</p>
  </div>
  <nav class="navbar">
    <!-- <div class="image">
      <img src="@/components/icons/logo.png" alt="" />
    </div> -->
    <div class="left">
      <RouterLink to="/new-analysis"> Анализ концентрации </RouterLink>
      <RouterLink to="/history"> Качественный анализ </RouterLink>
      <RouterLink to="/history"> История </RouterLink>
      <RouterLink to="/history"> Справочник </RouterLink>
      <RouterLink v-if="user.role === 'admin'" to="/admin/substances"> Вещества </RouterLink>
      <RouterLink v-if="user.role === 'admin'" to="/admin/users"> Пользователи </RouterLink>
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
.header {
  background-color: rgb(121, 212, 194);
  margin: 20px 20px 0px 20px;
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px 20px 0 0;
  p {
    color: white;
    font-weight: bold;
  }
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  background-color: white;
  margin: 0px 20px 10px 20px;
  border-radius: 0 0 20px 20px;
}

.left {
  display: flex;
  color: #333333;
  gap: 15px;
  margin-left: 10px;
}

.right {
  display: flex;
  align-items: center;
  margin-right: 10px;
  gap: 10px;
  span {
    font-size: 17px;
  }
}

a {
  text-decoration: none;
  font-size: 20px;
  color: #333333;
}

a:hover {
  transform: scale(1.1);
  display: inline-block;
}
button {
  padding: 5px 11px;
  font-size: 17px;
  background-color: rgb(121, 212, 194);
  color: white;
  border-radius: 30px;
  border: 1px solid rgb(8, 163, 173);
}
button:hover {
  transform: scale(1.1);
  display: inline-block;
}

/* .right::before {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url('@/components/icons/free.svg');
  margin-right: 8px;
  vertical-align: middle;
} */
</style>
