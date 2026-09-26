import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { siteUrl } from '../src/data/site.js'
import { allLocalizedPaths } from '../src/router/paths.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
await mkdir(publicDir, { recursive: true })

const urls = [...new Set(allLocalizedPaths)]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${siteUrl}${url}</loc><changefreq>monthly</changefreq></url>`).join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

await Promise.all([
  writeFile(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8'),
  writeFile(path.join(publicDir, 'robots.txt'), robots, 'utf8'),
])

console.log(`SEO files generated for ${urls.length} localized pages.`)
