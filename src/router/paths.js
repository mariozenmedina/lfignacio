import { locales } from '../data/site.js'

export const pagePaths = {
  home: { pt: '/pt/', en: '/en/', es: '/es/' },
  about: { pt: '/pt/sobre/', en: '/en/about/', es: '/es/trayectoria/' },
  research: { pt: '/pt/pesquisa/', en: '/en/research/', es: '/es/investigacion/' },
  teaching: { pt: '/pt/ensino/', en: '/en/teaching/', es: '/es/docencia/' },
}

export const coursePaths = {
  asa: {
    pt: '/pt/ensino/analise-e-projeto-de-algoritmos/',
    en: '/en/teaching/analysis-and-design-of-algorithms/',
    es: '/es/docencia/analisis-y-diseno-de-algoritmos/',
  },
  fmc: {
    pt: '/pt/ensino/fundamentos-matematicos/',
    en: '/en/teaching/mathematical-foundations/',
    es: '/es/docencia/fundamentos-matematicos/',
  },
  teocomp: {
    pt: '/pt/ensino/teoria-da-computacao/',
    en: '/en/teaching/theory-of-computation/',
    es: '/es/docencia/teoria-de-la-computacion/',
  },
  prog1: {
    pt: '/pt/ensino/programacao-de-computadores/',
    en: '/en/teaching/computer-programming/',
    es: '/es/docencia/programacion-de-computadores/',
  },
  grafos: {
    pt: '/pt/ensino/teoria-dos-grafos/',
    en: '/en/teaching/graph-theory/',
    es: '/es/docencia/teoria-de-grafos/',
  },
  alggrafos: {
    pt: '/pt/ensino/algoritmos-em-grafos/',
    en: '/en/teaching/graph-algorithms/',
    es: '/es/docencia/algoritmos-en-grafos/',
  },
  topicosbioinfo: {
    pt: '/pt/ensino/topicos-bioinformatica-strings/',
    en: '/en/teaching/topics-bioinformatics-strings/',
    es: '/es/docencia/temas-bioinformatica-strings/',
  },
}

export function localizedPath(locale, pageKey, courseId) {
  if (pageKey === 'course' && courseId) return coursePaths[courseId]?.[locale] || pagePaths.home[locale]
  return pagePaths[pageKey]?.[locale] || pagePaths.home[locale]
}

export function alternatePaths(pageKey, courseId) {
  return Object.fromEntries(locales.map((locale) => [locale, localizedPath(locale, pageKey, courseId)]))
}

export const allLocalizedPaths = [
  ...Object.values(pagePaths).flatMap((paths) => locales.map((locale) => paths[locale])),
  ...Object.values(coursePaths).flatMap((paths) => locales.map((locale) => paths[locale])),
]
