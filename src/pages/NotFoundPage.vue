<script setup>
import { ArrowLeft } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import { usePage } from '@/composables/usePage'

const { pathFor } = usePage()
</script>

<template>
  <main id="main-content" class="not-found shell">
    <span>404</span>
    <h1>Esta página não foi encontrada.</h1>
    <RouterLink class="button button--dark" :to="pathFor('home')"><ArrowLeft :size="18" /> Voltar ao início</RouterLink>
  </main>
</template>
