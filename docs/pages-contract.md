# GitHub Pages Marketplace Contract

GitHub Pages in this repository is a presentation and discovery surface only.

It publishes:
- catalog metadata
- plugin landing pages
- documentation links
- public package descriptions

It does not publish trust authority.

DevHolm remains responsible for:
- digest validation
- signature verification
- publisher policy
- install authorization
- compatibility gating

The generated catalog intentionally keeps artifact metadata descriptive and linkable, while trust decisions stay in DevHolm.

Canonical source policy:
- `scripts/catalog-data.mjs` is the single editable catalog source
- `marketplace.json` is the scaffold contract surface, not install authority
- generated output in `dist/` is the published Pages artifact
