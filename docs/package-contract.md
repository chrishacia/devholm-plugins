# Marketplace Package Contract (Scaffold Phase)

This document defines the docs/static package contract for the DevHolm marketplace scaffold.

Current phase status:
- static scaffold only
- runtime marketplace install is not enabled
- bundled fallback in DevHolm remains required
- Phase 5A catalog/artifact contract fields are metadata-only

## Package root shape

Packages are represented under:

- plugins/<plugin-id>

Examples in this scaffold:
- plugins/calendar
- plugins/gallery
- plugins/url-shortener

## Required files today

Current scaffold expectations:
- README.md
- marketplace.json
- index.html
- docs/github-pages.md
- plugins/<plugin-id>/README.md
- plugins/<plugin-id>/index.html

## Future expected files

Future phases may add package artifacts, including:
- plugins/<plugin-id>/manifest.json
- plugins/<plugin-id>/docs/ or plugins/<plugin-id>/doc.html
- plugins/<plugin-id>/assets/
- plugins/<plugin-id>/fixtures/

These remain placeholders until a later phase explicitly introduces validation/install behavior.

## manifest.json placeholder policy

manifest.json is a future placeholder in this phase.

Meaning:
- a path may be documented in metadata
- the manifest file is not required yet in this scaffold pass
- no runtime install behavior is implied by placeholder references

## README expectations

Each plugin README should:
- describe plugin purpose at a high level
- state scaffold-only status
- state runtime source currently remains in DevHolm
- state runtime installation from marketplace repo is not enabled yet
- list expected future package contents

## Landing page expectations

Each plugin landing page should:
- be a minimal static page
- link back to marketplace root
- indicate scaffold-only status
- avoid external dependencies

## docs/assets/fixtures expectations

Optional plugin directories for future phases:
- docs/ for deeper package documentation
- assets/ for screenshots and static media
- fixtures/ for sample data and non-runtime examples

In this phase, these are expectations only.

## Package status meanings

Current status values:
- scaffold-only: package path and docs exist, runtime package behavior is not enabled

## Runtime install status meanings

Current status values:
- runtimeInstallSupported: false means DevHolm does not install plugins from this repository yet

## Phase 5A catalog contract fields

`marketplace.json` now includes preparatory contract fields used by DevHolm-side validation:

- installReadiness
  - catalog-contract-ready in this phase
  - production-eligible is not used in this repository yet
- publisher
  - first-party metadata classification only
- artifact
  - format: tar.gz
  - readiness: planned
  - immutable: false
  - signature.status: not-provided

In this phase, planned artifacts intentionally omit:

- artifactUrl
- sha256 checksum
- compressed and uncompressed size declarations

These values must not be fabricated before real immutable artifacts exist.

## Issue #66 signing contract reference

The first-party artifact signing contract is documented in:

- docs/artifact-signing-contract.md

This reference documents canonical payload expectations, signature envelope fields, trusted key policy, rotation and revocation behavior, and private-key handling boundaries for future production-eligible artifacts.

## Immutable artifact policy (future-ready)

When a plugin is promoted to production-eligible in a later phase, artifact metadata must include:

- immutable artifact URL (HTTPS)
- SHA-256 digest
- semver-aligned version identity

Mutable branch references are not valid production artifact identities.

## Bundled fallback expectations

Current status values:
- bundledFallbackRequired: true means stock plugin behavior still depends on bundled fallback in DevHolm

## What scaffold-only means

scaffold-only means:
- repository structure and metadata are documented
- static pages and docs are present
- no runtime install/fetch behavior is enabled
- no lifecycle/migration/runtime ownership behavior is changed
- no private signing keys are stored in this repository

## Explicit non-goals

This pass does not:
- enable runtime marketplace installation
- add runtime fetch/install logic
- add admin endpoint behavior changes
- add lifecycle or migration behavior changes
- publish runtime-installable artifacts
- add package publishing automation
- add checksum/signature enforcement in this repository's current scaffold entries
- claim production marketplace install readiness
- add private-key signing material
