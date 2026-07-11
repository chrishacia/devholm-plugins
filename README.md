# DevHolm Plugin Marketplace Scaffold

This repository is the DevHolm plugin marketplace scaffold for issue #49.

Current status:
- static/docs-only
- not yet used for runtime plugin installation
- bundled fallback in DevHolm remains authoritative

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

Documentation:
- docs/package-contract.md
- docs/validation.md
