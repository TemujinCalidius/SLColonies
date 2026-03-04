# SL Colonies Web (Vercel Ready)

Game-focused marketing website for SL Colonies, built as a static site with editable JSON content and zero runtime dependencies.

## Project Path
`/Users/samuel/.openclaw/workspace/slcolonies-web-netlify`

## Stack
- Static HTML generation via Node (`scripts/build.mjs`)
- Shared CSS (`public/styles/site.css`)
- Content files in `src/content/*.json`
- Vercel deploy config (`vercel.json`)

## Quick Start
```bash
cd /Users/samuel/.openclaw/workspace/slcolonies-web-netlify
npm run build
```

Build output is written to `dist/`.

Optional local preview:
```bash
npm run dev
# then open http://127.0.0.1:4173
```

## Content Editing
Update these files and rebuild:
- `src/content/site_meta.json`
- `src/content/page_copy.json`
- `src/content/systems.json`
- `src/content/announcements.json`
- `src/content/forum_opportunities.json`
- `src/content/research_signals.json`
- `src/content/faq.json`

## SEO + Metadata
- Per-page title/description/canonical/OG tags generated in build script.
- `dist/sitemap.xml` generated during build.
- `public/robots.txt` copied to output.

## Vercel Deploy
1. Push this folder to a GitHub repo.
2. In Vercel: **Add New > Project > Import Git Repository**.
3. Build settings:
- Build command: `npm run build`
- Output directory: `dist`
4. Deploy.

`vercel.json` already includes these defaults.

## GitHub Commands
```bash
cd /Users/samuel/.openclaw/workspace/slcolonies-web-netlify
git init
git add .
git commit -m "Initial SL Colonies Netlify site"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## Research Source Notes
Live Discourse API fetch was attempted first. In this execution environment external DNS was unavailable, so this build uses your latest local forum/intel snapshots as the source of truth.
