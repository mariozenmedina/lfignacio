import { access, open, readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { courses } from '../src/data/courses.js'
import { conferencePublications, journalPublications } from '../src/data/publications.js'
import { allLocalizedPaths } from '../src/router/paths.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const normalizedBase = (process.env.BASE_PATH || '/~lfignacio/').replace(/^\/+|\/+$/g, '')
const expectedBase = normalizedBase ? `/${normalizedBase}/` : '/'

const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

const htmlFileFor = (route) => path.join(dist, route.replace(/^\//, ''), 'index.html')
const decodeHtml = (value) => value
  .replace(/<[^>]*>/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/\s+/g, ' ')
  .trim()

await access(dist)

const uniqueRoutes = [...new Set(allLocalizedPaths)]
assert(uniqueRoutes.length === 33, `Expected 33 localized routes, found ${uniqueRoutes.length}`)

for (const route of uniqueRoutes) {
  const file = htmlFileFor(route)
  await access(file)
  const html = await readFile(file, 'utf8')
  const locale = route.split('/')[1]
  const expectedLang = locale === 'pt' ? 'pt-BR' : locale
  assert(html.includes(`lang="${expectedLang}"`), `Missing correct html lang in ${route}`)
  assert(html.includes(`rel="canonical"`), `Missing canonical link in ${route}`)
  assert(html.includes('hreflang="pt"') && html.includes('hreflang="en"') && html.includes('hreflang="es"'), `Missing hreflang set in ${route}`)
  assert(html.includes(`${expectedBase}assets/`), `Static base path ${expectedBase} is not present in ${route}`)
  assert(!html.includes('WhatsApp Image'), `Legacy photo name leaked into ${route}`)
}

const researchRoutes = ['/pt/pesquisa/', '/en/research/', '/es/investigacion/']
const citations = [...journalPublications, ...conferencePublications]
assert(citations.length === 48, `Expected 48 publications, found ${citations.length}`)
for (const route of researchRoutes) {
  const visibleText = decodeHtml(await readFile(htmlFileFor(route), 'utf8'))
  for (const item of citations) {
    assert(visibleText.includes(item.citation), `Publication ${item.id} missing from ${route}`)
  }
}

const materialPaths = [...new Set(courses.flatMap((course) => [...course.materials.slides, ...course.materials.activities].map((item) => item.path)))]
assert(materialPaths.length === 185, `Expected 185 unique teaching materials, found ${materialPaths.length}`)
let totalMaterialBytes = 0
for (const material of materialPaths) {
  const relative = material.split('/').join(path.sep)
  const source = path.join(root, 'public', relative)
  const built = path.join(dist, relative)
  const [sourceInfo, builtInfo] = await Promise.all([stat(source), stat(built)])
  assert(sourceInfo.size > 0, `Empty source material: ${material}`)
  assert(sourceInfo.size === builtInfo.size, `Built material differs from source: ${material}`)
  const handle = await open(built, 'r')
  const signatureBuffer = Buffer.alloc(4)
  await handle.read(signatureBuffer, 0, 4, 0)
  await handle.close()
  const signature = signatureBuffer.toString('binary')
  if (material.toLowerCase().endsWith('.pdf')) assert(signature.startsWith('%PDF'), `Invalid PDF signature: ${material}`)
  if (material.toLowerCase().endsWith('.zip')) assert(signature.startsWith('PK'), `Invalid ZIP signature: ${material}`)
  totalMaterialBytes += builtInfo.size
}

for (const required of ['og.png', 'robots.txt', 'sitemap.xml', 'documents/cv-luis-felipe-ignacio-en.pdf']) {
  await access(path.join(dist, ...required.split('/')))
}

const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8')
assert((sitemap.match(/<url>/g) || []).length === 33, 'Sitemap does not list all localized pages')

console.log(`Validated ${uniqueRoutes.length + 1} static pages, ${citations.length} publications, and ${materialPaths.length} materials (${totalMaterialBytes} bytes).`)
