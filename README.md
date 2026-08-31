# Lamantin AI — site

The organization's face: static pages, generated from one file of content.

```bash
node src/build.ts    # rewrite the HTML after editing src/products.ts
npm run serve        # http://localhost:8830
```

There is nothing to install. Node runs the TypeScript directly, so the generator
has no bundler, no transpiler and no `node_modules` — `package.json` exists only
to name the two commands. Node 24 needs no flag; `npm run build` passes
`--experimental-strip-types` so the same command also works on 22.6+, where
stripping is still behind it.

## How it is put together

```
src/products.ts   the content — the org, and one entry per product
src/render.ts     the templates
src/build.ts      writes index.html and products/<slug>/index.html
```

The product pages were 70% identical markup when they were written by
hand; now they share one template and differ only in their entry. The tier is
part of the type, so a fourth colour will not compile.

Output is written next to the sources rather than into a `dist/`, so the folder
stays something you can serve directly or point GitHub Pages at. Pages are
directories — `products/kaeru/index.html` — which is what gives clean URLs
(`/products/kaeru`) on any static host, with no rewrite rules and no client
router.

## What it is built on

The [brand book](https://github.com/LamantinAI/brandbook) — palette, type, and the
tier rules — is the source of truth. Two things it decides for this page:

- **The face is petrol on paper.** The brand book separates "the face" (calm,
  warm, minimal) from "the work" (near-black, vermillion, gold threads). A site
  is Tier 01, so it stays on paper. The single dark panel in the footer is the
  sanctioned exception.
- **Colour follows a product's job, never its stack.** Infrastructure carries
  the vermillion seal, intelligence carries the gilt. A new product joins a
  tier and shares its colour — it never gets a hue of its own.

Ochre gold is a hairline and an eyebrow here, never body text: on paper it
measures ~2.3:1 and fails every reading pair. Tier 03 labels use `--gold-ink`,
the same hue carried down to a legible lightness.

## Assets

`assets/mark-petrol.png` and `assets/mark-parchment.png` are lifted from the
brand book bundle; `assets/fonts/` is the same self-hosted Spectral + IBM Plex
Mono set the kaeru visualizer ships, so the two surfaces render identically.

## Product pages

One page per product under `products/`, all from the same template. That is the
brand book's rule, not laziness: *"the type, the surfaces, and the components
stay identical everywhere… Tier is colour; product is name."* A page carries its
tier through one attribute — `<body data-tier="infra">` or `"mind"` — and
nothing else changes.

## Star counts

The numbers live in the markup and `assets/stars.js` refreshes them from one
GitHub call on load. The page is correct before the script runs and correct if
it never does — a failure (offline, rate limited) simply leaves the baked value.
Unauthenticated GitHub allows 60 requests an hour per visitor IP.

To re-bake the fallbacks:

```bash
gh repo list LamantinAI --limit 30 --json name,stargazerCount --jq '.[] | "\(.name)  ★\(.stargazerCount)"'
```

## Media

The three kaeru stills are captured headless at `deviceScaleFactor: 2` — the
galaxy's nodes are soft glowing sprites, so a 1× capture goes blurry the moment
a retina display stretches it. Each ships at 1280 and 2048 wide behind
`srcset`; only the galaxy loads eagerly.

They are shot against an **anonymised** vault: initiatives become neutral
aliases, every node name and body is synthetic, and the export is then scanned
for the markers that would mean something leaked (`scratchpad/anon.py` exits
non-zero if any survive). Never shoot this against a live vault — the real
initiative names are client names.

Three stills shown together rather than a carousel: a carousel hides two of the
three behind interaction, and the shots are the point of the page.

Source formats were 8.4 MB of GIF and 2.2 MB of PNG. The whole set of six
images is 292 KB.
