import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pluginCatalog } from './catalog-data.mjs';

const devholmRoot = process.env.DEVHOLM_SOURCE_PATH ?? '/Users/sevensparxx/dev/devholm.com';
const canonicalFixturePath = path.join(
  devholmRoot,
  'contracts/marketplace-first-party-canonical.json'
);

const canonicalFixture = JSON.parse(await readFile(canonicalFixturePath, 'utf8'));
const canonicalById = new Map(canonicalFixture.plugins.map((entry) => [entry.pluginId, entry]));

const errors = [];

for (const plugin of pluginCatalog) {
  const canonical = canonicalById.get(plugin.pluginId);
  if (!canonical) {
    errors.push(`${plugin.pluginId}: missing from devholm canonical fixture`);
    continue;
  }

  if (canonical.pluginId !== plugin.pluginId) errors.push(`${plugin.pluginId}: id mismatch (${canonical.pluginId})`);
  if (canonical.displayName !== plugin.displayName) errors.push(`${plugin.pluginId}: name mismatch (${canonical.displayName})`);
  if (canonical.version !== plugin.version) errors.push(`${plugin.pluginId}: version mismatch (${canonical.version})`);
  if (canonical.description !== plugin.description) errors.push(`${plugin.pluginId}: description mismatch`);

  const catalogAdminPages = [...plugin.surfaces.adminPageHrefs].sort();
  const catalogPublicRoutes = [...plugin.surfaces.publicRouteExtensionIds].sort();
  const adminPages = [...(canonical.surfaces?.adminPageHrefs ?? [])].sort();
  const publicRoutes = [...(canonical.surfaces?.publicRouteExtensionIds ?? [])].sort();

  if (JSON.stringify(adminPages) !== JSON.stringify(catalogAdminPages)) {
    errors.push(`${plugin.pluginId}: adminPageHrefs mismatch`);
  }
  if (JSON.stringify(publicRoutes) !== JSON.stringify(catalogPublicRoutes)) {
    errors.push(`${plugin.pluginId}: publicRouteExtensionIds mismatch`);
  }

  const canonicalPermissionKeys = [...canonical.permissions.permissionKeys].sort();
  const canonicalPermissionScopes = [...canonical.permissions.scopes].sort();
  const canonicalCapabilities = [...canonical.permissions.capabilities].sort();

  const pluginPermissionKeys = [...plugin.permissions.permissionKeys].sort();
  const pluginPermissionScopes = [...plugin.permissions.scopes].sort();
  const pluginCapabilities = [...(plugin.permissions.capabilities ?? [])].sort();

  if (JSON.stringify(canonicalPermissionKeys) !== JSON.stringify(pluginPermissionKeys)) {
    errors.push(`${plugin.pluginId}: permissionKeys mismatch`);
  }
  if (JSON.stringify(canonicalPermissionScopes) !== JSON.stringify(pluginPermissionScopes)) {
    errors.push(`${plugin.pluginId}: permission scopes mismatch`);
  }
  if (JSON.stringify(canonicalCapabilities) !== JSON.stringify(pluginCapabilities)) {
    errors.push(`${plugin.pluginId}: capabilities mismatch`);
  }

  if ((canonical.migration?.count ?? 0) !== (plugin.migration?.count ?? 0)) {
    errors.push(`${plugin.pluginId}: migration count mismatch`);
  }

  if (canonical.package?.subdirectory !== plugin.path) {
    errors.push(`${plugin.pluginId}: package subdirectory mismatch`);
  }
  if (canonical.package?.manifestPath !== plugin.manifestPath) {
    errors.push(`${plugin.pluginId}: manifest path mismatch`);
  }

  if (Boolean(canonical.lifecycle?.hasAfterInstall) !== Boolean(plugin.lifecycle?.hasAfterInstall)) {
    errors.push(`${plugin.pluginId}: lifecycle afterInstall mismatch`);
  }
  if (Boolean(canonical.lifecycle?.hasAfterUpgrade) !== Boolean(plugin.lifecycle?.hasAfterUpgrade)) {
    errors.push(`${plugin.pluginId}: lifecycle afterUpgrade mismatch`);
  }
  if (Boolean(canonical.lifecycle?.hasBeforeDisable) !== Boolean(plugin.lifecycle?.hasBeforeDisable)) {
    errors.push(`${plugin.pluginId}: lifecycle beforeDisable mismatch`);
  }
  if (Boolean(canonical.lifecycle?.hasBeforeUninstall) !== Boolean(plugin.lifecycle?.hasBeforeUninstall)) {
    errors.push(`${plugin.pluginId}: lifecycle beforeUninstall mismatch`);
  }
  if (Boolean(canonical.lifecycle?.hasPurge) !== Boolean(plugin.lifecycle?.hasPurge)) {
    errors.push(`${plugin.pluginId}: lifecycle purge mismatch`);
  }
}

if (errors.length > 0) {
  console.error(errors.map((entry) => `- ${entry}`).join('\n'));
  process.exit(1);
}

console.log(`Validated DevHolm parity for ${pluginCatalog.length} plugins from ${devholmRoot}`);
