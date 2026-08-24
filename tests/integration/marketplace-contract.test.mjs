import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const marketplace = JSON.parse(readFileSync(path.join(rootDir, 'marketplace.json'), 'utf8'));

assert.equal(marketplace.schemaVersion, '1.0.0-skeleton');
assert.equal(marketplace.runtimeInstallSupported, false);
assert.equal(marketplace.bundledFallbackRequired, true);
assert.equal(marketplace.plugins.length, 3);

const expected = ['calendar', 'gallery', 'url-shortener'];
assert.deepEqual(
  marketplace.plugins.map((entry) => entry.pluginId).sort(),
  expected
);

for (const plugin of marketplace.plugins) {
  assert.equal(plugin.path, `plugins/${plugin.pluginId}`);
  assert.equal(plugin.manifestPath, `plugins/${plugin.pluginId}/manifest.json`);
  assert.equal(plugin.readmePath, `plugins/${plugin.pluginId}/README.md`);
  assert.equal(plugin.landingPage, `plugins/${plugin.pluginId}/index.html`);
  assert.equal(plugin.packageStatus, 'scaffold-only');
  assert.equal(plugin.runtimeInstallSupported, false);
  assert.equal(plugin.bundledFallbackRequired, true);
  assert.equal(plugin.publisher.publisherId, 'devholm-first-party');
  assert.equal(plugin.publisher.classification, 'first-party');
  assert.equal(plugin.artifact.format, 'tar.gz');
  assert.equal(plugin.artifact.readiness, 'planned');
  assert.equal(plugin.artifact.immutable, false);
  assert.equal(plugin.artifact.signature.status, 'not-provided');
  assert.ok(!('artifactUrl' in plugin.artifact) || plugin.artifact.artifactUrl === undefined);
  assert.ok(!('sha256' in plugin.artifact) || plugin.artifact.sha256 === undefined);
}

console.log('Marketplace contract test passed');
