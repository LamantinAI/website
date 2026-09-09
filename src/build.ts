// Writes the site. Node 24 runs TypeScript directly, so this needs no
// bundler, no transpiler, and no node_modules — `node src/build.ts` is the
// whole toolchain.
//
// Output lands next to the sources rather than in a dist/: the folder stays
// something you can open with a file server or point GitHub Pages at, and a
// build is only needed when the content changes.

import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PRODUCTS } from './products.ts'
import { ORG } from './products.ts'
import { indexPage, manifestoPage, productPage } from './render.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** When the site's content last actually changed.
 *
 *  Taken from git rather than the clock, because a build date says when the
 *  generator ran and this needs to say when the words changed — rebuilding an
 *  untouched site must not make it look freshly written.
 *
 *  But git alone answers with the *previous* content commit: a build runs
 *  before the commit that carries its own changes, so a page edited today and
 *  committed today would ship claiming yesterday. So a dirty content tree
 *  means the change is happening now, and now is the honest answer. Clean tree
 *  and the commit date stands, which is what keeps an untouched rebuild quiet.
 *
 *  One date for every page, and that is honest rather than lazy: the whole site
 *  is generated from one content file, so a per-page date would be a precision
 *  the generator does not have.
 *
 *  It matters because a page with no date carries no recency signal in the
 *  document at all, and AI answers weigh recency heavily — pages left stale
 *  stop being cited. */
const lastChanged = (() => {
  const CONTENT = ['src/', 'styles.css']
  const git = (...args: string[]) =>
    execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
  /** Local, to match git's `%cI` — `toISOString` is UTC and would disagree
   *  with it either side of midnight. */
  const today = () => {
    const d = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }
  try {
    if (git('status', '--porcelain', '--', ...CONTENT)) return today()
    const iso = git('log', '-1', '--format=%cI', '--', ...CONTENT)
    if (iso) return iso.slice(0, 10)
  } catch {
    // A tarball with no git history still has to build. Saying nothing is
    // right here — a made-up date would be worse than an absent one.
  }
  return null
})()

const write = (rel: string, html: string) => {
  const path = join(root, rel)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, html, 'utf8')
  console.log(`  ${rel.padEnd(34)} ${String(Math.round(html.length / 102.4) / 10).padStart(5)} КБ`)
}

console.log('собираю:')
write('index.html', indexPage(lastChanged))
write('manifesto/index.html', manifestoPage(lastChanged))
for (const p of PRODUCTS) write(`products/${p.slug}/index.html`, productPage(p, lastChanged))

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
