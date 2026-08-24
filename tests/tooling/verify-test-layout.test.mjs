import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { validateTestLayout } from '../../scripts/verify-test-layout.mjs';

const verifierPath = fileURLToPath(
  new URL('../../scripts/verify-test-layout.mjs', import.meta.url)
);
const isolatedEnvironment = Object.fromEntries(
  Object.entries(process.env).filter(([name]) => !name.startsWith('GIT_'))
);

test('accepts the repository test architecture', () => {
  assert.deepEqual(
    validateTestLayout([
      'plugins/calendar/manifest.json',
      'scripts/build-site.mjs',
      'tests/integration/marketplace-contract.test.mjs',
      'tests/tooling/verify-test-layout.test.mjs',
      'tests/e2e/catalog.spec.mjs'
    ]),
    []
  );
});

test('rejects tests outside approved test categories', () => {
  assert.match(
    validateTestLayout(['scripts/catalog.test.mjs'])[0],
    /approved tests category/
  );
});

test('rejects singular and framework-specific test directories', () => {
  const violations = validateTestLayout([
    'test/catalog.test.mjs',
    'plugins/calendar/__tests__/manifest.test.mjs'
  ]);
  assert.equal(
    violations.filter((violation) => violation.includes('dedicated tests directory')).length,
    2
  );
});

test('reserves spec files for browser E2E tests', () => {
  assert.match(
    validateTestLayout(['tests/integration/catalog.spec.mjs'])[0],
    /reserved for browser E2E/
  );
});

test('rejects test support in runtime or executable source', () => {
  assert.match(
    validateTestLayout(['scripts/fixtures/catalog.mjs'])[0],
    /test support must not live/
  );
});

test('rejects tracked generated test artifacts', () => {
  assert.ok(
    validateTestLayout(['dist/tests/catalog.test.mjs']).some((violation) =>
      violation.includes('tracked generated output')
    )
  );
});

test('enforces tracked violations through the CLI', () => {
  const repositoryPath = mkdtempSync(join(tmpdir(), 'devholm-plugins-test-layout-'));
  const forbiddenPath = 'scripts/bad.test.mjs';

  try {
    mkdirSync(join(repositoryPath, 'scripts'), { recursive: true });
    copyFileSync(verifierPath, join(repositoryPath, 'scripts/verify-test-layout.mjs'));
    writeFileSync(join(repositoryPath, forbiddenPath), 'export {};\n');
    execFileSync('git', ['init'], {
      cwd: repositoryPath,
      env: isolatedEnvironment,
      stdio: 'ignore'
    });
    execFileSync('git', ['add', forbiddenPath], {
      cwd: repositoryPath,
      env: isolatedEnvironment
    });

    const result = spawnSync(process.execPath, ['scripts/verify-test-layout.mjs'], {
      cwd: repositoryPath,
      encoding: 'utf8',
      env: isolatedEnvironment
    });

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Test layout violations:/);
    assert.match(result.stderr, /scripts\/bad\.test\.mjs/);
    assert.match(result.stderr, /approved tests category/);
  } finally {
    rmSync(repositoryPath, { recursive: true, force: true });
  }
});
