import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pluginCatalog } from './catalog-data.mjs';
import './generate-manifests.mjs';

const rootDir = process.cwd();
const outDir = path.join(rootDir, 'dist');

await mkdir(outDir, { recursive: true });
await mkdir(path.join(outDir, 'plugins'), { recursive: true });
await mkdir(path.join(outDir, 'assets'), { recursive: true });

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function pluginCard(plugin) {
  return `
    <article class="card">
      <div class="eyebrow">${escapeHtml(plugin.publisher.classification)}</div>
      <h2><a href="${escapeHtml(plugin.landingPage)}">${escapeHtml(plugin.displayName)}</a></h2>
      <p>${escapeHtml(plugin.description)}</p>
      <dl>
        <div><dt>Version</dt><dd>${escapeHtml(plugin.version)}</dd></div>
        <div><dt>Package</dt><dd>${escapeHtml(plugin.path)}</dd></div>
        <div><dt>Artifact</dt><dd>${escapeHtml(plugin.artifact.format)} / ${escapeHtml(plugin.artifact.readiness)}</dd></div>
        <div><dt>Publisher</dt><dd>${escapeHtml(plugin.publisher.publisherId)}</dd></div>
      </dl>
      <p class="meta">Presentation only. DevHolm verifies trust, signatures, and install eligibility.</p>
    </article>`;
}

function pluginPage(plugin) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(plugin.displayName)} · DevHolm Marketplace</title>
    <meta name="description" content="${escapeHtml(plugin.description)}" />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <header class="site-header">
      <a href="/index.html" class="brand">DevHolm Marketplace</a>
      <nav aria-label="Marketplace navigation"><a href="/index.html">Catalog</a></nav>
    </header>
    <main class="page">
      <p class="eyebrow">${escapeHtml(plugin.pluginId)}</p>
      <h1>${escapeHtml(plugin.displayName)}</h1>
      <p class="lede">${escapeHtml(plugin.description)}</p>
      <section class="panel">
        <h2>Presentation</h2>
        <p>Version ${escapeHtml(plugin.version)} · ${escapeHtml(plugin.publisher.publisherId)} · ${escapeHtml(plugin.publisher.classification)}</p>
        <p>${escapeHtml(plugin.presentation.compatibility)}</p>
      </section>
      <section class="panel">
        <h2>Capabilities</h2>
        <ul>
          ${plugin.presentation.capabilitySummary.map((entry) => `<li>${escapeHtml(entry)}</li>`).join('')}
        </ul>
      </section>
      <section class="panel">
        <h2>Trust disclosure</h2>
        <p>${escapeHtml(plugin.presentation.trustDisclosure)}</p>
        <p>
          Immutable artifact: ${escapeHtml(plugin.artifact.readiness === 'available' ? plugin.artifact.artifactUrl ?? 'not yet published' : 'not yet published')}
        </p>
      </section>
      <section class="panel">
        <h2>Compatibility and surfaces</h2>
        <p>Package source: ${escapeHtml(plugin.source.sourceType)} · ${escapeHtml(plugin.source.repositoryUrl)} · ${escapeHtml(plugin.source.ref)}</p>
        <p>Admin pages: ${escapeHtml(plugin.surfaces.adminPageHrefs.join(', '))}</p>
        <p>Public routes: ${escapeHtml(plugin.surfaces.publicRouteExtensionIds.join(', ')) || 'none'}</p>
        <p>API paths: ${escapeHtml(plugin.surfaces.apiPaths.join(', ')) || 'none'}</p>
      </section>
      <section class="panel">
        <h2>Links</h2>
        <ul>
          <li><a href="${escapeHtml(plugin.readmePath)}">README</a></li>
          <li><a href="${escapeHtml(plugin.manifestPath)}">Manifest path</a></li>
          <li><a href="${escapeHtml(plugin.landingPage)}">Pages page</a></li>
        </ul>
      </section>
    </main>
  </body>
