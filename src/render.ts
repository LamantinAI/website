// Templates. Plain string interpolation — the output is static HTML and
// nothing here ever runs in a browser.
//
// `up` is how deep the page sits, so the same shell serves the root and a
// product two levels down without any absolute paths. That keeps the site
// portable: it works from a file:// folder, a sub-path, or a domain root.

import { MANIFESTO, ORG, PRODUCTS, TIERS, type Fact, type Product } from './products.ts'

/** Bumped when a stylesheet, script or icon changes. Static hosts cache these
 *  hard — and a stale script is worse than a stale look: `stars.js` writes into
 *  markup this file emits, so an old copy running against new markup mangles it. */
const REV = '7'

const esc = (s: string) => s.replace(/&(?![a-z#]+;)/g, '&amp;').replace(/"/g, '&quot;')
/** Collapses the indentation that keeps the data file readable. */
const tidy = (s: string) => s.replace(/\s*\n\s*/g, ' ').trim()

const shell = (o: {
  up: string; title: string; desc: string; tier?: string; body: string; scripts?: string
}) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(o.title)}</title>
    <meta name="description" content="${esc(o.desc)}" />
    <link rel="icon" href="${o.up}assets/icon-32.png?v=${REV}" sizes="32x32" />
    <link rel="icon" href="${o.up}assets/icon-16.png?v=${REV}" sizes="16x16" />
    <link rel="apple-touch-icon" href="${o.up}assets/apple-touch-icon.png?v=${REV}" />
    <link rel="stylesheet" href="${o.up}assets/fonts.css?v=${REV}" />
    <link rel="stylesheet" href="${o.up}styles.css?v=${REV}" />
    <meta property="og:title" content="${esc(o.title)}" />
    <meta property="og:description" content="${esc(o.desc)}" />
    <meta property="og:type" content="website" />
  </head>
  <body${o.tier ? ` data-tier="${o.tier}"` : ''}>
    <a class="skip" href="#main">Skip to content</a>
${o.body}
    <footer>
      <img class="watermark" src="${o.up}assets/mark-parchment.png" alt="" width="608" height="220" />
      <div class="wrap">
        <h2>Everything we can open, we open.</h2>
        <div class="contact">
          <a class="mail" href="mailto:${ORG.mail}">${ORG.mail}</a>
        </div>
        <div class="rule">
          <div class="links">
            <a href="${o.up || './'}">${ORG.name}</a>
            <a href="${o.up}manifesto/">Manifesto</a>
            <a href="${ORG.github}" rel="noopener">GitHub</a>
            <a href="${ORG.brandbook}" rel="noopener">Brand book</a>
          </div>
          <small>${ORG.name} · Rust · Python · Edge AI</small>
        </div>
      </div>
    </footer>
    <script src="${o.up}assets/stars.js?v=${REV}" type="module"></script>${o.scripts ?? ''}
  </body>
</html>
`

const facts = (items: Fact[]) => items.map((f) =>
  `            <li>\n              <b>${f.term}</b>\n              <span>${tidy(f.def)}</span>\n            </li>`).join('\n')

/** A zero star count says nothing worth the space, so the whole thing —
 *  separator included — is hidden until there is a number to show. The
 *  wrapper carries its own separator so hiding it never leaves a stray dot,
 *  and `stars.js` writes into the inner span rather than replacing it. */
const stars = (p: Product) =>
  p.unreleased ? '' :
  `<span class="stars" data-stars="${p.slug}"${p.stars ? '' : ' hidden'}>` +
  `<span class="n">★ ${p.stars}</span><span class="sep">·</span></span>`

/** What the meta line closes with: a licence for what is out, an honest
 *  status for what is not. */
const licence = (p: Product) => (p.unreleased ? 'not yet public' : 'MIT')

// ── the index ─────────────────────────────────────────────────────────────
const tierBlock = (tier: 'infra' | 'mind') => {
  const t = TIERS[tier]
  const cards = PRODUCTS.filter((p) => p.tier === tier).map((p) => `
              <a class="card" href="./products/${p.slug}/">
                <h4>${p.name}</h4>
                <p>${tidy(p.card)}</p>
                <span class="meta">${stars(p)}${p.lang}<span class="sep">·</span>${licence(p)}</span>
              </a>`).join('')
  return `
          <div class="tier tier-${tier === 'infra' ? 'infra' : 'mind'}">
            <div class="tier-head">
              <span class="key" aria-hidden="true"></span>
              <div class="tier-name">
                <h3>${t.name}</h3>
                <span class="job">${t.job}</span>
              </div>
            </div>
            <div class="cards">${cards}
            </div>
          </div>`
}

export const indexPage = () => shell({
  up: './',
  title: `${ORG.name} — reliable tools, built in the open`,
  desc: 'A research organization working on computer vision, machine learning, and the systems underneath them. Everything we can open, we open.',
  body: `
    <header class="masthead">
      <div class="wrap row">
        <a class="brand" href="#main">
          <img src="./assets/mark-petrol.png" alt="" width="608" height="220" />
          <b>${ORG.name}</b>
        </a>
        <nav aria-label="Sections">
          <a href="#work">Work</a>
          <a href="#products">Products</a>
          <a href="#ethics">Ethics</a>
          <a href="#openness">Openness</a>
        </nav>
      </div>
    </header>

    <main id="main">
      <div class="hero wrap">
        <p class="label pillars">${ORG.pillars.map((x) => `\n          <span>${x}</span>`).join('')}
        </p>
        <h1>${ORG.name}</h1>
        <p class="lede">${ORG.lede}</p>
        <p class="say">${tidy(ORG.say)}</p>
        <div class="actions">
          <a class="btn btn-primary" href="${ORG.github}" rel="noopener">Browse the source on GitHub</a>
          <a class="btn btn-quiet" href="./manifesto/">Read the manifesto →</a>
        </div>
      </div>

      <section id="work">
        <div class="wrap">
          <div class="head prose">
            <span class="label">What we work on</span>
            <h2>${ORG.work.headline}</h2>
            <p>${tidy(ORG.work.prose)}</p>
          </div>
          <ul class="stack" aria-label="Our stack">
            ${ORG.work.stack.map((x) => `<li>${x}</li>`).join('')}
          </ul>
        </div>
      </section>

      <section id="products">
        <div class="wrap">
          <div class="head prose">
            <span class="label">Products</span>
            <h2>What we've published.</h2>
            <p>Colour follows a product's primary job, never its stack: the rails everything
              runs on carry the vermillion seal, the things that reason and act carry the
              gilt. All of it is MIT.</p>
          </div>
${tierBlock('infra')}
${tierBlock('mind')}
        </div>
      </section>

      <section id="ethics">
        <div class="wrap">
          <div class="head prose">
            <span class="label">Engineering ethics</span>
            <h2>Four foundations we build on.</h2>
            <p>We view ethics not as an external layer of censorship filters, but as an
              engineering concept.</p>
          </div>
          <div class="foundations">${ORG.foundations.map((f, i) => `
            <div class="foundation">
              <span class="n">0${i + 1}</span>
              <h3>${f.term}</h3>
              <p>${f.def}</p>
            </div>`).join('')}
          </div>
          <p class="after"><a href="./manifesto/">Read the full manifesto →</a></p>
        </div>
      </section>

      <section id="openness">
        <div class="wrap openness">
          <div class="head prose" style="margin-bottom: 0">
            <span class="label">Radical openness</span>
            <h2>Everything we can open, we open.</h2>
            <p>Knowledge is only valuable when it is shared freely. We publish the work, not
              a summary of it — including the parts that did not go as planned.</p>
            <p class="aside-note">We do keep our credentials to ourselves.</p>
          </div>
          <ul class="publishes">${ORG.publishes.map((x) => `\n            <li>${x}</li>`).join('')}
          </ul>
        </div>
      </section>
    </main>
`,
})

/** How wide a code sample actually is, in characters — tags stripped, and
 *  every entity counted as the one glyph it renders as. */
const widestLine = (code: string) => Math.max(...code.split('\n').map((l) =>
  l.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/g, 'x').length))

/** The code sample as a window.
 *
 *  `--cols` is the whole trick: the stylesheet sizes the type so that many
 *  characters fit the column it lands in, so the sample shows everything it
 *  has instead of hiding the end behind a scrollbar. Measuring here rather
 *  than in CSS is what makes that possible — the browser cannot count the
 *  longest line, and the build can.
 *
 *  The three lights are the brand's own accents, not macOS's red/amber/green.
 *  Vermillion, gilt and petrol already sit at those hues, so the reference
 *  lands without importing three colours the palette does not have. */
const codeWindow = (code: string, title?: string) => `          <div class="code-win" style="--cols: ${widestLine(code)}">
            <div class="code-bar">
              <span class="lights" aria-hidden="true"><i></i><i></i><i></i></span>
              <span class="code-title">${title ?? ''}</span>
            </div>
            <pre class="code">${code}</pre>
          </div>`

// ── a product ─────────────────────────────────────────────────────────────
export const productPage = (p: Product) => {
  const t = TIERS[p.tier]
  const shots = !p.shots ? '' : `
      <div class="wrap">
        <div class="shots">${p.shots.map((s, i) => `
          <figure>
            <div class="frame">
              <img src="../../assets/products/${s.file}.webp"
                   srcset="../../assets/products/${s.file}.webp 1280w, ../../assets/products/${s.file}@2x.webp 2048w"
                   sizes="${i === 0 ? '(min-width: 1160px) 1074px, 92vw' : '(min-width: 900px) 45vw, 92vw'}"
                   width="1280" height="720"${i ? ' loading="lazy"' : ''}
                   alt="${esc(s.alt)}" />
            </div>
            <figcaption><b>${s.lead}</b> ${s.note}</figcaption>
          </figure>`).join('')}
        </div>
      </div>
`
  // …and moves into the hero as its right-hand column. It used to render as a
  // band of its own *below* the hero: a 340px circle pinned left, the right
  // half of the screen empty, and the hero above it only as wide as its own
  // text — two narrow blocks stacked down the left with the page's whole right
  // side unused twice over.
  const portrait = !p.portrait ? '' : `
        <figure class="p-portrait">
          <img src="../../assets/products/${p.portrait.file}.webp" width="640" height="640"
               alt="${esc(p.portrait.alt)}" />
        </figure>`
  const right = p.more.code
    ? codeWindow(p.more.code, p.more.codeTitle)
    : `          <ul class="facts">\n${facts(p.more.list ?? [])}\n          </ul>`

  return shell({
    up: '../../',
    tier: p.tier,
    title: `${p.name} — ${p.tagline} · ${ORG.name}`,
    desc: p.desc,
    body: `
    <header class="masthead">
      <div class="wrap row">
        <a class="back" href="../../">
          <span class="arrow" aria-hidden="true">←</span>
          <img src="../../assets/mark-petrol.png" alt="" width="608" height="220" />
          <b>${ORG.name}</b>
        </a>
        <nav aria-label="Sections">
          <a href="../../#products">All products</a>
        </nav>
      </div>
    </header>

    <main id="main">
      <div class="p-hero wrap${p.portrait ? ' has-portrait' : ''}">
        <div class="p-lead">
        <span class="p-tier label">${t.name}</span>
        <div class="p-name">
          <h1>${p.name}</h1>${p.glyph ? `\n          <span class="p-glyph" aria-hidden="true">${p.glyph}</span>` : ''}
        </div>
        <p class="lede">${p.lede}</p>
        <p class="p-meta">
          ${stars(p)}${p.lang}<span class="sep">·</span>${licence(p)}${p.note ? `<span class="sep">·</span>${p.note}` : ''}
        </p>
        <div class="actions">${p.unreleased ? `
          <span class="btn btn-quiet is-note">Not open yet — the substrate ships as it hardens</span>` : `
          <a class="btn btn-primary" href="${ORG.github}/${p.slug}" rel="noopener">View the source</a>`}${
            p.extraAction ? `\n          <a class="btn btn-quiet" href="${p.extraAction.href}" rel="noopener">${p.extraAction.label}</a>` : ''}
        </div>
        </div>${portrait}
      </div>
${shots}
      <section>
        <div class="wrap p-body">
          <div class="prose">
            <h2>${p.headline}</h2>
${p.body.map((x) => `            <p>${tidy(x)}</p>`).join('\n')}
          </div>
          <ul class="facts">
${facts(p.facts)}
          </ul>
        </div>
      </section>

      <section>
        <div class="wrap p-body">
          <div class="prose">
            <h2>${p.more.headline}</h2>
            <p>${tidy(p.more.prose)}</p>${p.more.links ? `
            <div class="also">${p.more.links.map((l) =>
              `\n              <a href="${l.href}" rel="noopener">${l.label}</a>`).join('')}
            </div>` : ''}
          </div>
${right}
        </div>
      </section>
    </main>
`,
  })
}

// ── the manifesto ─────────────────────────────────────────────────────────
// A document, so it is set as one: a single reading column, no cards, no
// grid. The four foundations come from ORG.foundations — the same array the
// index summarises — so the front page can never quietly disagree with the
// document it points at.
export const manifestoPage = () => shell({
  up: '../',
  title: `Manifesto — ${ORG.name}`,
  desc: 'We view ethics not as an external layer of censorship filters, but as an engineering concept. The four foundations Lamantin AI builds on, and what radical openness commits us to.',
  body: `
    <header class="masthead">
      <div class="wrap row">
        <a class="back" href="../">
          <span class="arrow" aria-hidden="true">←</span>
          <img src="../assets/mark-petrol.png" alt="" width="608" height="220" />
          <b>${ORG.name}</b>
        </a>
        <nav aria-label="Sections">
          <a href="../#products">All products</a>
        </nav>
      </div>
    </header>

    <main id="main">
      <div class="doc-hero wrap">
        <span class="label">${MANIFESTO.kicker}</span>
        <h1>${MANIFESTO.title}</h1>
        <div class="rule"></div>
      </div>

      <div class="wrap">
        <article class="doc prose">
          <p class="opening"><b>${ORG.name}</b> ${tidy(MANIFESTO.opening)}</p>

          <section id="ethics">
            <h2>${MANIFESTO.ethics.heading}</h2>
            <p class="doc-lede">${tidy(MANIFESTO.ethics.lede)}</p>
            <p>${MANIFESTO.ethics.intro}</p>
            <ol class="tenets" role="list">${ORG.foundations.map((f) => `
              <li><b>${f.term}:</b> ${tidy(f.long ?? f.def)}</li>`).join('')}
            </ol>
          </section>

          <section id="openness">
            <h2>${MANIFESTO.openness.heading}</h2>
            <p><b>${ORG.name}</b> ${tidy(MANIFESTO.openness.body)}</p>
          </section>

          <p class="colophon">${tidy(MANIFESTO.colophon)}</p>
          <p class="also"><a href="${ORG.manifestoSource}" rel="noopener">This document on GitHub →</a></p>
        </article>
      </div>
    </main>
`,
})
