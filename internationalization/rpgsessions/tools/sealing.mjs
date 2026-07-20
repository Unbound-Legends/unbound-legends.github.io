import { randomUUID } from 'node:crypto';
import { rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { inspectPublicBridge, PUBLIC_LOCALES, PUBLIC_SURFACES } from './validation.mjs';

export async function sealPublicBridge({ bridge, locale, mode = 'release', surface = 'all', apply = false }) {
  if (!PUBLIC_LOCALES.includes(locale)) throw new TypeError('locale must be fr or es');
  if (!['preview', 'release'].includes(mode)) throw new TypeError('seal mode must be preview or release');
  if (!PUBLIC_SURFACES.includes(surface)) throw new TypeError('surface must be app, maps, or all');
  const details = await inspectPublicBridge({
    bridge,
    mode,
    locale,
    surface,
    requireSeals: false,
    validateExistingSeals: false,
  });
  const seals = [];
  const files = [];
  if (surface === 'app' || surface === 'all') {
    const catalogSha256 = details.locales[locale].catalogSha256;
    const provenance = {
      schemaVersion: 2,
      locale,
      sourceRevision: details.manifest.revision,
      sourceDigest: details.manifest.sourceDigest,
      catalogSha256,
      provenance: 'human',
      reviewStatus: 'reviewed',
    };
    const relativePath = `translations/${locale}/_provenance.json`;
    seals.push({ path: relativePath, catalogSha256 });
    files.push({ path: join(bridge, relativePath), value: provenance });
  }
  const mapsTranslation = details.locales[locale].maps;
  if ((surface === 'maps' || surface === 'all') && details.maps) {
    const mapsRelativePath = `translations/${locale}/_maps-provenance.json`;
    const mapsProvenance = {
      schemaVersion: 2,
      locale,
      sourceRevision: details.maps.manifest.revision,
      sourceDigest: details.maps.manifest.sourceDigest,
      poSha256: mapsTranslation.poSha256,
      provenance: 'human',
      reviewStatus: 'reviewed',
    };
    seals.push({ path: mapsRelativePath, poSha256: mapsTranslation.poSha256 });
    files.push({ path: join(bridge, mapsRelativePath), value: mapsProvenance });
  }
  if (apply) {
    for (const file of files) await writeJsonAtomic(file.path, file.value);
  }
  return { command: 'seal', locale, mode, surface, applied: apply, seals };
}

async function writeJsonAtomic(path, value) {
  const temporaryPath = `${path}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
    await rename(temporaryPath, path);
  } finally {
    await rm(temporaryPath, { force: true });
  }
}
