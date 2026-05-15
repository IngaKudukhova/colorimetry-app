import AdminSubstancesView from '../views/AdminSubstancesView.vue'

import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../views/Dashboard.vue'
import NewAnalysis from '../views/NewAnalysis.vue'
import HistoryView from '../views/HistoryView.vue'
import LoginView from '../views/LoginView.vue'
import AdminUsersView from '../views/AdminUsersView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/admin/substances',
    component: AdminSubstancesView,
  },
  {
    path: '/dashboard',
    component: Dashboard,
  },
  {
    path: '/new-analysis',
    component: NewAnalysis,
  },
  {
    path: '/history',
    name: 'history',
    component: HistoryView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/admin/users',
    component: AdminUsersView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  const publicPages = ['/login']

  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !token) {
    return next('/login')
  }

  next()
})

export default router
