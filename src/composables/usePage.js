import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getContent } from '@/data/site'
import { localizedPath } from '@/router/routes'

export function usePage() {
  const route = useRoute()
  const locale = computed(() => route.meta.locale || 'pt')
  const copy = computed(() => getContent(locale.value))
  const pageKey = computed(() => route.meta.pageKey || 'home')
  const courseId = computed(() => route.meta.courseId)
  const pathFor = (targetPage, targetCourse) => localizedPath(locale.value, targetPage, targetCourse)

  return { route, locale, copy, pageKey, courseId, pathFor }
}
