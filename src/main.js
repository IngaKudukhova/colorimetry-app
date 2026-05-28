import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

import vSelect from 'vue3-select'
import 'vue3-select/dist/vue3-select.css'
import './assets/analysis.css'

const app = createApp(App)

app.use(router)

app.component('v-select', vSelect)

app.mount('#app')
