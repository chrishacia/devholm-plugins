# DevHolm Plugins Copilot instructions

## Test architecture

- Keep runtime and executable source directories free of tests and test-only support.
- Put tests in the root `tests/` tree using only categories justified by existing suites.
- Use `.test.*` for unit, integration, and repository-tooling tests. Reserve `.spec.*` for browser E2E tests.
- Keep marketplace contract tests under `tests/integration/` and repository-tooling tests under `tests/tooling/`.
- Coverage and build inputs must measure or package production source, not tests or test support.
- Update discovery, imports, configuration, CI, documentation, and validation whenever test paths change.
- Run `npm run test:layout` after changing test paths. Exceptions require a documented architecture decision approved by Chris.
