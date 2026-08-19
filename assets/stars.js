// Live star counts, as a progressive enhancement.
//
// The numbers are already in the markup, so the page is correct before this
// script runs and correct if it never does — no layout shift, no spinner, no
// empty slot. One request covers every product: the org listing, not seven
// per-repo calls. Unauthenticated GitHub allows 60 requests an hour per
// visitor IP, which a business card will never approach.
//
// Any failure — offline, rate limited, GitHub down — leaves the baked numbers
// exactly where they are. That is the whole error path.

const ORG = 'LamantinAI'

async function refreshStars() {
  const slots = document.querySelectorAll('[data-stars]')
  if (!slots.length) return

  let repos
  try {
    const r = await fetch(`https://api.github.com/orgs/${ORG}/repos?per_page=100&type=public`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!r.ok) return                       // 403 = rate limited; keep what we shipped
    repos = await r.json()
  } catch (_) {
    return                                   // offline, blocked, CORS — same answer
  }
  if (!Array.isArray(repos)) return

  const stars = new Map(repos.map((x) => [x.name, x.stargazers_count]))
  for (const el of slots) {
    const n = stars.get(el.dataset.stars)
    if (typeof n !== 'number') continue
    // a repo that has picked up its first star should start showing one, and
    // one that somehow has none should stop — the separator lives in here too,
    // so toggling the wrapper never leaves a dot hanging on its own
    el.hidden = n === 0
    const slot = el.querySelector('.n')
    const shown = `★ ${n.toLocaleString('en')}`
    if (slot && slot.textContent !== shown) slot.textContent = shown
  }
}

refreshStars()