</html>`;
}

const catalog = {
  schemaVersion: '1',
  generatedAt: '2026-07-20T00:00:00.000Z',
  repository: 'chrishacia/devholm-plugins',
  plugins: pluginCatalog.map((plugin) => ({
    pluginId: plugin.pluginId,
    name: plugin.displayName,
    summary: plugin.description,
    description: plugin.description,
    source: plugin.source,
    publisher: plugin.publisher,
    presentation: {
      landingPage: plugin.landingPage,
      icon: `/assets/${plugin.pluginId}.svg`,
      screenshots: [`/assets/${plugin.pluginId}-hero.svg`],
    },
    compatibility: {
      devholm: '>=3.6.0',
      platforms: ['web', 'desktop'],
    },
    capabilities: plugin.presentation.capabilitySummary,
    permissions: plugin.permissions,
    lifecycle: plugin.lifecycle,
    migration: plugin.migration,
    surfaces: plugin.surfaces,
    artifact: {
      version: plugin.version,
      immutableReference: plugin.artifact.readiness === 'available' ? plugin.artifact.artifactUrl : null,
      digest: plugin.artifact.sha256 ?? null,
      signature: plugin.artifact.readiness === 'available' ? plugin.artifact.signature ?? null : null,
    },
  })),
};

await writeFile(path.join(outDir, 'marketplace.json'), JSON.stringify(catalog, null, 2) + '\n');
await writeFile(
  path.join(outDir, 'index.html'),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>DevHolm Plugin Marketplace</title>
    <meta name="description" content="Presentation-only GitHub Pages catalog for DevHolm first-party plugins." />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <header class="site-header">
      <div class="brand">DevHolm Marketplace</div>
      <nav aria-label="Marketplace navigation"><a href="#catalog">Catalog</a></nav>
    </header>
    <main class="page">
      <section class="hero">
        <p class="eyebrow">GitHub Pages catalog</p>
        <h1>First-party plugin catalog and landing pages</h1>
        <p class="lede">Presentation and discovery only. DevHolm remains the trust authority for digest, signature, and install verification.</p>
      </section>
      <section id="catalog" class="grid" aria-labelledby="catalog-title">
        <h2 id="catalog-title" class="sr-only">Catalog</h2>
        ${pluginCatalog.map(pluginCard).join('\n')}
      </section>
    </main>
  </body>
</html>`
);

await writeFile(
  path.join(outDir, 'styles.css'),
  `:root{color-scheme:light;--bg:#f7f5ef;--panel:#fffaf3;--text:#1f1a17;--muted:#655b54;--line:#e5d8c8;--accent:#7a4e2b;--accent2:#29434e}*{box-sizing:border-box}body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:linear-gradient(180deg,#faf7f1 0%,#f2ece2 100%);color:var(--text)}a{color:inherit}.site-header,.page{max-width:1120px;margin:0 auto;padding:24px}.site-header{display:flex;justify-content:space-between;align-items:center;gap:16px;position:sticky;top:0;background:rgba(247,245,239,.9);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}.brand{font-weight:800;letter-spacing:.04em;text-transform:uppercase}.hero{padding:48px 0 24px}.eyebrow{font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;color:var(--accent2);font-weight:700}.lede{font-size:1.1rem;max-width:65ch;color:var(--muted)}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;padding-bottom:48px}.card,.panel{background:var(--panel);border:1px solid var(--line);border-radius:20px;box-shadow:0 12px 28px rgba(31,26,23,.06);padding:20px}.card h2,.panel h2{margin:8px 0 12px}.card dl{display:grid;grid-template-columns:1fr;gap:8px;margin:16px 0 0}.card dt{font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}.card dd{margin:2px 0 0;font-weight:600}.meta{color:var(--muted);font-size:.92rem}.page{padding-bottom:56px}.page h1{font-size:clamp(2.6rem,7vw,4.8rem);line-height:1.02;max-width:14ch;margin:12px 0}.panel{margin:16px 0}.panel ul{margin:0;padding-left:20px}a:focus-visible{outline:3px solid var(--accent);outline-offset:3px}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}`
);

for (const plugin of pluginCatalog) {
  await mkdir(path.dirname(path.join(outDir, plugin.landingPage)), { recursive: true });
  await mkdir(path.dirname(path.join(outDir, plugin.readmePath)), { recursive: true });
  await writeFile(path.join(outDir, plugin.landingPage), pluginPage(plugin));
  await writeFile(
    path.join(outDir, plugin.readmePath),
    `# ${plugin.displayName}\n\nThis page is presentation-only for DevHolm GitHub Pages.\n\nDevHolm validates trust, digest, and signature before any install.\n`
  );
}

await writeFile(
  path.join(outDir, '404.html'),
  `<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Not found</title><link rel="stylesheet" href="/styles.css" /></head><body><main class="page"><h1>Not found</h1><p><a href="/index.html">Back to the catalog</a></p></main></body></html>`
);

console.log(`Built marketplace site in ${outDir}`);
