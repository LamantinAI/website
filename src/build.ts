// Writes the site. Node 24 runs TypeScript directly, so this needs no
// bundler, no transpiler, and no node_modules — `node src/build.ts` is the
// whole toolchain.
//
// Output lands next to the sources rather than in a dist/: the folder stays
// something you can open with a file server or point GitHub Pages at, and a
// build is only needed when the content changes.

import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PRODUCTS } from './products.ts'
import { ORG } from './products.ts'
import { indexPage, manifestoPage, productPage } from './render.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const write = (rel: string, html: string) => {
  const path = join(root, rel)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, html, 'utf8')
  console.log(`  ${rel.padEnd(34)} ${String(Math.round(html.length / 102.4) / 10).padStart(5)} КБ`)
}

console.log('собираю:')
write('index.html', indexPage())
write('manifesto/index.html', manifestoPage())
for (const p of PRODUCTS) write(`products/${p.slug}/index.html`, productPage(p))

// A crawler is told what exists and where, by the same list that built it.
// Written here rather than kept by hand for the reason the pages are: a
// sitemap maintained separately is a sitemap that goes stale the first time
// someone adds a product and forgets.
const urls = ['/', '/manifesto/', ...PRODUCTS.map((p) => `/products/${p.slug}/`)]
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${ORG.url}${u}</loc></url>`).join('\n')}
</urlset>
`)

// Nothing here is private, so the file exists to point at the sitemap rather
// than to keep anyone out.
write('robots.txt', `User-agent: *
Allow: /

Sitemap: ${ORG.url}/sitemap.xml
`)

// A generator that only ever writes leaves orphans: drop a product from the
// data and its page would stay live, linked from nothing and telling nobody
// it is gone. Anything under products/ that is no longer in the data goes.
const known = new Set(PRODUCTS.map((p) => p.slug))
const dir = join(root, 'products')
for (const name of readdirSync(dir, { withFileTypes: true })) {
  if (!name.isDirectory() || known.has(name.name)) continue
  rmSync(join(dir, name.name), { recursive: true })
  console.log(`  убрана products/${name.name}/ — продукта больше нет в данных`)
}

console.log(`готово: ${PRODUCTS.length + 2} страниц`)
