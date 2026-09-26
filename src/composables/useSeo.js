import { unref } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { getContent, siteUrl } from '@/data/site'
import { alternatePaths } from '@/router/routes'

export function useSeo({ title, description, image = '/og.png', type = 'website' }) {
  const route = useRoute()

  const resolveValue = (value) => typeof value === 'function' ? value() : unref(value)

  useHead(() => {
    const locale = route.meta.locale || 'pt'
    const copy = getContent(locale)
    const resolvedTitle = resolveValue(title)
    const resolvedDescription = resolveValue(description)
    const alternates = alternatePaths(route.meta.pageKey, route.meta.courseId)
    const canonical = `${siteUrl}${route.path}`
    const imageUrl = image ? `${siteUrl}${image}` : undefined

    return {
      title: `${resolvedTitle} — Prof. Luís Felipe Ignácio Cunha`,
      htmlAttrs: { lang: copy.languageTag },
      link: [
        { rel: 'canonical', href: canonical },
        ...Object.entries(alternates).map(([lang, href]) => ({ rel: 'alternate', hreflang: lang, href: `${siteUrl}${href}` })),
        { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}${alternates.pt}` },
      ],
      meta: [
        { name: 'description', content: resolvedDescription },
        { property: 'og:type', content: type },
        { property: 'og:locale', content: copy.languageTag.replace('-', '_') },
        { property: 'og:title', content: resolvedTitle },
        { property: 'og:description', content: resolvedDescription },
        { property: 'og:url', content: canonical },
        ...(imageUrl ? [{ property: 'og:image', content: imageUrl }] : []),
        { name: 'twitter:card', content: imageUrl ? 'summary_large_image' : 'summary' },
        { name: 'twitter:title', content: resolvedTitle },
        { name: 'twitter:description', content: resolvedDescription },
        ...(imageUrl ? [{ name: 'twitter:image', content: imageUrl }] : []),
      ],
      script: [
        {
          type: 'application/ld+json',
          textContent: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Luís Felipe Ignácio Cunha',
            url: siteUrl,
            email: 'mailto:lfignacio@ic.uff.br',
            jobTitle: locale === 'pt' ? 'Professor de Ciência da Computação' : locale === 'es' ? 'Profesor de Ciencia de la Computación' : 'Computer Science Professor',
            affiliation: {
              '@type': 'CollegeOrUniversity',
              name: 'Universidade Federal Fluminense',
              url: 'https://www.uff.br/',
            },
            sameAs: [
              'http://lattes.cnpq.br/5594677783572346',
              'https://orcid.org/0000-0002-3797-6053',
              'https://scholar.google.com.br/citations?user=uPPQitYAAAAJ',
              'https://www.youtube.com/@lfignacio1',
            ],
            knowsAbout: ['Algorithms', 'Combinatorics', 'Graph Theory', 'Bioinformatics', 'Quantum Computing'],
          }),
        },
      ],
    }
  })
}
