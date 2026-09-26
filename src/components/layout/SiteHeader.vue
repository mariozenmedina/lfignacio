<script setup>
import { ref, watch } from 'vue'
import { Menu, X } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import LanguageSwitcher from '@/components/navigation/LanguageSwitcher.vue'
import { usePage } from '@/composables/usePage'

const { route, copy, pathFor } = usePage()
const open = ref(false)

watch(() => route.path, () => { open.value = false })

const links = [
  ['home', 'home'],
  ['about', 'about'],
  ['research', 'research'],
  ['teaching', 'teaching'],
]
</script>

<template>
  <header class="site-header">
    <div class="header-inner shell">
      <RouterLink class="brand" :to="pathFor('home')" aria-label="Luís Felipe Ignácio Cunha — home">
        <span class="brand-mark" aria-hidden="true">LF</span>
        <span class="brand-copy">
          <strong>Luís Felipe Ignácio</strong>
          <small>DCC · IC · UFF</small>
        </span>
      </RouterLink>

      <button
        class="menu-toggle"
        type="button"
        :aria-label="open ? copy.menu.close : copy.menu.open"
        :aria-expanded="open"
        aria-controls="primary-navigation"
        @click="open = !open"
      >
        <X v-if="open" :size="22" aria-hidden="true" />
        <Menu v-else :size="22" aria-hidden="true" />
      </button>

      <div id="primary-navigation" class="header-actions" :class="{ 'is-open': open }">
        <nav class="primary-nav" aria-label="Primary navigation">
          <RouterLink
            v-for="([key, target]) in links"
            :key="key"
            :to="pathFor(target)"
            :class="{ 'is-active': route.meta.pageKey === target || (target === 'teaching' && route.meta.pageKey === 'course') }"
          >
            {{ copy.nav[key] }}
          </RouterLink>
        </nav>
        <LanguageSwitcher />
      </div>
    </div>
  </header>
</template>
