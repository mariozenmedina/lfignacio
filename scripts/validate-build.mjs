import { access, open, readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { courses } from '../src/data/courses.js'
import { conferencePublications, journalPublications } from '../src/data/publications.js'
import { allLocalizedPaths } from '../src/router/paths.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

await access(dist)

const uniqueRoutes = [...new Set(allLocalizedPaths)]
assert(uniqueRoutes.length === 33, `Expected 33 localized routes, found ${uniqueRoutes.length}`)
assert(uniqueRoutes.every((route) => route.startsWith('/') && route.endsWith('/')), 'Every application route must be hash-compatible')

const rootHtml = await readFile(path.join(dist, 'index.html'), 'utf8')
assert(rootHtml.includes('./assets/'), 'The SPA entry point must use relative asset URLs')
assert(!rootHtml.includes('/~lfignacio/'), 'A deployment subfolder leaked into the SPA entry point')

for (const [, reference] of rootHtml.matchAll(/(?:href|src)="([^"?#]+)(?:[?#][^"]*)?"/g)) {
  if (/^(?:https?:|mailto:|tel:|data:)/.test(reference)) continue
  assert(!reference.startsWith('/'), `Root-relative build reference found: ${reference}`)
  await access(path.resolve(dist, reference))
}

const mainSource = await readFile(path.join(root, 'src', 'main.js'), 'utf8')
assert(mainSource.includes('createWebHashHistory()'), 'Vue Router is not using hash history')

const citations = [...journalPublications, ...conferencePublications]
assert(citations.length === 48, `Expected 48 publications, found ${citations.length}`)
assert(citations.every((item) => item.citation?.trim()), 'Every publication must have a citation')

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

console.log(`Validated one relocatable hash-routed SPA with ${uniqueRoutes.length} routes, ${citations.length} publications, and ${materialPaths.length} materials (${totalMaterialBytes} bytes).`)
