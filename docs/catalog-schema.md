# Marketplace Catalog Schema

`marketplace.json` is the canonical source for the Pages catalog.

In practice, the editable source data lives in `scripts/catalog-data.mjs`; the build step generates the published `dist/marketplace.json` catalog and the HTML pages from that source.

Top-level fields:
- `name`
- `schemaVersion`
- `catalogContractVersion`
- `artifactSigningContractVersion`
- `status`
- `generated`
- `artifactHostModel`
- `runtimeArtifactFetchEnabled`
- `runtimeInstallSupported`
- `bundledFallbackRequired`
- `plugins`

Each plugin entry contains presentation metadata and a planned artifact placeholder.
