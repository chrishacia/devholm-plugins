import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pluginCatalog } from './catalog-data.mjs';

const rootDir = process.cwd();
const marketplace = JSON.parse(await readFile(path.join(rootDir, 'marketplace.json'), 'utf8'));
const errors = [];

if (marketplace.schemaVersion !== '1.0.0-skeleton') {
  errors.push('schemaVersion must remain 1.0.0-skeleton for source catalog');
}

if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length !== 3) {
  errors.push('marketplace.json must contain exactly three first-party plugins');
}

if (marketplace.sourceOfTruth !== 'scripts/catalog-data.mjs') {
  errors.push('sourceOfTruth must be scripts/catalog-data.mjs');
}

const canonicalById = new Map(pluginCatalog.map((entry) => [entry.pluginId, entry]));

const seen = new Set();
for (const plugin of marketplace.plugins ?? []) {
  if (seen.has(plugin.pluginId)) {
    errors.push(`duplicate pluginId ${plugin.pluginId}`);
  }
  seen.add(plugin.pluginId);

  const canonical = canonicalById.get(plugin.pluginId);
  if (!canonical) {
    errors.push(`no canonical source entry exists for ${plugin.pluginId}`);
    continue;
  }

  if (plugin.displayName !== canonical.displayName) errors.push(`displayName mismatch for ${plugin.pluginId}`);
  if (plugin.description !== canonical.description) errors.push(`description mismatch for ${plugin.pluginId}`);
  if (plugin.publisher?.publisherId !== canonical.publisher.publisherId) errors.push(`publisher mismatch for ${plugin.pluginId}`);
  if (plugin.landingPage !== canonical.landingPage) errors.push(`landing page mismatch for ${plugin.pluginId}`);

  for (const field of ['path', 'manifestPath', 'readmePath', 'landingPage']) {
    if (typeof plugin[field] !== 'string' || !plugin[field].startsWith('plugins/')) {
      errors.push(`invalid ${field} for ${plugin.pluginId}`);
    }
  }

  if (plugin.packageStatus !== 'scaffold-only') errors.push(`packageStatus must be scaffold-only for ${plugin.pluginId}`);
  if (plugin.runtimeInstallSupported !== false) errors.push(`runtimeInstallSupported must be false for ${plugin.pluginId}`);
  if (plugin.bundledFallbackRequired !== true) errors.push(`bundledFallbackRequired must be true for ${plugin.pluginId}`);
  if (plugin.artifact?.readiness !== 'planned') errors.push(`artifact.readiness must be planned for ${plugin.pluginId}`);
  if (plugin.artifact?.immutable !== false) errors.push(`artifact.immutable must be false for ${plugin.pluginId}`);
  if (plugin.artifact?.signature?.status !== 'not-provided') errors.push(`artifact.signature.status must be not-provided for ${plugin.pluginId}`);
  if (plugin.artifact?.artifactUrl !== undefined) errors.push(`artifact.artifactUrl must be omitted for ${plugin.pluginId}`);
  if (plugin.artifact?.sha256 !== undefined) errors.push(`artifact.sha256 must be omitted for ${plugin.pluginId}`);
}

for (const canonical of pluginCatalog) {
  const manifestPath = path.join(rootDir, canonical.manifestPath);
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

  if (manifest.pluginId !== canonical.pluginId) errors.push(`manifest pluginId mismatch for ${canonical.pluginId}`);
  if (manifest.version !== canonical.version) errors.push(`manifest version mismatch for ${canonical.pluginId}`);
  if (manifest.packageStatus !== canonical.packageStatus) errors.push(`manifest packageStatus mismatch for ${canonical.pluginId}`);
  if (manifest.runtimeInstallSupported !== canonical.runtimeInstallSupported) errors.push(`manifest runtimeInstallSupported mismatch for ${canonical.pluginId}`);
  if (manifest.bundledFallbackRequired !== canonical.bundledFallbackRequired) errors.push(`manifest bundledFallbackRequired mismatch for ${canonical.pluginId}`);
  if (manifest.publisher?.publisherId !== canonical.publisher.publisherId) errors.push(`manifest publisher mismatch for ${canonical.pluginId}`);
  if (manifest.artifact?.format !== canonical.artifact.format) errors.push(`manifest artifact format mismatch for ${canonical.pluginId}`);
  if (manifest.artifact?.readiness !== canonical.artifact.readiness) errors.push(`manifest artifact readiness mismatch for ${canonical.pluginId}`);
  if (manifest.artifact?.immutable !== canonical.artifact.immutable) errors.push(`manifest artifact immutability mismatch for ${canonical.pluginId}`);
  if (manifest.artifact?.signature?.status !== canonical.artifact.signature.status) errors.push(`manifest artifact signature mismatch for ${canonical.pluginId}`);
  if (manifest.summary !== canonical.summary) errors.push(`manifest summary mismatch for ${canonical.pluginId}`);
  if (manifest.description !== canonical.description) errors.push(`manifest description mismatch for ${canonical.pluginId}`);
  if (manifest.source?.repositoryUrl !== canonical.source.repositoryUrl) errors.push(`manifest source repository mismatch for ${canonical.pluginId}`);
  if (manifest.source?.ref !== canonical.source.ref) errors.push(`manifest source ref mismatch for ${canonical.pluginId}`);
  if (JSON.stringify(manifest.permissions) !== JSON.stringify(canonical.permissions)) errors.push(`manifest permissions mismatch for ${canonical.pluginId}`);
  if (JSON.stringify(manifest.lifecycle) !== JSON.stringify(canonical.lifecycle)) errors.push(`manifest lifecycle mismatch for ${canonical.pluginId}`);
  if (JSON.stringify(manifest.migration) !== JSON.stringify(canonical.migration)) errors.push(`manifest migration mismatch for ${canonical.pluginId}`);
  if (JSON.stringify(manifest.surfaces) !== JSON.stringify(canonical.surfaces)) errors.push(`manifest surfaces mismatch for ${canonical.pluginId}`);
  if (JSON.stringify(manifest.presentation) !== JSON.stringify(canonical.presentation)) errors.push(`manifest presentation mismatch for ${canonical.pluginId}`);
}

if (errors.length > 0) {
  console.error(errors.map((entry) => `- ${entry}`).join('\n'));
  process.exit(1);
}

console.log(`Validated ${marketplace.plugins.length} marketplace entries`);
