#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const TEST_FILE = /\.(?:test|spec)\.(?:[cm]?[jt]sx?)$/;
const SPEC_FILE = /\.spec\.(?:[cm]?[jt]sx?)$/;
const APPROVED_TEST_ROOT = /^tests\/(?:unit|integration|accessibility|tooling|e2e)\//;
const FORBIDDEN_TEST_DIRECTORY = /\/(?:test|__tests__|_test_)\//;
const TEST_SUPPORT_SEGMENT = /\/(?:fixtures|helpers|mocks?|setup)\//;
const RUNTIME_ROOT = /^(?:plugins|scripts)\//;
const GENERATED_SEGMENT =
  /^(?:coverage|dist|build|test-results|playwright-report)\/|\/(?:coverage|dist|build|test-results|playwright-report)\//;

export function validateTestLayout(paths) {
  const violations = [];

  for (const rawPath of paths) {
    const path = rawPath.replaceAll('\\', '/');
    const isTest = TEST_FILE.test(path);

    if (FORBIDDEN_TEST_DIRECTORY.test(`/${path}`)) {
      violations.push(`${path}: tests must use the dedicated tests directory`);
    }

    if (GENERATED_SEGMENT.test(path) && (isTest || TEST_SUPPORT_SEGMENT.test(`/${path}`))) {
      violations.push(`${path}: tracked generated output contains test artifacts`);
    }

    if (isTest && !APPROVED_TEST_ROOT.test(path)) {
      violations.push(`${path}: tests must live in an approved tests category`);
    }

    if (isTest && SPEC_FILE.test(path) && !path.startsWith('tests/e2e/')) {
      violations.push(`${path}: .spec files are reserved for browser E2E tests`);
    }

    if (RUNTIME_ROOT.test(path) && TEST_SUPPORT_SEGMENT.test(`/${path}`)) {
      violations.push(`${path}: test support must not live in runtime or executable source`);
    }
  }

  return [...new Set(violations)].sort();
}

export function trackedPaths(cwd = process.cwd()) {
  return execFileSync('git', ['ls-files', '-z'], { cwd, encoding: 'utf8' })
    .split('\0')
    .filter(Boolean);
}

export function verifyTrackedTestLayout(cwd = process.cwd()) {
  return validateTestLayout(trackedPaths(cwd));
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  const violations = verifyTrackedTestLayout();
  if (violations.length > 0) {
    console.error('Test layout violations:');
    for (const violation of violations) console.error(`- ${violation}`);
    process.exitCode = 1;
  } else {
    console.log('Test layout verification passed.');
  }
}
