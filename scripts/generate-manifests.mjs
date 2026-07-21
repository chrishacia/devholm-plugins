import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pluginCatalog } from './catalog-data.mjs';

const rootDir = process.cwd();

for (const plugin of pluginCatalog) {
  const manifest = {
    pluginId: plugin.pluginId,
    displayName: plugin.displayName,
    version: plugin.version,
    summary: plugin.summary,
    description: plugin.description,
    packageStatus: plugin.packageStatus,
    runtimeInstallSupported: plugin.runtimeInstallSupported,
    bundledFallbackRequired: plugin.bundledFallbackRequired,
    publisher: plugin.publisher,
    source: plugin.source,
    permissions: plugin.permissions,
    lifecycle: plugin.lifecycle,
    migration: plugin.migration,
    surfaces: plugin.surfaces,
    presentation: plugin.presentation,
    artifact: plugin.artifact,
  };

  const manifestPath = path.join(rootDir, plugin.manifestPath);
  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
}

console.log(`Generated ${pluginCatalog.length} source manifests`);