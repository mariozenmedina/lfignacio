<script setup>
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Languages } from '@lucide/vue'
import { localeNames, locales } from '@/data/site'
import { localizedPath } from '@/router/routes'
import { usePage } from '@/composables/usePage'

const router = useRouter()
const { locale, copy, pageKey, courseId } = usePage()
const changing = ref(false)

const value = computed(() => locale.value)

async function changeLanguage(event) {
  const nextLocale = event.target.value
  if (nextLocale === locale.value) return
  changing.value = true
  await router.push(localizedPath(nextLocale, pageKey.value, courseId.value))
  await nextTick()
  changing.value = false
}
</script>

<template>
  <label class="language-switcher" :class="{ 'is-changing': changing }">
    <Languages :size="16" aria-hidden="true" />
    <span class="sr-only">{{ copy.language.label }}</span>
    <select
      :value="value"
      :aria-label="copy.language.label"
      :aria-busy="changing"
      @change="changeLanguage"
    >
      <option v-for="item in locales" :key="item" :value="item">
        {{ localeNames[item] }}
      </option>
    </select>
    <span v-if="changing" class="sr-only" aria-live="polite">{{ copy.language.changing }}</span>
  </label>
</template>
