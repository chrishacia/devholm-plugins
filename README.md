# DevHolm Plugin Marketplace Scaffold

This repository is the DevHolm plugin marketplace scaffold for issue #49.

Current status:
- static/docs-only
- not yet used for runtime plugin installation
- bundled fallback in DevHolm remains authoritative

Phase 5A catalog status:
- catalog metadata includes first-party publisher and artifact-reference contract fields
- artifact records remain `readiness: planned`
- no artifact URLs, checksums, or runtime install execution are enabled in this repository
- signing contract and key policy are documented for future production artifact publication

Selected package path shape:
- plugins/<plugin-id>

This aligns with merged DevHolm marketplace contract work from PR #50 and PR #51.

Initial stock plugin package candidates:
- calendar
- gallery
- url-shortener

Important:
- DevHolm runtime installation from this repository is not enabled yet.
- This scaffold does not imply runtime install readiness.
- The catalog contract is preparatory metadata only until immutable release artifacts are published.

Documentation:
- docs/package-contract.md
- docs/validation.md
- docs/artifact-signing-contract.md
