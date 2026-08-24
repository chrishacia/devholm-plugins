# Testing

DevHolm Plugins uses Node's native test runner. Run the complete repository validation with:

```sh
npm run check
```

## Test layout

- `tests/integration/` owns marketplace and package contract tests.
- `tests/tooling/` owns contracts for repository validation tools.
- `tests/e2e/` is reserved for future browser tests using `.spec.*` filenames.
- Runtime plugin sources and executable `scripts/` must not contain tests, fixtures, mocks, helpers, or setup modules.

Use `.test.*` for non-browser tests. Add only the test categories that the repository actually needs. Production manifests and generated Pages output must remain free of tests and test-only support.

`npm run test:layout` runs focused verifier contracts and then scans `git ls-files`, so ignored dependencies, generated output, and untracked temporary files are not traversed. Any exception requires an architecture decision approved by Chris.

When moving or adding tests, update package scripts, imports, CI, build inputs, validation, and documentation in the same change.
