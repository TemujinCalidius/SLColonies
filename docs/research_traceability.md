# Research Traceability

## Live API Attempt
- Target credential source: `~/.openclaw/credentials/discourse.json`
- Result in this runtime: DNS resolution failure for configured host (`forum.slcolonies.com`)
- Fallback mode used: `fallback_local_snapshot`

## Local Source Files Used
1. `workspace/slcolonies-site/data/herald.json`
2. `workspace/slcolonies-site/data/pages.json`
3. `workspace-intel/reports/intel/2026-03-03_growth_autonomy_phase1.md`
4. `workspace-intel/reports/signals/intel.jsonl`

## How Sources Drove Copy
- Home positioning and core value language:
  - Derived from `pages.json` text blocks (survival/farming/breeding/crafting/trading, world-builder emphasis, community economy).
- News page announcement list:
  - Derived from `herald.json` item titles + links.
- Community and engagement sections:
  - Derived from forum thread opportunities table in the 2026-03-03 intel report.
- FAQ onboarding answers:
  - Derived from `Start Your Journey` text blocks in `pages.json` and recurring onboarding references.

## Placeholders / Assumptions Remaining
- Live Discourse category/topic counts are snapshot-based until DNS/API access is restored.
- Contact links (Discord invite in `site_meta.json`) may need exact production URL.
- No direct lead form backend included (static-site safe default).

## Validation Goal
All major claims on the site map to one of the listed local source files to avoid fabricated marketing assertions.
