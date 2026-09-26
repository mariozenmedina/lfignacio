<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { localizedPath } from '@/router/routes'

const router = useRouter()

onMounted(() => {
  const language = (navigator.language || 'pt').toLowerCase()
  const locale = language.startsWith('en') ? 'en' : language.startsWith('es') ? 'es' : 'pt'
  router.replace(localizedPath(locale, 'home'))
})
</script>

<template>
  <main id="main-content" class="redirect-page shell">
    <p>Selecione seu idioma · Choose your language · Selecciona tu idioma</p>
    <nav aria-label="Language">
      <RouterLink to="/pt/">Português</RouterLink>
      <RouterLink to="/en/">English</RouterLink>
      <RouterLink to="/es/">Español</RouterLink>
    </nav>
  </main>
</template>
