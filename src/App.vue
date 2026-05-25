<template>
  <div>
    <Navbar v-if="showNavbar" />

    <RouterView />
  </div>
</template>

<script setup>
import { computed } from 'vue'

import { useRoute } from 'vue-router'

import Navbar from './components/Navbar.vue'

const route = useRoute()

const showNavbar = computed(() => {
  return route.path !== '/login'
})
</script>

<style>
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 20px;
  color: #333333;
  background-color: rgb(235, 250, 248);
}
</style>
