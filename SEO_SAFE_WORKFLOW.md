# SEO SAFE WORKFLOW
## Jean Louis David MX

Date: 2026-03-06
Status: active operating guide
Scope: this project, reusable for other SEO-sensitive sites

---

## Why this file exists

This site already ranks on page 1 for important queries.
That means every technical change must protect existing SEO signals first.

This document is the operating rulebook for:
- daily work on this repo
- safe refactors
- content or pricing updates
- multilingual SEO validation
- future work on other sites with the same risk profile

---

## Non-negotiable Rules

1. Work on `dev` first.
2. Never edit `main` directly.
3. Merge `dev -> main` only after validation.
4. Do not change SEO-critical elements unless the task explicitly requires it.
5. If a change touches rendering, verify generated HTML in `dist/`.
6. No direct production-risk SEO changes without checking canonical, hreflang, indexability, and visible content.

---

## Branch Workflow

### Standard sequence

1. Check current branch.
2. Switch to `dev`.
3. Make changes only on `dev`.
4. Run validation.
5. Commit and push `dev`.
6. Verify preview.
7. Merge to `main` only after explicit go-ahead.
8. Push `main`.
9. Verify production pages after deploy.

### Git commands

```bash
git branch --show-current
git checkout dev
git status --short
git add <files>
git commit -m "Clear commit message"
git push origin dev
git checkout main
git merge --no-ff dev
git push origin main
```

---

## SEO-Critical Files

These files can impact rankings even when the visible design does not change:

- `src/lib/seo.ts`
- `src/lib/i18n.ts`
- `src/lib/mirror.ts`
- `src/components/MirroredDocument.astro`
- `src/pages/sitemap.xml.ts`
- `public/robots.txt`
- `src/pages/index.astro`
- `src/pages/[...slug].astro`
- `src/pages/[locale]/index.astro`
- `src/pages/[locale]/[...slug].astro`

If a task touches one of these files, treat it as SEO-sensitive by default.

---

## High-Risk Changes

Be extra careful with:

- page titles
- meta descriptions
- canonical URLs
- hreflang links
- `noindex` / robots directives
- sitemap generation
- internal linking
- H1 and page headings
- visible service names and location names
- translated URLs and translated navigation
- footer keyword rendering
- schema / JSON-LD
- body HTML injection and regex replacements

Any regression here can hurt rankings even if the UI looks correct.

---

## Safe Change Policy

### Allowed without special escalation

- price updates
- typo fixes
- contact detail changes
- layout fixes that do not alter core content meaning
- structured Astro refactors that preserve the final HTML signals

### Changes that require extra validation

- changing titles or descriptions
- changing URL structure
- changing language routing
- changing canonicals or hreflang
- removing content blocks
- replacing mirrored content with native Astro content
- modifying sitemap logic
- modifying robots rules

---

## Mandatory Validation Before Push

Run all of this on `dev` before pushing:

```bash
npm run build
npm run check
```

If the task is SEO-sensitive, also inspect output pages in `dist/`.

### Minimum HTML checks

Check these pages when relevant:

- `dist/index.html`
- `dist/servicios/index.html`
- `dist/sucursales/index.html`
- `dist/contacto/index.html`
- `dist/colecciones/index.html`
- `dist/en/...`
- `dist/fr/...`

### What to verify

- correct title
- correct meta description
- canonical exists and is correct
- `hreflang` links exist for ES / EN / FR
- no accidental `noindex`
- H1 or main heading still present
- important commercial copy still visible
- footer keywords still render correctly
- no broken internal links

---

## Fast SEO Smoke Test

Use these checks after major changes:

```bash
rg -n "canonical|hreflang|noindex|og:title|og:description" dist/index.html dist/en/index.html dist/fr/index.html
rg -n "footerKeywords|salon|peluquer|hair salon|coiffure" dist/index.html dist/en/index.html dist/fr/index.html
```

For route-specific work:

```bash
rg -n "canonical|hreflang|noindex" dist/servicios/index.html dist/en/servicios/index.html dist/fr/servicios/index.html
rg -n "canonical|hreflang|noindex" dist/colecciones/index.html dist/en/colecciones/index.html dist/fr/colecciones/index.html
```

---

## Content Protection Rules

When refactoring, preserve:

- service names exactly as approved
- location names exactly as approved
- high-performing copy already ranking in Google
- language-specific wording when already live
- page intent

Do not rewrite important commercial copy casually just because a cleaner sentence is possible.

If content must change, do it intentionally and document why.

---

## Multilingual Rules

Current locales:

- ES: `/`
- EN: `/en/`
- FR: `/fr/`

Always verify:

- route parity across languages
- matching canonical per locale
- matching hreflang cluster
- translated navigation labels
- translated SEO copy where expected

Do not assume EN/FR are safe just because ES works.

---

## Refactor Rules For Astro

This project is moving from mirrored WordPress HTML toward native Astro sections.
That is good for maintainability, but risky for SEO if done carelessly.

When replacing mirrored content with native Astro:

1. Preserve visible headings.
2. Preserve links.
3. Preserve key text blocks.
4. Preserve route and slug.
5. Preserve metadata behavior.
6. Preserve structured data when relevant.
7. Compare generated HTML before and after.

The goal is:
- better code
- same or stronger SEO signals

Not:
- cleaner code at the cost of lost rankings

---

## Preview And Production Validation

### On `dev`

After push:

- check preview routes manually
- hard refresh pages that were changed
- verify desktop and mobile
- verify ES / EN / FR if the page is multilingual

### On `main`

After merge and deploy:

- verify live production routes
- verify Google-facing title and description still match expectations
- verify no broken footer or hidden content regressions

---

## Recommended Commit Style

Use clear commit messages:

- `Update servicios prices`
- `Fix collections grid rendering`
- `Refactor contact page for Astro`
- `Document SEO-safe workflow`

Avoid vague messages like:

- `fix`
- `changes`
- `update site`

---

## Reusable Template For Other Sites

Copy this checklist into any SEO-sensitive project:

### Before change

- confirm branch
- identify SEO-critical files
- define affected routes
- define affected locales
- decide whether metadata changes are allowed

### During change

- preserve URLs
- preserve headings
- preserve internal links
- preserve canonical and hreflang logic
- preserve indexability

### Before push

- build passes
- type / check passes
- HTML output reviewed
- preview checked

### Before merge to main

- user approval received
- no unresolved SEO doubt
- no accidental metadata drift

### After production deploy

- live page renders correctly
- title and description still correct
- locale variants still valid
- noindex not introduced

---

## Project-Specific Notes For Jean Louis David MX

- rankings are already strong for important salon queries in CDMX
- avoid unnecessary title rewrites
- avoid unnecessary homepage copy rewrites
- preserve Santa Fe / Polanco commercial intent
- preserve multilingual route stability
- preserve footer keyword logic unless intentionally improved
- treat `MirroredDocument.astro` as a high-risk file

---

## Default Working Agreement

Unless explicitly told otherwise:

- start on `dev`
- validate on `dev`
- push `dev`
- wait for approval before merging to `main`

This is the default safe mode for this project.
