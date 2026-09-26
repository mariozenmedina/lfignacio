import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import { routes } from './router/routes'
import './styles/main.css'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 96 }
    return { top: 0 }
  },
})

createApp(App)
  .use(createHead())
  .use(router)
  .mount('#app')
