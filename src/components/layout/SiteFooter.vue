<script setup>
import { ArrowUpRight, Mail } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import { profileLinks } from '@/data/site'
import { usePage } from '@/composables/usePage'

const { copy, pathFor } = usePage()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="shell footer-grid">
      <div class="footer-intro">
        <span class="brand-mark brand-mark--light" aria-hidden="true">LF</span>
        <p>{{ copy.footer.description }}</p>
      </div>

      <nav class="footer-nav" :aria-label="copy.footer.contact">
        <RouterLink :to="pathFor('research')">{{ copy.nav.research }}</RouterLink>
        <RouterLink :to="pathFor('teaching')">{{ copy.nav.teaching }}</RouterLink>
        <a href="mailto:lfignacio@ic.uff.br">
          <Mail :size="16" aria-hidden="true" /> lfignacio@ic.uff.br
        </a>
      </nav>

      <div class="footer-profiles">
        <a v-for="profile in profileLinks" :key="profile.id" :href="profile.href" target="_blank" rel="noopener noreferrer">
          {{ profile.label }} <ArrowUpRight :size="14" aria-hidden="true" />
        </a>
      </div>
    </div>
    <div class="shell footer-bottom">
      <span>© {{ year }} {{ copy.footer.rights }}</span>
      <a href="https://www.ic.uff.br/" target="_blank" rel="noopener noreferrer">{{ copy.footer.institution }}</a>
    </div>
  </footer>
</template>
