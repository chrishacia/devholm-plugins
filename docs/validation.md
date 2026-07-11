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
