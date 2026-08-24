# DevHolm Plugin Marketplace

This repository publishes the GitHub Pages presentation layer for the DevHolm first-party plugin catalog.

Source of truth:
- `scripts/catalog-data.mjs` for canonical plugin metadata
- `marketplace.json` for the scaffold contract surface
- generated `dist/` output for Pages publication

Generated from canonical data:
- root catalog page
- plugin landing pages
- source package manifests
- published catalog JSON

Trust boundary:
- GitHub Pages is discovery and presentation only
- DevHolm remains the authority for digest verification, signature verification, publisher policy, and install authorization

Issue #102 status:
- Calendar, Gallery, and URL Shortener are the only first-party catalog entries
- artifact metadata remains planned and non-runtime
- no install-ready artifact data is fabricated

Documentation:
- docs/package-contract.md
- docs/validation.md
- docs/TESTING.md
- docs/artifact-signing-contract.md
- docs/pages-contract.md
- docs/catalog-schema.md
