# Scaffold Validation Guide

This document describes manual validation for the static marketplace scaffold.

## Scope

Validation is for docs/static scaffold only.

This does not validate runtime marketplace install behavior because runtime install is not enabled in this phase.

## Baseline file presence

Verify baseline files exist:
- README.md
- marketplace.json
- index.html
- docs/github-pages.md
- plugins/calendar/README.md
- plugins/calendar/index.html
- plugins/gallery/README.md
- plugins/gallery/index.html
- plugins/url-shortener/README.md
- plugins/url-shortener/index.html

## JSON parse check

Example:

```bash
python3 -m json.tool marketplace.json > /tmp/devholm-marketplace-json-check.json
```

## Path integrity checks

From marketplace.json, verify each plugin entry has existing paths:
- path
- landingPage
- readmePath

## Phase 5A catalog contract checks

For each plugin entry verify:

- installReadiness is `catalog-contract-ready`
- publisher.classification is `first-party`
- publisher.publisherId is present
- artifact.format is `tar.gz`
- artifact.readiness is `planned`
- artifact.immutable is `false`
- artifact.signature.status is `not-provided`

For this phase, verify these keys are not populated with placeholder runtime values:

- artifact.artifactUrl
- artifact.sha256
- artifact.compressedSizeBytes
- artifact.maxUncompressedSizeBytes

## Issue #66 signing contract checks

Reference:
- docs/artifact-signing-contract.md

For scaffold entries in this repository today, verify:

- installReadiness remains `catalog-contract-ready`
- artifact.readiness remains `planned`
- artifact.signature.status remains `not-provided`
- no fabricated signature material is present

For future production-eligible entries, verify contract completeness before claiming runtime readiness:

- artifact.signature.algorithm is `Ed25519`
- artifact.signature.keyId is present
- artifact.signature.signedPayloadVersion is `v1`
- artifact.signature.signature is present
- artifact.signature.signedAt is a valid ISO timestamp
- immutable artifact URL and SHA-256 are present

Do not mark any scaffold entry production-eligible unless real immutable artifacts and signatures exist.

## Relative link sanity

Verify links in:
- root index.html
- plugin index.html files

Links should resolve to existing local paths and remain static.

## Runtime behavior guard checks

Verify no runtime install behavior was introduced:
- no runtime scripts
- no install commands
- no fetch/network behavior
- no claims that runtime install is currently supported
- no production private signing keys
- no generated private key fixtures committed to this repository

## Required metadata guard values

Verify each plugin entry keeps:
- runtimeInstallSupported: false
- bundledFallbackRequired: true

## Language guardrails

Docs must continue to state:
- scaffold/docs-only status
- runtime install is future work and not enabled in this phase

## Notes

This validation pass is documentation-oriented and intentionally avoids adding executable runtime tooling.
