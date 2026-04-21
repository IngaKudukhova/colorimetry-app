import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import NewAnalysis from '../views/NewAnalysis.vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/dashboard',
    component: Dashboard,
  },
  {
    path: '/new-analysis',
    component: NewAnalysis,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
