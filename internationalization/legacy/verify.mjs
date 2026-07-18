#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { lstat, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export async function verifyLegacyArchive({
  repositoryRoot,
  manifest,
  readCommittedFile = readFileFromSourceCommit,
}) {
  assertManifest(manifest);
  const root = resolve(repositoryRoot);
  const rootStats = await lstat(root);
  if (!rootStats.isDirectory() || rootStats.isSymbolicLink()) {
    throw new TypeError('repository root must be a regular, non-symlink directory');
  }

  for (const file of manifest.files) {
    const compatibility = await readRegularRepositoryFile(root, file.compatibilityPath);
    const archive = await readRegularRepositoryFile(root, file.archivePath);
    if (!compatibility.equals(archive)) {
      throw new Error(`compatibility snapshot differs from its archive: ${file.compatibilityPath}`);
    }
    const digest = createHash('sha256').update(archive).digest('hex');
    if (digest !== file.sha256) {
      throw new Error(`legacy snapshot digest mismatch: ${file.archivePath}`);
    }
    const committed = await readCommittedFile({
      repositoryRoot: root,
      sourceCommit: manifest.sourceCommit,
      path: file.compatibilityPath,
    });
    if (!Buffer.isBuffer(committed)) {
      throw new TypeError('legacy source commit reader must return a buffer');
    }
    if (!compatibility.equals(committed)) {
      throw new Error(`legacy snapshot differs from source commit: ${file.compatibilityPath}`);
    }
  }

  return { files: manifest.files.length, valid: true };
}

function readFileFromSourceCommit({ repositoryRoot, sourceCommit, path }) {
  const result = spawnSync('git', ['show', `${sourceCommit}:${path}`], {
    cwd: repositoryRoot,
    encoding: null,
    maxBuffer: 10 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`unable to read legacy snapshot from source commit: ${path}`);
  }
  return result.stdout;
}

async function readRegularRepositoryFile(root, path) {
  assertRepositoryPath(path);
  let current = root;
  const segments = path.split('/');
  for (const [index, segment] of segments.entries()) {
    current = join(current, segment);
    const stats = await lstat(current);
    if (stats.isSymbolicLink()) throw new Error(`legacy snapshot path contains a symbolic link: ${path}`);
    if (index < segments.length - 1 && !stats.isDirectory()) {
      throw new TypeError(`legacy snapshot has a non-directory parent: ${path}`);
    }
    if (index === segments.length - 1 && !stats.isFile()) {
      throw new TypeError(`legacy snapshot must be a regular file: ${path}`);
    }
  }
  return readFile(current);
}

function assertManifest(manifest) {
  if (
    !isRecord(manifest) ||
    manifest.schemaVersion !== 1 ||
    !/^[a-f0-9]{40}$/.test(manifest.sourceCommit) ||
    manifest.status !== 'frozen-recovery-only' ||
    !Array.isArray(manifest.files) ||
    manifest.files.length === 0
  ) {
    throw new TypeError('legacy manifest is malformed');
  }
  const compatibilityPaths = new Set();
  const archivePaths = new Set();
  for (const file of manifest.files) {
    if (
      !isRecord(file) ||
      typeof file.compatibilityPath !== 'string' ||
      typeof file.archivePath !== 'string' ||
      !/^[a-f0-9]{64}$/.test(file.sha256)
    ) {
      throw new TypeError('legacy manifest contains a malformed file record');
    }
    assertRepositoryPath(file.compatibilityPath);
    assertRepositoryPath(file.archivePath);
    if (!file.compatibilityPath.startsWith('internationalization/')) {
      throw new TypeError('legacy compatibility path must stay under internationalization');
    }
    if (!file.archivePath.startsWith('internationalization/legacy/')) {
      throw new TypeError('legacy archive path must stay under internationalization/legacy');
    }
    if (compatibilityPaths.has(file.compatibilityPath) || archivePaths.has(file.archivePath)) {
      throw new TypeError('legacy manifest contains a duplicate path');
    }
    compatibilityPaths.add(file.compatibilityPath);
    archivePaths.add(file.archivePath);
  }
}

function assertRepositoryPath(path) {
  const segments = typeof path === 'string' ? path.split('/') : [];
  if (
    typeof path !== 'string' ||
    path.length === 0 ||
    path.startsWith('/') ||
    path.includes('\\') ||
    path.includes('\0') ||
    /^[A-Za-z]:/.test(path) ||
    segments.some(segment => segment === '' || segment === '.' || segment === '..')
  ) {
    throw new TypeError('legacy manifest paths must be safe repository-relative paths');
  }
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

const modulePath = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === modulePath) {
  const legacyDirectory = dirname(modulePath);
  const repositoryRoot = resolve(legacyDirectory, '../..');
  try {
    const manifest = JSON.parse(await readFile(join(legacyDirectory, 'manifest.json'), 'utf8'));
    const result = await verifyLegacyArchive({ repositoryRoot, manifest });
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
