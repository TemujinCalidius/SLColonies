import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'src', 'content');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DIST_DIR = path.join(ROOT, 'dist');

function readJson(name) {
  const full = path.join(CONTENT_DIR, name);
  return JSON.parse(fs.readFileSync(full, 'utf8'));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function routeToOutput(route) {
  if (route === '/') return path.join(DIST_DIR, 'index.html');
  return path.join(DIST_DIR, route.replace(/^\//, ''), 'index.html');
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, 'utf8');
}

function cleanDist() {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

function copyPublic() {
  if (fs.existsSync(PUBLIC_DIR)) {
    fs.cpSync(PUBLIC_DIR, DIST_DIR, { recursive: true });
  }
}

const meta = readJson('site_meta.json');
const pageCopy = readJson('page_copy.json');
const systems = readJson('systems.json');
const announcements = readJson('announcements.json');
const opportunities = readJson('forum_opportunities.json');
const research = readJson('research_signals.json');
const faq = readJson('faq.json');

const pages = [
  {
    key: 'home',
    route: '/',
    title: `${pageCopy.home.title} | ${meta.siteName}`,
    description: pageCopy.home.description,
    hero: pageCopy.home.hero,
    render: renderHome
  },
  {
    key: 'players',
    route: '/players/',
    title: `${pageCopy.players.title} | ${meta.siteName}`,
    description: pageCopy.players.description,
    hero: pageCopy.players.hero,
    render: renderPlayers
  },
  {
    key: 'world-builders',
    route: '/world-builders/',
    title: `${pageCopy.worldBuilders.title} | ${meta.siteName}`,
    description: pageCopy.worldBuilders.description,
    hero: pageCopy.worldBuilders.hero,
    render: renderWorldBuilders
  },
  {
    key: 'systems',
    route: '/systems/',
    title: `${pageCopy.systems.title} | ${meta.siteName}`,
    description: pageCopy.systems.description,
    hero: pageCopy.systems.hero,
    render: renderSystems
  },
  {
    key: 'community',
    route: '/community/',
    title: `${pageCopy.community.title} | ${meta.siteName}`,
    description: pageCopy.community.description,
    hero: pageCopy.community.hero,
    render: renderCommunity
  },
  {
    key: 'news',
    route: '/news/',
    title: `${pageCopy.news.title} | ${meta.siteName}`,
    description: pageCopy.news.description,
    hero: pageCopy.news.hero,
    render: renderNews
  },
  {
    key: 'faq',
    route: '/faq/',
    title: `${pageCopy.faq.title} | ${meta.siteName}`,
    description: pageCopy.faq.description,
    hero: pageCopy.faq.hero,
    render: renderFaq
  },
  {
    key: 'get-started',
    route: '/get-started/',
    title: `${pageCopy.getStarted.title} | ${meta.siteName}`,
    description: pageCopy.getStarted.description,
    hero: pageCopy.getStarted.hero,
    render: renderGetStarted
  }
];

function navMarkup(currentRoute) {
  return meta.navigation
    .map((item) => {
      const active = item.href === '/'
        ? currentRoute === '/'
        : currentRoute.startsWith(item.href);
      return `<a href="${item.href}"${active ? ' class="is-active" aria-current="page"' : ''}>${escapeHtml(item.label)}</a>`;
    })
    .join('\n');
}

function layout({ page, content }) {
  const canonical = `${meta.baseUrl.replace(/\/$/, '')}${page.route}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: meta.siteName,
    url: meta.baseUrl,
    description: meta.description
  };

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(page.title)}" />
  <meta property="og:description" content="${escapeHtml(page.description)}" />
  <meta property="og:url" content="${escapeHtml(canonical)}" />
  <meta property="og:image" content="${escapeHtml(meta.ogImage)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(page.title)}" />
  <meta name="twitter:description" content="${escapeHtml(page.description)}" />
  <link rel="canonical" href="${escapeHtml(canonical)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles/site.css" />
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
  <header class="site-header">
    <div class="page-wrap header-inner">
      <a class="brand" href="/">
        <span class="brand-mark">SLC</span>
        <span class="brand-copy">
          <strong>${escapeHtml(meta.siteName)}</strong>
          <span>${escapeHtml(meta.tagline)}</span>
        </span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav id="site-nav" class="nav-links" aria-label="Main navigation">
        ${navMarkup(page.route)}
      </nav>
      <div class="header-cta">
        <a class="btn btn-soft" href="/world-builders/">For Sim Owners</a>
        <a class="btn btn-primary" href="/get-started/">Start With SL Colonies</a>
      </div>
    </div>
  </header>

  <main class="page-wrap">
    ${heroMarkup(page.hero)}
    ${content}
  </main>

  <footer class="site-footer">
    <div class="page-wrap footer-grid">
      <div>
        <strong>${escapeHtml(meta.siteName)}</strong><br />
        <span>${escapeHtml(meta.tagline)}</span>
      </div>
      <div>
        <a href="/news/">News</a> · <a href="/community/">Community</a> · <a href="/faq/">FAQ</a> · <a href="/get-started/">Get Started</a>
      </div>
    </div>
  </footer>

  <script>
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('#site-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
    }
  </script>
</body>
</html>`;
}

function heroMarkup(hero) {
  return `<section class="hero">
    <div class="hero-grid">
      <div class="hero-copy">
        <div class="eyebrow">${escapeHtml(hero.eyebrow)}</div>
        <h1>${escapeHtml(hero.headline)}</h1>
        <p>${escapeHtml(hero.body)}</p>
        ${hero.primaryCta ? `<div class="cta-row"><a class="btn btn-primary" href="${hero.primaryCta.href}">${escapeHtml(hero.primaryCta.label)}</a>${hero.secondaryCta ? `<a class="btn btn-soft" href="${hero.secondaryCta.href}">${escapeHtml(hero.secondaryCta.label)}</a>` : ''}</div>` : ''}
      </div>
      <figure class="hero-media">
        <img src="${hero.image}" alt="${escapeHtml(hero.imageAlt || '')}" />
      </figure>
    </div>
  </section>`;
}

function renderCardGrid(items) {
  return `<div class="card-grid">${items
    .map((item) => `<article class="card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></article>`)
    .join('')}</div>`;
}

function renderHome() {
  const kpis = [
    { label: 'Tracked Announcements', value: String(announcements.length) },
    { label: 'Active System Modules', value: String(systems.length) },
    { label: 'Forum Opportunity Threads', value: String(opportunities.length) }
  ];

  const systemsPreview = systems.slice(0, 3).map((system) => `
    <article class="card">
      <span class="pill">${escapeHtml(system.category)}</span>
      <h3>${escapeHtml(system.name)}</h3>
      <p>${escapeHtml(system.description)}</p>
      <small>Player: ${escapeHtml(system.playerValue)}</small>
      <small>Builder: ${escapeHtml(system.builderValue)}</small>
    </article>
  `).join('');

  const announcementRows = announcements.slice(0, 5).map((item) => `
    <article class="news-row">
      <a href="${item.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a>
      <span class="right pill">${escapeHtml(item.type)}</span>
    </article>
  `).join('');

  return `
    <ul class="kpis">
      ${kpis.map((kpi) => `<li><strong>${escapeHtml(kpi.value)}</strong><span>${escapeHtml(kpi.label)}</span></li>`).join('')}
    </ul>

    <section class="section">
      <div class="section-head">
        <div class="eyebrow">Why SL Colonies</div>
        <h2>Built for Flexible Worlds, Not One Fixed Meta</h2>
      </div>
      ${renderCardGrid(pageCopy.home.why)}
    </section>

    <section class="section">
      <div class="section-head">
        <div class="eyebrow">How It Works</div>
        <h2>Launch Fast, Then Expand</h2>
      </div>
      <div class="timeline">
        ${pageCopy.home.howItWorks.map((step) => `<article class="timeline-item"><strong>${escapeHtml(step.step)} — ${escapeHtml(step.title)}</strong><p>${escapeHtml(step.body)}</p></article>`).join('')}
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div class="eyebrow">Systems Preview</div>
        <h2>Core Modules You Can Activate Today</h2>
      </div>
      <div class="card-grid">${systemsPreview}</div>
    </section>

    <section class="section split">
      <div>
        <div class="section-head">
          <div class="eyebrow">Forum Pulse</div>
          <h2>Recent SL Colonies Announcements</h2>
          <p>Sourced from your local herald snapshot.</p>
        </div>
        <div class="news-list">${announcementRows}</div>
      </div>
      <aside class="callout">
        <h3>Research Data Status</h3>
        <p><strong>Mode:</strong> ${escapeHtml(research.status)}</p>
        <p>${escapeHtml(research.reason)}</p>
        <p>This site copy is grounded in your latest local forum and intel snapshots to avoid invented claims.</p>
      </aside>
    </section>

    <section class="section callout">
      <h2>${escapeHtml(pageCopy.home.finalCta.title)}</h2>
      <p>${escapeHtml(pageCopy.home.finalCta.body)}</p>
      <div class="cta-row">
        <a class="btn btn-primary" href="${pageCopy.home.finalCta.button.href}">${escapeHtml(pageCopy.home.finalCta.button.label)}</a>
        <a class="btn btn-soft" href="/players/">For Players</a>
        <a class="btn btn-soft" href="/community/">Join Community</a>
      </div>
    </section>
  `;
}

function renderPlayers() {
  return `
    <section class="section">
      <div class="section-head">
        <div class="eyebrow">Player Loop</div>
        <h2>Your Progression Path</h2>
      </div>
      <div class="timeline">
        ${pageCopy.players.journey.map((step) => `<article class="timeline-item"><strong>${escapeHtml(step.title)}</strong><p>${escapeHtml(step.body)}</p></article>`).join('')}
      </div>
    </section>

    <section class="section split">
      <div class="note">
        <h3>Common Onboarding Questions</h3>
        <ul>
          ${research.observations.onboardingQuestions.map((q) => `<li>${escapeHtml(q)}</li>`).join('')}
        </ul>
      </div>
      <div class="note">
        <h3>Community Highlights</h3>
        <ul>
          ${research.observations.communityHighlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div class="eyebrow">Visual Worlds</div>
        <h2>Player Life Across Different Regions</h2>
      </div>
      <div class="image-grid">
        <figure class="shot"><img src="/images/section-6-1.jpg" alt="Landscape view" /><figcaption>High-fidelity environment storytelling.</figcaption></figure>
        <figure class="shot"><img src="/images/Farm_001-Bob-Perry.png" alt="Farm region" /><figcaption>Farming loops tied to social progression.</figcaption></figure>
        <figure class="shot"><img src="/images/Village1_001-Bob-Perry.png" alt="Village region" /><figcaption>Village spaces designed for repeat interaction.</figcaption></figure>
      </div>
    </section>
  `;
}

function renderWorldBuilders() {
  return `
    <section class="section">
      <div class="section-head">
        <div class="eyebrow">Builder Advantages</div>
        <h2>Operational Control Without Killing Creativity</h2>
      </div>
      ${renderCardGrid(pageCopy.worldBuilders.benefits)}
    </section>

    <section class="section">
      <div class="section-head">
        <div class="eyebrow">Launch Blueprint</div>
        <h2>Practical Region Rollout</h2>
      </div>
      <table class="simple-table">
        <thead>
          <tr><th>Phase</th><th>Goal</th><th>Output</th></tr>
        </thead>
        <tbody>
          <tr><td>Week 1</td><td>Core module setup</td><td>HUD + baseline gathering loop live</td></tr>
          <tr><td>Week 2</td><td>Craft chain activation</td><td>Player specializations emerge</td></tr>
          <tr><td>Week 3</td><td>Trade and event layer</td><td>Community-led economy and social loops</td></tr>
          <tr><td>Week 4</td><td>Optimization pass</td><td>Adjusted pacing based on player behavior</td></tr>
        </tbody>
      </table>
    </section>

    <section class="section callout">
      <h3>Need a custom rollout strategy?</h3>
      <p>Use a staged deployment and tune scarcity, craft depth, and event cadence to your region identity.</p>
      <div class="cta-row">
        <a class="btn btn-primary" href="/get-started/">Plan Your Launch</a>
      </div>
    </section>
  `;
}

function renderSystems() {
  const rows = systems.map((system) => `
    <article class="card">
      <span class="pill">${escapeHtml(system.category)}</span>
      <h3>${escapeHtml(system.name)}</h3>
      <p>${escapeHtml(system.description)}</p>
      <small>Player value: ${escapeHtml(system.playerValue)}</small>
      <small>Builder value: ${escapeHtml(system.builderValue)}</small>
    </article>
  `).join('');

  return `
    <section class="section">
      <div class="section-head">
        <div class="eyebrow">Module Library</div>
        <h2>Compose the Experience You Want</h2>
      </div>
      <div class="card-grid">${rows}</div>
    </section>

    <section class="section">
      <div class="section-head">
        <div class="eyebrow">Flexibility Matrix</div>
        <h2>Player + Builder Outcomes</h2>
      </div>
      <table class="simple-table">
        <thead>
          <tr><th>Module</th><th>Player Outcome</th><th>Builder Outcome</th></tr>
        </thead>
        <tbody>
          ${systems.map((system) => `<tr><td>${escapeHtml(system.name)}</td><td>${escapeHtml(system.playerValue)}</td><td>${escapeHtml(system.builderValue)}</td></tr>`).join('')}
        </tbody>
      </table>
    </section>
  `;
}

function renderCommunity() {
  return `
    <section class="section">
      <div class="section-head">
        <div class="eyebrow">Screenshot Gallery</div>
        <h2>Moments That Drive Storytelling</h2>
      </div>
      <div class="image-grid">
        <figure class="shot"><img src="/images/Dock_001-Bob-Perry.png" alt="Dock scene" /><figcaption>Harbor routes and social trade points.</figcaption></figure>
        <figure class="shot"><img src="/images/Farm_001-Bob-Perry.png" alt="Farm scene" /><figcaption>Daily farming loops with roleplay potential.</figcaption></figure>
        <figure class="shot"><img src="/images/Village1_001-Bob-Perry.png" alt="Village scene" /><figcaption>Village economies built by player interaction.</figcaption></figure>
        <figure class="shot"><img src="/images/Community.png" alt="Community visual" /><figcaption>Community-first progression and shared goals.</figcaption></figure>
        <figure class="shot"><img src="/images/World-Builders.png" alt="Builders visual" /><figcaption>Builder creativity expressed through system tuning.</figcaption></figure>
        <figure class="shot"><img src="/images/Player-Economy.png" alt="Player economy visual" /><figcaption>Trade loops that reward collaboration.</figcaption></figure>
      </div>
    </section>

    <section class="section split">
      <div class="note">
        <h3>What Community Signals Show</h3>
        <ul>${research.observations.communityHighlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </div>
      <div class="note">
        <h3>Top Forum Conversation Angles</h3>
        <ul>${opportunities.slice(0, 4).map((item) => `<li><a href="${item.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a> — ${escapeHtml(item.angle)}</li>`).join('')}</ul>
      </div>
    </section>
  `;
}

function renderNews() {
  return `
    <section class="section">
      <div class="section-head">
        <div class="eyebrow">Latest Announcements Snapshot</div>
        <h2>SL Colonies Updates</h2>
      </div>
      <div class="news-list">
        ${announcements.map((item) => `<article class="news-row"><a href="${item.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a><span class="right pill">${escapeHtml(item.type)}</span></article>`).join('')}
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div class="eyebrow">Second Life Forum Opportunities</div>
        <h2>High-Leverage Threads to Engage</h2>
      </div>
      <table class="simple-table">
        <thead>
          <tr><th>Thread</th><th>Score</th><th>Priority</th><th>Suggested Angle</th></tr>
        </thead>
        <tbody>
          ${opportunities.map((item) => `<tr><td><a href="${item.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a></td><td>${escapeHtml(item.score)}</td><td>${escapeHtml(item.priority)}</td><td>${escapeHtml(item.angle)}</td></tr>`).join('')}
        </tbody>
      </table>
    </section>

    <section class="section callout">
      <h3>Research Integrity Note</h3>
      <p>Live API pull was attempted first. Current build uses locally-ingested forum and intel snapshots due external DNS limitations in this execution environment.</p>
      <p><strong>Sources:</strong></p>
      <ul>
        ${research.sourceFiles.map((file) => `<li>${escapeHtml(file)}</li>`).join('')}
      </ul>
    </section>
  `;
}

function renderFaq() {
  return `
    <section class="section">
      <div class="section-head">
        <div class="eyebrow">Answers</div>
        <h2>Common Questions</h2>
      </div>
      <div class="card-grid">
        ${faq.map((item) => `<article class="card"><h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p></article>`).join('')}
      </div>
    </section>
  `;
}

function renderGetStarted() {
  return `
    <section class="section split">
      <article class="note">
        <h3>Player Track</h3>
        <ul>
          <li>Create your Second Life avatar and complete movement basics.</li>
          <li>Register your SL Colonies account and obtain HUD + meter.</li>
          <li>Run your first gather-craft-trade loop in a live region.</li>
          <li>Join community events to accelerate progression and contacts.</li>
        </ul>
      </article>
      <article class="note">
        <h3>World Builder Track</h3>
        <ul>
          <li>Define your region identity and progression goals.</li>
          <li>Activate core systems and configure economy pacing.</li>
          <li>Plan first-month event cadence and social loops.</li>
          <li>Use feedback to tune retention and content priorities.</li>
        </ul>
      </article>
    </section>

    <section class="section callout">
      <h3>Action Links</h3>
      <p>Use these channels to move from planning to implementation.</p>
      <div class="cta-row">
        <a class="btn btn-primary" href="${meta.contact.website}" target="_blank" rel="noopener noreferrer">Visit Main Website</a>
        <a class="btn btn-soft" href="${meta.contact.forum}" target="_blank" rel="noopener noreferrer">Open Forum</a>
        <a class="btn btn-soft" href="${meta.contact.store}" target="_blank" rel="noopener noreferrer">Start Journey Guide</a>
      </div>
    </section>
  `;
}

function buildSitemap() {
  const urls = pages
    .map((page) => `  <url><loc>${meta.baseUrl.replace(/\/$/, '')}${page.route}</loc></url>`)
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  writeFile(path.join(DIST_DIR, 'sitemap.xml'), sitemap);
}

function run() {
  cleanDist();
  copyPublic();

  for (const page of pages) {
    const html = layout({
      page,
      content: page.render()
    });
    writeFile(routeToOutput(page.route), html);
  }

  buildSitemap();
  console.log(`Built ${pages.length} pages to ${DIST_DIR}`);
}

run();
