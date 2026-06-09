<template>
  <div class="header">
    <p>Автоматизированная система цифрового цветометрического анализа</p>
  </div>
  <nav class="navbar">
    <!-- Десктоп: левые ссылки -->
    <div class="left">
      <RouterLink to="/new-analysis">Анализ концентрации</RouterLink>
      <router-link to="/qualitative-analysis">Качественный анализ</router-link>
      <RouterLink to="/history">История</RouterLink>
      <RouterLink to="/manual">Справочник</RouterLink>
      <RouterLink v-if="user.role === 'admin'" to="/admin/substances">Вещества</RouterLink>
      <RouterLink v-if="user.role === 'admin'" to="/admin/users">Пользователи</RouterLink>
    </div>

    <div class="right">
      <span v-if="user">{{ user.username }} ({{ roleLabel }})</span>
      <button @click="logout">Выйти</button>
    </div>

    <!-- Мобильный: правая часть + бургер -->
    <div class="mobile-bar">
      <span v-if="user" class="mobile-user">Меню</span>
      <button class="burger" @click="menuOpen = !menuOpen" :class="{ active: menuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>

  <!-- Выпадающее меню -->
  <div class="dropdown-menu" :class="{ open: menuOpen }" @click="menuOpen = false">
    <RouterLink to="/new-analysis">Анализ концентрации</RouterLink>
    <router-link to="/qualitative-analysis">Качественный анализ</router-link>
    <RouterLink to="/history">История</RouterLink>
    <RouterLink to="/manual">Справочник</RouterLink>
    <RouterLink v-if="user.role === 'admin'" to="/admin/substances">Вещества</RouterLink>
    <RouterLink v-if="user.role === 'admin'" to="/admin/users">Пользователи</RouterLink>
    <div class="dropdown-footer">
      <span v-if="user">{{ user.username }} ({{ roleLabel }})</span>
      <button @click="logout">Выйти</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = JSON.parse(localStorage.getItem('user'))
const menuOpen = ref(false)

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
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    letter-spacing: 0.05em;
    font-size: 22px;
  }
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px;
  border-bottom: 1px solid #ccc;
  background-color: rgb(255, 255, 255);
  margin: 0px 20px 10px 20px;
  border-radius: 0 0 20px 20px;
  font-size: 16px;
}

.left {
  display: flex;
  gap: 20px;
  margin-left: 20px;
}

.right {
  display: flex;
  align-items: center;
  margin-right: 10px;
  gap: 15px;
  span {
    font-size: 17px;
  }
}

a {
  text-decoration: none;
  font-size: 18px;
  color: #333333;
}

a:hover {
  transform: scale(1.1);
  display: inline-block;
}

a.router-link-active {
  color: rgb(80, 170, 155);
}

button {
  margin-bottom: 10px;
}

img {
  margin-left: 20px;
  height: 35px;
  width: 70px;
}

/* Мобильные элементы — скрыты на десктопе */
.mobile-bar {
  display: none;
}

.dropdown-menu {
  display: none;
}

/* ── Мобильная версия ── */
@media (max-width: 450px) {
  .header {
    margin: 10px 10px 0 10px;
    padding: 10px 12px;
    border-radius: 12px 12px 0 0;
    p {
      font-size: 18px;
      text-align: center;
    }
  }

  .navbar {
    margin: 0 10px 0 10px;
    border-radius: 0 0 12px 12px;
    padding: 6px 10px;
    /* Скрываем десктопные блоки */
    .left,
    .right {
      display: none;
    }
    /* Показываем мобильную панель */
    .mobile-bar {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
    }
  }

  .mobile-user {
    font-size: 15px;
    color: #333;
  }

  /* Кнопка-бургер */
  .burger {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 20px;
    height: 20px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;

    span {
      display: block;
      height: 2px;
      background-color: #333;
      border-radius: 2px;
      transition: all 0.25s ease;
      transform-origin: center;
    }
  }

  /* Анимация бургера → крестик */
  .burger.active span:nth-child(1) {
    transform: translateY(9px) rotate(45deg);
  }
  .burger.active span:nth-child(2) {
    opacity: 0;
  }
  .burger.active span:nth-child(3) {
    transform: translateY(-9px) rotate(-45deg);
  }

  /* Выпадающее меню */
  .dropdown-menu {
    display: flex;
    flex-direction: column;
    gap: 0;
    background: #fff;
    margin: 0 10px 10px 10px;
    border-radius: 0 0 12px 12px;
    border: 1px solid #e0e0e0;
    border-top: none;
    overflow: hidden;
    /* Закрытое состояние */
    max-height: 0;
    opacity: 0;
    transition:
      max-height 0.3s ease,
      opacity 0.25s ease;

    a {
      padding: 12px 20px;
      font-size: 16px;
      color: #333;
      border-bottom: 1px solid #f0f0f0;
      text-decoration: none;

      &:last-of-type {
        border-bottom: none;
      }

      &:hover,
      &.router-link-active {
        background-color: rgb(121, 212, 194, 0.15);
        color: rgb(80, 170, 155);
      }
    }

    /* Открытое состояние */
    &.open {
      max-height: 400px;
      opacity: 1;
    }
  }

  .dropdown-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: #f9f9f9;
    border-top: 1px solid #e0e0e0;

    span {
      font-size: 14px;
      color: #666;
    }

    button {
      margin: 0;
      font-size: 14px;
    }
  }
}
</style>
