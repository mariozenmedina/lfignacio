<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import { getContent } from '@/data/site'

const route = useRoute()
const locale = computed(() => route.meta.locale || 'pt')
const copy = computed(() => getContent(locale.value))

useHead(() => ({
  htmlAttrs: { lang: copy.value.languageTag },
  meta: [
    { name: 'theme-color', content: '#0c1816' },
    { name: 'color-scheme', content: 'dark light' },
  ],
}))
</script>

<template>
  <a class="skip-link" href="#main-content">{{ copy.skip }}</a>
  <div class="site-frame">
    <SiteHeader />
    <RouterView v-slot="{ Component, route: activeRoute }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="activeRoute.path" />
      </Transition>
    </RouterView>
    <SiteFooter />
  </div>
</template>
