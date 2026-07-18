import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { verifyLegacyArchive } from './verify.mjs';

test('accepts byte-identical compatibility and archive files with matching hashes', async t => {
  const root = await mkdtemp(join(tmpdir(), 'translation-legacy-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const contents = Buffer.from('{"hello":"world"}\n');
  const compatibilityPath = 'internationalization/app/en.json';
  const archivePath = 'internationalization/legacy/app-catalog/en.json';
  await mkdir(join(root, 'internationalization/app'), { recursive: true });
  await mkdir(join(root, 'internationalization/legacy/app-catalog'), { recursive: true });
  await writeFile(join(root, compatibilityPath), contents);
  await writeFile(join(root, archivePath), contents);

  const result = await verifyLegacyArchive({
    repositoryRoot: root,
    manifest: {
      schemaVersion: 1,
      sourceCommit: '0'.repeat(40),
      status: 'frozen-recovery-only',
      files: [
        {
          compatibilityPath,
          archivePath,
          sha256: createHash('sha256').update(contents).digest('hex'),
        },
      ],
    },
    readCommittedFile: async () => contents,
  });

  assert.deepEqual(result, { files: 1, valid: true });
});

test('rejects a compatibility file changed after archival', async t => {
  const root = await mkdtemp(join(tmpdir(), 'translation-legacy-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const compatibilityPath = 'internationalization/app/en.json';
  const archivePath = 'internationalization/legacy/app-catalog/en.json';
  await mkdir(join(root, 'internationalization/app'), { recursive: true });
  await mkdir(join(root, 'internationalization/legacy/app-catalog'), { recursive: true });
  await writeFile(join(root, compatibilityPath), 'changed\n');
  await writeFile(join(root, archivePath), 'archived\n');

  await assert.rejects(
    verifyLegacyArchive({
      repositoryRoot: root,
      manifest: {
        schemaVersion: 1,
        sourceCommit: '0'.repeat(40),
        status: 'frozen-recovery-only',
        files: [
          {
            compatibilityPath,
            archivePath,
            sha256: createHash('sha256').update('archived\n').digest('hex'),
          },
        ],
      },
    }),
    /compatibility snapshot differs from its archive/,
  );
});

test('rejects matching snapshots that differ from the source commit', async t => {
  const root = await mkdtemp(join(tmpdir(), 'translation-legacy-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const current = Buffer.from('{"hello":"changed"}\n');
  const committed = Buffer.from('{"hello":"original"}\n');
  const compatibilityPath = 'internationalization/app/en.json';
  const archivePath = 'internationalization/legacy/app-catalog/en.json';
  await mkdir(join(root, 'internationalization/app'), { recursive: true });
  await mkdir(join(root, 'internationalization/legacy/app-catalog'), { recursive: true });
  await writeFile(join(root, compatibilityPath), current);
  await writeFile(join(root, archivePath), current);

  await assert.rejects(
    verifyLegacyArchive({
      repositoryRoot: root,
      manifest: {
        schemaVersion: 1,
        sourceCommit: '0'.repeat(40),
        status: 'frozen-recovery-only',
        files: [
          {
            compatibilityPath,
            archivePath,
            sha256: createHash('sha256').update(current).digest('hex'),
          },
        ],
      },
      readCommittedFile: async () => committed,
    }),
    /legacy snapshot differs from source commit/,
  );
});
