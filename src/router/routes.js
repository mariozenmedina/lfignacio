import AboutPage from '@/pages/AboutPage.vue'
import CoursePage from '@/pages/CoursePage.vue'
import HomePage from '@/pages/HomePage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import ResearchPage from '@/pages/ResearchPage.vue'
import RootRedirectPage from '@/pages/RootRedirectPage.vue'
import TeachingPage from '@/pages/TeachingPage.vue'
import { locales } from '@/data/site'
import { coursePaths, pagePaths } from './paths'

export { alternatePaths, coursePaths, localizedPath, pagePaths } from './paths'

const pages = [
  ['home', HomePage],
  ['about', AboutPage],
  ['research', ResearchPage],
  ['teaching', TeachingPage],
]

export const routes = [
  { path: '/', name: 'root', component: RootRedirectPage, meta: { pageKey: 'root', locale: 'pt' } },
  ...pages.flatMap(([pageKey, component]) => locales.map((locale) => ({
    path: pagePaths[pageKey][locale],
    name: `${locale}-${pageKey}`,
    component,
    meta: { pageKey, locale },
  }))),
  ...Object.entries(coursePaths).flatMap(([courseId, paths]) => locales.map((locale) => ({
    path: paths[locale],
    name: `${locale}-course-${courseId}`,
    component: CoursePage,
    meta: { pageKey: 'course', courseId, locale },
  }))),
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage, meta: { pageKey: 'not-found', locale: 'pt' } },
]
