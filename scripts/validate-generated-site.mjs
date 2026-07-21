import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pluginCatalog } from './catalog-data.mjs';

const rootDir = process.cwd();
const generated = JSON.parse(await readFile(path.join(rootDir, 'dist/marketplace.json'), 'utf8'));
const errors = [];

if (generated.schemaVersion !== '1') {
  errors.push('dist/marketplace.json schemaVersion must be 1');
}

if (!Array.isArray(generated.plugins) || generated.plugins.length !== pluginCatalog.length) {
  errors.push('dist/marketplace.json plugin count mismatch');
}

const byId = new Map(pluginCatalog.map((entry) => [entry.pluginId, entry]));
for (const plugin of generated.plugins ?? []) {
  const canonical = byId.get(plugin.pluginId);
  if (!canonical) {
    errors.push(`unexpected generated plugin ${plugin.pluginId}`);
    continue;
  }

  if (plugin.name !== canonical.displayName) errors.push(`generated name mismatch for ${plugin.pluginId}`);
  if (plugin.description !== canonical.description) errors.push(`generated description mismatch for ${plugin.pluginId}`);
  if (plugin.source?.repositoryUrl !== canonical.source.repositoryUrl) errors.push(`generated source repository mismatch for ${plugin.pluginId}`);
  if (plugin.source?.ref !== canonical.source.ref) errors.push(`generated source ref mismatch for ${plugin.pluginId}`);
  if (plugin.publisher?.publisherId !== canonical.publisher.publisherId) errors.push(`generated publisher mismatch for ${plugin.pluginId}`);
  if (plugin.artifact?.version !== canonical.version) errors.push(`generated artifact version mismatch for ${plugin.pluginId}`);
  if (plugin.artifact?.digest !== null) errors.push(`generated artifact digest must be null for ${plugin.pluginId}`);
  if (plugin.artifact?.signature !== null) errors.push(`generated artifact signature must be null for ${plugin.pluginId}`);
}

if (errors.length > 0) {
  console.error(errors.map((entry) => `- ${entry}`).join('\n'));
  process.exit(1);
}

console.log(`Validated generated catalog for ${generated.plugins.length} plugins`);
