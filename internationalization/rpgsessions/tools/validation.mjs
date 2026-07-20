import { createHash } from 'node:crypto';
import { lstat, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { isDeepStrictEqual } from 'node:util';

export const PUBLIC_LOCALES = ['fr', 'es'];
export const PUBLIC_SURFACES = ['app', 'maps', 'all'];
const PLACEHOLDER_PATTERN = /{{-?\s*([A-Za-z_][A-Za-z0-9_.]*)[^}]*}}/g;
const RAW_HTML_PATTERN = /<\/?[A-Za-z][^>]*>/;
const CONTROL_CHARACTER_PATTERN =
  /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/u;
const DISCORD_MENTION_PATTERN = /@(everyone|here)\b|<@!?\d+>|<@&\d+>|<#\d+>|<\/[A-Za-z0-9_-]+:\d+>/i;
const URL_PATTERN = /\b(?:https?|ftp):\/\/[^\s<>()]+/gi;
const MARKDOWN_LINK_PATTERN = /!?\[[^\]\r\n]*\]\([^\)\r\n]*\)/;
const MARKDOWN_BLOCK_PATTERN = /(^|\n)\s*(?:#{1,6}\s|>\s|[-+*]\s|\d+\.\s)/;
const MARKDOWN_INLINE_PATTERN = /`[^`\r\n]+`|(?:\*\*|__|~~)[^\r\n]+?(?:\*\*|__|~~)|(?:\*|_)[^*_\r\n]+?(?:\*|_)/;
const WORD_CHARACTER_PATTERN = /[\p{L}\p{N}_]/u;
const PLURAL_KEY_PATTERN = /_(zero|one|two|few|many|other)$/;

export async function validatePublicBridge({ bridge, mode, locale, surface = 'all' }) {
  const details = await inspectPublicBridge({ bridge, mode, locale, surface });
  return { command: 'validate', locales: details.selectedLocales, mode, surface, valid: true };
}

export async function inspectPublicBridge({
  bridge,
  mode,
  locale,
  surface = 'all',
  requireSeals = mode !== 'draft',
  validateExistingSeals = mode !== 'draft',
}) {
  if (!['draft', 'preview', 'release'].includes(mode)) {
    throw new TypeError('mode must be draft, preview, or release');
  }
  assertSurface(surface);
  const locales = locale === undefined ? PUBLIC_LOCALES : [assertLocale(locale)];
  await assertNoSymlinks(bridge, bridge);
  await assertTranslationRootInventory(bridge);
  const manifest = await readJson(join(bridge, 'manifest.json'), 'manifest.json');
  assertManifest(manifest);
  await assertSourceFiles(bridge, manifest);
  await assertTranslatorContext(bridge, manifest);
  await assertScreenshotManifest(bridge, manifest);
  const maps = await assertMapsSource(bridge, manifest);
  if (surface === 'maps' && !maps) {
    throw new Error('maps-manifest.json is required for the maps surface');
  }
  await assertGeneratedInventory(bridge, manifest, maps);
  const validatedLocales = {};
  for (const targetLocale of locales) {
    validatedLocales[targetLocale] = await assertLocaleCatalogs({
      bridge,
      manifest,
      locale: targetLocale,
      mode,
      surface,
      requireSeal: requireSeals,
      validateExistingSeal: validateExistingSeals,
      maps,
    });
  }

  return { manifest, maps, selectedLocales: locales, surface, locales: validatedLocales };
}

async function assertTranslationRootInventory(bridge) {
  let entries;
  try {
    entries = await readdir(join(bridge, 'translations'), { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return;
    throw error;
  }
  for (const entry of entries) {
    if (!entry.isDirectory() || !PUBLIC_LOCALES.includes(entry.name)) {
      throw new Error(`unrecognized translation locale or file: translations/${entry.name}`);
    }
  }
}

async function assertGeneratedInventory(bridge, manifest, maps) {
  const expectedSourceFiles = [
    ...manifest.files.map(file => file.path.slice('source/'.length)),
    ...(maps ? [maps.manifest.sourcePath.slice('source/'.length)] : []),
  ].sort();
  if (!isDeepStrictEqual(await listRelativeFiles(join(bridge, 'source')), expectedSourceFiles)) {
    throw new Error('source directory contains unrecognized or missing files');
  }
  const expectedContextFiles = [
    'strings.json',
    ...manifest.files.map(file => `files/${file.namespace}.md`),
    ...(maps ? ['maps.json', 'files/maps.md'] : []),
  ].sort();
  if (!isDeepStrictEqual(await listRelativeFiles(join(bridge, 'context')), expectedContextFiles)) {
    throw new Error('context directory contains unrecognized or missing files');
  }
  for (const relativePath of expectedContextFiles.filter(path => path.endsWith('.md'))) {
    if ((await readFile(join(bridge, 'context', relativePath), 'utf8')).trim().length === 0) {
      throw new Error(`context/${relativePath} must be nonempty`);
    }
  }
}

async function assertNoSymlinks(path, root) {
  const stats = await lstat(path);
  if (stats.isSymbolicLink()) {
    throw new Error(`public bridge contains a symbolic link: ${path.slice(root.length + 1) || '.'}`);
  }
  if (!stats.isDirectory()) return;
  for (const entry of await readdir(path)) {
    await assertNoSymlinks(join(path, entry), root);
  }
}

function assertLocale(locale) {
  if (!PUBLIC_LOCALES.includes(locale)) {
    throw new TypeError('locale must be fr or es');
  }
  return locale;
}

function assertSurface(surface) {
  if (!PUBLIC_SURFACES.includes(surface)) {
    throw new TypeError('surface must be app, maps, or all');
  }
  return surface;
}

function assertManifest(manifest) {
  if (
    !isRecord(manifest) ||
    manifest.schemaVersion !== 1 ||
    manifest.sourceLocale !== 'en' ||
    typeof manifest.revision !== 'string' ||
    !/^sha256:[a-f0-9]{64}$/.test(manifest.sourceDigest) ||
    !Array.isArray(manifest.files) ||
    !Array.isArray(manifest.strings)
  ) {
    throw new TypeError('manifest.json is malformed');
  }
  assertExactObjectKeys(
    manifest,
    ['schemaVersion', 'sourceLocale', 'revision', 'sourceDigest', 'files', 'strings'],
    'manifest.json',
  );

  const expectedIds = [];
  const namespaces = new Set();
  for (const file of manifest.files) {
    if (
      !isRecord(file) ||
      typeof file.namespace !== 'string' ||
      !/^[A-Za-z0-9_-]+$/.test(file.namespace) ||
      namespaces.has(file.namespace) ||
      file.path !== `source/en/${file.namespace}.json` ||
      !isRecord(file.messages) ||
      !isRecord(file.context) ||
      typeof file.context.description !== 'string' ||
      !Array.isArray(file.context.surfaces) ||
      !Array.isArray(file.context.audiences)
    ) {
      throw new TypeError('manifest.json contains a malformed or duplicate source file');
    }
    assertExactObjectKeys(file, ['namespace', 'path', 'messages', 'context'], `manifest file ${file.namespace}`);
    assertExactObjectKeys(
      file.context,
      ['description', 'surfaces', 'audiences'],
      `manifest file context ${file.namespace}`,
    );
    namespaces.add(file.namespace);
    for (const [key, source] of Object.entries(file.messages)) {
      if (!/^[A-Za-z0-9._-]+$/.test(key) || typeof source !== 'string' || source.length === 0) {
        throw new TypeError(`manifest.json contains malformed source message ${file.namespace}:${key}`);
      }
      expectedIds.push(`${file.namespace}:${key}`);
    }
  }
  if (
    !isDeepStrictEqual(
      manifest.strings.map(entry => entry?.id),
      expectedIds,
    )
  ) {
    throw new Error('manifest.json source messages and string records must match exactly');
  }
  for (const entry of manifest.strings) {
    const file = manifest.files.find(candidate => candidate.namespace === entry.namespace);
    if (
      !isRecord(entry) ||
      entry.id !== `${entry.namespace}:${entry.key}` ||
      entry.file !== file?.path ||
      entry.revision !== manifest.revision ||
      entry.source !== file?.messages?.[entry.key]
    ) {
      throw new Error('manifest.json source messages and string records must match exactly');
    }
    assertExactObjectKeys(
      entry,
      ['id', 'namespace', 'file', 'key', 'source', 'revision', 'context'],
      `manifest string ${entry.id}`,
    );
    assertStringContext(entry.id, entry.source, entry.context);
  }
  for (const file of manifest.files) {
    const fileEntries = manifest.strings.filter(entry => entry.namespace === file.namespace);
    const expectedContext = {
      description: `English source strings for the ${file.namespace} namespace.`,
      surfaces: [...new Set(fileEntries.map(entry => entry.context.surface))].sort(),
      audiences: [...new Set(fileEntries.map(entry => entry.context.audience))].sort(),
    };
    if (!isDeepStrictEqual(file.context, expectedContext)) {
      throw new Error(`manifest file context is inconsistent for ${file.namespace}`);
    }
  }

  const expectedDigest = buildSourceDigest(manifest.files, manifest.strings);
  if (manifest.sourceDigest !== expectedDigest) {
    throw new Error('manifest.json sourceDigest does not match its source and context');
  }
}

function assertStringContext(id, source, context) {
  if (!isRecord(context)) throw new TypeError(`${id} has malformed translator context`);
  assertExactObjectKeys(
    context,
    [
      'description',
      'surface',
      'audience',
      'uiRole',
      'placeholders',
      'formatting',
      'maxLength',
      'route',
      'state',
      'screenshot',
      'translatorNotes',
      'sourceLocations',
      'doNotTranslate',
      'relatedKeys',
      ...(context.tone === undefined ? [] : ['tone']),
    ],
    `${id} translator context`,
  );
  for (const field of ['description', 'surface', 'audience', 'uiRole', 'route', 'state']) {
    if (typeof context[field] !== 'string' || context[field].trim().length === 0) {
      throw new TypeError(`${id} has malformed translator context field ${field}`);
    }
  }
  if (
    !isRecord(context.placeholders) ||
    !isRecord(context.formatting) ||
    typeof context.formatting.kind !== 'string' ||
    typeof context.formatting.preserveWhitespace !== 'boolean' ||
    (context.maxLength !== null && (!Number.isSafeInteger(context.maxLength) || context.maxLength < 0)) ||
    !Array.isArray(context.translatorNotes) ||
    !Array.isArray(context.sourceLocations) ||
    context.sourceLocations.length === 0 ||
    !Array.isArray(context.doNotTranslate) ||
    !Array.isArray(context.relatedKeys)
  ) {
    throw new TypeError(`${id} has malformed translator context`);
  }
  assertExactObjectKeys(context.formatting, ['kind', 'preserveWhitespace'], `${id} formatting context`);
  for (const [name, placeholder] of Object.entries(context.placeholders)) {
    if (
      !/^[A-Za-z_][A-Za-z0-9_.-]*$/.test(name) ||
      !isRecord(placeholder) ||
      typeof placeholder.type !== 'string' ||
      typeof placeholder.meaning !== 'string' ||
      !['string', 'number', 'boolean'].includes(typeof placeholder.example) ||
      typeof placeholder.userAuthored !== 'boolean'
    ) {
      throw new TypeError(`${id} has malformed placeholder context for ${name}`);
    }
    assertExactObjectKeys(
      placeholder,
      ['type', 'meaning', 'example', 'userAuthored'],
      `${id} placeholder context for ${name}`,
    );
  }
  if (!sameValues(Object.keys(context.placeholders).sort(), extractPlaceholders(source))) {
    throw new TypeError(`${id} placeholder context does not match its source`);
  }
  for (const location of context.sourceLocations) {
    if (
      !isRecord(location) ||
      typeof location.path !== 'string' ||
      !Number.isSafeInteger(location.line) ||
      location.line < 1 ||
      (location.column !== undefined && (!Number.isSafeInteger(location.column) || location.column < 1)) ||
      (location.anchor !== undefined && typeof location.anchor !== 'string')
    ) {
      throw new TypeError(`${id} has a malformed source location`);
    }
    assertExactObjectKeys(
      location,
      [
        'path',
        'line',
        ...(location.column === undefined ? [] : ['column']),
        ...(location.anchor === undefined ? [] : ['anchor']),
      ],
      `${id} source location`,
    );
    assertSafeRelativePath(location.path, `${id} source location`);
    if (isAdminOnlyTranslationSourcePath(location.path)) {
      throw new Error(`${id} has a private operational source location`);
    }
  }
  for (const [field, values] of [
    ['translatorNotes', context.translatorNotes],
    ['doNotTranslate', context.doNotTranslate],
    ['relatedKeys', context.relatedKeys],
  ]) {
    if (values.some(value => typeof value !== 'string' || value.trim().length === 0)) {
      throw new TypeError(`${id} has malformed translator context field ${field}`);
    }
  }
  if (context.tone !== undefined && (typeof context.tone !== 'string' || context.tone.trim().length === 0)) {
    throw new TypeError(`${id} has malformed translator context field tone`);
  }
  if (context.screenshot !== null) {
    if (
      !isRecord(context.screenshot) ||
      ['id', 'publicPath', 'caption', 'anchor'].some(
        field => typeof context.screenshot[field] !== 'string' || context.screenshot[field].trim().length === 0,
      )
    ) {
      throw new TypeError(`${id} has malformed screenshot context`);
    }
    assertExactObjectKeys(context.screenshot, ['id', 'publicPath', 'caption', 'anchor'], `${id} screenshot context`);
    assertSafeRelativePath(context.screenshot.publicPath, `${id} screenshot path`);
  }
}

async function assertSourceFiles(bridge, manifest) {
  const expectedNames = new Set(manifest.files.map(file => `${file.namespace}.json`));
  for (const entry of await readdir(join(bridge, 'source/en'), { withFileTypes: true })) {
    if (!entry.isFile() || !expectedNames.has(entry.name)) {
      throw new Error(`unrecognized source file: source/en/${entry.name}`);
    }
  }
  for (const file of manifest.files) {
    if (
      !isRecord(file) ||
      typeof file.namespace !== 'string' ||
      file.path !== `source/en/${file.namespace}.json` ||
      !isRecord(file.messages)
    ) {
      throw new TypeError('manifest.json contains a malformed source file');
    }
    const source = await readJson(join(bridge, file.path), file.path);
    if (!isDeepStrictEqual(source, file.messages)) {
      throw new Error(`${file.path} does not match manifest.json`);
    }
  }
}

async function assertTranslatorContext(bridge, manifest) {
  const actual = await readJson(join(bridge, 'context/strings.json'), 'context/strings.json');
  const expected = {
    schemaVersion: 1,
    revision: manifest.revision,
    sourceDigest: manifest.sourceDigest,
    strings: manifest.strings.map(entry => ({ id: entry.id, source: entry.source, context: entry.context })),
  };
  if (!isDeepStrictEqual(actual, expected)) {
    throw new Error('context/strings.json does not match manifest.json');
  }
}

async function assertScreenshotManifest(bridge, manifest) {
  const actual = await readJson(join(bridge, 'screenshots.json'), 'screenshots.json');
  if (
    !isRecord(actual) ||
    actual.schemaVersion !== 1 ||
    actual.revision !== manifest.revision ||
    actual.sourceDigest !== manifest.sourceDigest ||
    !Array.isArray(actual.screenshots)
  ) {
    throw new Error('screenshots.json does not match manifest.json');
  }
  const expectedById = new Map();
  for (const entry of manifest.strings) {
    const screenshot = entry.context?.screenshot;
    if (!screenshot) continue;
    assertSafeRelativePath(screenshot.publicPath, 'screenshot path');
    if (!screenshot.publicPath.startsWith('screenshots/')) {
      throw new TypeError(`screenshot path must be under screenshots/: ${screenshot.publicPath}`);
    }
    const existing = expectedById.get(screenshot.id);
    if (existing && (existing.publicPath !== screenshot.publicPath || existing.caption !== screenshot.caption)) {
      throw new Error(`manifest.json contains conflicting screenshot metadata for ${screenshot.id}`);
    }
    const record = existing ?? {
      id: screenshot.id,
      publicPath: screenshot.publicPath,
      caption: screenshot.caption,
      anchors: new Map(),
    };
    const keys = record.anchors.get(screenshot.anchor) ?? [];
    keys.push(entry.id);
    record.anchors.set(screenshot.anchor, keys);
    expectedById.set(screenshot.id, record);
  }
  const expected = [...expectedById.values()]
    .sort((left, right) => left.id.localeCompare(right.id))
    .map(record => ({
      id: record.id,
      publicPath: record.publicPath,
      caption: record.caption,
      anchors: [...record.anchors.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([anchor, keys]) => ({ anchor, keys: [...keys].sort() })),
    }));
  if (actual.screenshots.length !== expected.length) {
    throw new Error('screenshots.json inventory does not match manifest.json');
  }
  for (let index = 0; index < expected.length; index += 1) {
    const { sha256, ...metadata } = actual.screenshots[index] ?? {};
    if (!isDeepStrictEqual(metadata, expected[index]) || !/^[a-f0-9]{64}$/.test(sha256)) {
      throw new Error('screenshots.json metadata does not match manifest.json');
    }
    const bytes = await readFile(join(bridge, expected[index].publicPath));
    const actualSha256 = createHash('sha256').update(bytes).digest('hex');
    if (actualSha256 !== sha256) {
      throw new Error(`screenshot SHA-256 does not match screenshots.json: ${expected[index].publicPath}`);
    }
  }
  const actualFiles = await listRelativeFiles(join(bridge, 'screenshots'));
  const expectedFiles = expected.map(record => record.publicPath.slice('screenshots/'.length)).sort();
  if (!isDeepStrictEqual(actualFiles, expectedFiles)) {
    throw new Error('screenshots directory contains unrecognized or missing files');
  }
}

async function assertLocaleCatalogs({
  bridge,
  manifest,
  locale,
  mode,
  surface,
  requireSeal,
  validateExistingSeal,
  maps,
}) {
  const entries = new Map(manifest.strings.map(entry => [entry.id, entry]));
  await assertLocaleInventory(bridge, manifest, locale, mode);
  let catalogs;
  let catalogSha256;
  let provenance;
  if (surface === 'app' || surface === 'all') {
    catalogs = Object.create(null);
    for (const file of manifest.files) {
      const expectedEntries = buildExpectedLocaleEntries(file, entries, locale);
      const path = join(bridge, 'translations', locale, `${file.namespace}.json`);
      let catalog;
      try {
        catalog = await readJson(path, `translations/${locale}/${file.namespace}.json`);
      } catch (error) {
        if (mode !== 'release' && error?.code === 'ENOENT') {
          catalogs[file.namespace] = {};
          continue;
        }
        throw error;
      }
      if (!isRecord(catalog)) {
        throw new TypeError(`translations/${locale}/${file.namespace}.json must be a JSON object`);
      }
      catalogs[file.namespace] = catalog;
      for (const [key, value] of Object.entries(catalog)) {
        if (!expectedEntries.has(key)) {
          throw new Error(`translations/${locale}/${file.namespace}.json contains unknown key ${key}`);
        }
        if (typeof value !== 'string') {
          throw new TypeError(`translation ${file.namespace}:${key} must be a string`);
        }
        if (value.length === 0) continue;
        if (value.trim().length === 0) {
          throw new Error(`translation ${file.namespace}:${key} must not be whitespace only`);
        }
        assertSafeTranslation({
          id: `${file.namespace}:${key}`,
          sourceEntry: expectedEntries.get(key),
          value,
        });
      }
      if (mode === 'release') {
        for (const key of expectedEntries.keys()) {
          if (typeof catalog[key] !== 'string' || catalog[key].length === 0) {
            throw new Error(`translation ${locale}:${file.namespace}:${key} is incomplete`);
          }
        }
      }
    }
    catalogSha256 = hashCatalogs(catalogs);
    provenance = await readOptionalJson(
      join(bridge, 'translations', locale, '_provenance.json'),
      `translations/${locale}/_provenance.json`,
    );
    if (validateExistingSeal || requireSeal) {
      assertCatalogProvenance({ locale, manifest, catalogSha256, provenance, required: requireSeal, mode });
    }
  }
  const mapsTranslation =
    surface === 'maps' || surface === 'all'
      ? await assertMapsTranslation({
          bridge,
          locale,
          mode,
          maps,
          requireSeal,
          validateExistingSeal,
        })
      : undefined;
  return { catalogs, catalogSha256, provenance, maps: mapsTranslation };
}

function buildExpectedLocaleEntries(file, sourceEntries, locale) {
  const expected = new Map();
  for (const key of expectedMessageKeysForLocale(file.messages, locale)) {
    const exact = sourceEntries.get(`${file.namespace}:${key}`);
    if (exact) {
      expected.set(key, exact);
      continue;
    }
    const match = key.match(PLURAL_KEY_PATTERN);
    const base = key.slice(0, -match[0].length);
    expected.set(key, sourceEntries.get(`${file.namespace}:${base}_other`));
  }
  return expected;
}

function expectedMessageKeysForLocale(messages, locale) {
  const expected = [];
  const handledPluralBases = new Set();
  const localeCategories = new Intl.PluralRules(locale).resolvedOptions().pluralCategories;
  for (const key of Object.keys(messages).sort()) {
    const match = key.match(PLURAL_KEY_PATTERN);
    if (!match) {
      expected.push(key);
      continue;
    }
    const base = key.slice(0, -match[0].length);
    const isPluralGroup = messages[`${base}_one`] !== undefined && messages[`${base}_other`] !== undefined;
    if (!isPluralGroup) {
      expected.push(key);
      continue;
    }
    if (handledPluralBases.has(base)) continue;
    handledPluralBases.add(base);
    const categories = new Set(localeCategories);
    if (messages[`${base}_zero`] !== undefined) categories.add('zero');
    for (const category of [...categories].sort()) expected.push(`${base}_${category}`);
  }
  return expected.sort();
}

async function assertMapsSource(bridge, manifest) {
  const mapsManifest = await readOptionalJson(join(bridge, 'maps-manifest.json'), 'maps-manifest.json');
  if (mapsManifest === undefined) return undefined;
  if (
    !isRecord(mapsManifest) ||
    mapsManifest.schemaVersion !== 1 ||
    mapsManifest.sourceLocale !== 'en' ||
    mapsManifest.revision !== manifest.revision ||
    !/^sha256:[a-f0-9]{64}$/.test(mapsManifest.sourceDigest) ||
    mapsManifest.format !== 'gettext-po' ||
    mapsManifest.sourcePath !== 'source/maps/messages.pot' ||
    mapsManifest.contextPath !== 'context/maps.json' ||
    !Number.isSafeInteger(mapsManifest.stringCount) ||
    !Array.isArray(mapsManifest.keys)
  ) {
    throw new TypeError('maps-manifest.json is malformed or inconsistent');
  }
  assertExactObjectKeys(
    mapsManifest,
    [
      'schemaVersion',
      'sourceLocale',
      'revision',
      'catalogRevision',
      'sourceDigest',
      'format',
      'sourcePath',
      'contextPath',
      'stringCount',
      'keys',
    ],
    'maps-manifest.json',
  );
  const expectedRevisionEvidence = {
    schemaVersion: 1,
    revision: mapsManifest.revision,
    sourceDigest: mapsManifest.sourceDigest,
  };
  if (!isDeepStrictEqual(mapsManifest.catalogRevision, expectedRevisionEvidence)) {
    throw new Error('maps-manifest.json catalogRevision is inconsistent');
  }

  const contextManifest = await readJson(join(bridge, mapsManifest.contextPath), mapsManifest.contextPath);
  if (
    !isRecord(contextManifest) ||
    contextManifest.schemaVersion !== 1 ||
    contextManifest.revision !== mapsManifest.revision ||
    contextManifest.sourceDigest !== mapsManifest.sourceDigest ||
    !Array.isArray(contextManifest.strings)
  ) {
    throw new Error('context/maps.json does not match maps-manifest.json');
  }
  assertExactObjectKeys(contextManifest, ['schemaVersion', 'revision', 'sourceDigest', 'strings'], 'context/maps.json');
  const sourceEntries = new Map();
  for (const entry of contextManifest.strings) {
    if (
      !isRecord(entry) ||
      typeof entry.id !== 'string' ||
      !/^maps:[A-Za-z0-9._-]+$/.test(entry.id) ||
      typeof entry.source !== 'string' ||
      entry.source.length === 0 ||
      !isRecord(entry.context) ||
      sourceEntries.has(entry.id)
    ) {
      throw new TypeError('context/maps.json contains a malformed or duplicate string');
    }
    assertExactObjectKeys(entry, ['id', 'source', 'context'], `context/maps.json string ${entry.id}`);
    assertStringContext(entry.id, entry.source, entry.context);
    sourceEntries.set(entry.id, entry);
  }
  const expectedKeys = [...sourceEntries.keys()];
  if (mapsManifest.stringCount !== expectedKeys.length || !isDeepStrictEqual(mapsManifest.keys, expectedKeys)) {
    throw new Error('maps-manifest.json keys do not match context/maps.json');
  }

  const pot = await readFile(join(bridge, mapsManifest.sourcePath), 'utf8');
  const potEntries = parseSourcePot(pot);
  if (!isDeepStrictEqual([...potEntries.keys()].sort(), [...expectedKeys].sort())) {
    throw new Error('source/maps/messages.pot keys do not match context/maps.json');
  }
  for (const [id, entry] of sourceEntries) {
    const potEntry = potEntries.get(id);
    if (potEntry.source !== entry.source) {
      throw new Error(`source/maps/messages.pot source does not match context for ${id}`);
    }
    const contextReferences = entry.context.sourceLocations
      .map(location => ({ path: location.path, line: location.line }))
      .sort(compareReferences);
    if (!isDeepStrictEqual(potEntry.references, contextReferences)) {
      throw new Error(`source/maps/messages.pot references do not match context for ${id}`);
    }
  }
  const mapsFileContext = await readFile(join(bridge, 'context/files/maps.md'), 'utf8');
  if (mapsFileContext.trim().length === 0) throw new Error('context/files/maps.md must be nonempty');
  return { manifest: mapsManifest, contextManifest, sourceEntries, pot };
}

async function assertMapsTranslation({ bridge, locale, mode, maps, requireSeal, validateExistingSeal }) {
  const relativePoPath = `translations/${locale}/maps.po`;
  const relativeProvenancePath = `translations/${locale}/_maps-provenance.json`;
  const po = await readOptionalText(join(bridge, relativePoPath));
  const provenance = await readOptionalJson(join(bridge, relativeProvenancePath), relativeProvenancePath);
  if (!maps) {
    if (po !== undefined || provenance !== undefined) {
      throw new Error(`SessionsMaps translation files exist without maps-manifest.json for ${locale}`);
    }
    return undefined;
  }
  if (po === undefined) {
    if (mode !== 'draft') throw new Error(`${relativePoPath} is required for ${mode}`);
    if (provenance !== undefined) throw new Error(`${relativeProvenancePath} exists without maps.po`);
    return { po: undefined, poSha256: undefined, provenance: undefined };
  }

  const translations = parseTranslatedPo(po, locale);
  for (const [id, translated] of translations) {
    const expected = maps.sourceEntries.get(id);
    if (!expected) throw new Error(`${relativePoPath} contains unknown key ${id}`);
    if (translated.source !== expected.source) throw new Error(`${relativePoPath} has a source mismatch for ${id}`);
    if (translated.fuzzy) throw new Error(`${relativePoPath} contains fuzzy translation ${id}`);
    if (translated.translation.length === 0) continue;
    if (translated.translation.trim().length === 0) {
      throw new Error(`${relativePoPath} has a whitespace-only translation for ${id}`);
    }
    assertSafeTranslation({ id, sourceEntry: expected, value: translated.translation });
  }
  if (mode === 'release') {
    for (const id of maps.sourceEntries.keys()) {
      if (!translations.get(id)?.translation.trim()) {
        throw new Error(`${relativePoPath} is incomplete at ${id}`);
      }
    }
  }
  const normalizedPo = normalizeTextFile(po);
  const poSha256 = createHash('sha256').update(normalizedPo, 'utf8').digest('hex');
  if (validateExistingSeal || requireSeal) {
    assertMapsProvenance({ locale, maps, poSha256, provenance, required: requireSeal, mode });
  }
  return { po: normalizedPo, poSha256, provenance };
}

function assertMapsProvenance({ locale, maps, poSha256, provenance, required, mode }) {
  if (provenance === undefined) {
    if (required) throw new Error(`translations/${locale}/_maps-provenance.json is required for ${mode}`);
    return;
  }
  const expected = {
    schemaVersion: 2,
    locale,
    sourceRevision: maps.manifest.revision,
    sourceDigest: maps.manifest.sourceDigest,
    poSha256,
    provenance: 'human',
    reviewStatus: 'reviewed',
  };
  if (!isDeepStrictEqual(provenance, expected)) {
    throw new Error(`translations/${locale}/_maps-provenance.json is malformed or stale`);
  }
}

async function assertLocaleInventory(bridge, manifest, locale, mode) {
  const directory = join(bridge, 'translations', locale);
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (mode === 'draft' && error?.code === 'ENOENT') return;
    if (error?.code === 'ENOENT') throw new Error(`translations/${locale} is required for ${mode}`);
    throw error;
  }
  const allowed = new Set([
    ...manifest.files.map(file => `${file.namespace}.json`),
    '_provenance.json',
    'maps.po',
    '_maps-provenance.json',
  ]);
  for (const entry of entries) {
    if (!entry.isFile() || !allowed.has(entry.name)) {
      throw new Error(`unrecognized translation file: translations/${locale}/${entry.name}`);
    }
  }
}

function assertSafeTranslation({ id, sourceEntry, value }) {
  if (RAW_HTML_PATTERN.test(value)) throw new Error(`translation ${id} contains unsafe HTML`);
  if (!sourceEntry) return;
  const { source, context } = sourceEntry;
  if (CONTROL_CHARACTER_PATTERN.test(value)) throw new Error(`translation ${id} contains a control character`);
  if (context.formatting.kind === 'email-subject' && /[\r\n]/.test(value)) {
    throw new Error(`translation ${id} contains a line break in an email subject`);
  }
  if (DISCORD_MENTION_PATTERN.test(value)) throw new Error(`translation ${id} contains a Discord mention`);
  if (!sameValues(extractUrls(source), extractUrls(value))) {
    throw new Error(`translation ${id} changes a protected URL`);
  }
  if (
    !['markdown', 'discord-markdown', 'code-like'].includes(context.formatting.kind) &&
    (MARKDOWN_LINK_PATTERN.test(value) || MARKDOWN_BLOCK_PATTERN.test(value) || MARKDOWN_INLINE_PATTERN.test(value))
  ) {
    throw new Error(`translation ${id} introduces unsupported formatting`);
  }
  if (!sameValues(extractPlaceholders(source), extractPlaceholders(value))) {
    throw new Error(`translation ${id} has a placeholder mismatch`);
  }
  for (const literal of context.doNotTranslate) {
    if (
      protectedLiteralOccurrences(source, literal) > 0 &&
      protectedLiteralOccurrences(source, literal) !== protectedLiteralOccurrences(value, literal)
    ) {
      throw new Error(`translation ${id} changes protected literal ${literal}`);
    }
  }
  if (context.formatting.preserveWhitespace && countNewlines(source) !== countNewlines(value)) {
    throw new Error(`translation ${id} changes required whitespace`);
  }
  if (context.maxLength !== null && [...value].length > context.maxLength) {
    throw new Error(`translation ${id} exceeds maximum length ${context.maxLength}`);
  }
}

function extractPlaceholders(value) {
  return [...value.matchAll(PLACEHOLDER_PATTERN)]
    .map(match => match[1])
    .filter(Boolean)
    .sort();
}

function extractUrls(value) {
  return [...value.matchAll(URL_PATTERN)].map(match => match[0]).sort();
}

function sameValues(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function protectedLiteralOccurrences(value, literal) {
  const characters = [...literal];
  const startBoundary = WORD_CHARACTER_PATTERN.test(characters[0] ?? '') ? '(?<![\\p{L}\\p{N}_])' : '';
  const endBoundary = WORD_CHARACTER_PATTERN.test(characters.at(-1) ?? '') ? '(?![\\p{L}\\p{N}_])' : '';
  const escaped = literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...value.matchAll(new RegExp(`${startBoundary}${escaped}${endBoundary}`, 'gu'))].length;
}

function countNewlines(value) {
  return (value.match(/\n/g) ?? []).length;
}

function normalizeTextFile(value) {
  return value.endsWith('\n') ? value : `${value}\n`;
}

function parseSourcePot(pot) {
  if (typeof pot !== 'string' || pot.trim().length === 0) {
    throw new TypeError('source/maps/messages.pot must be nonempty');
  }
  const entries = new Map();
  const lines = pot.replaceAll('\r\n', '\n').split('\n');
  let key;
  let references = [];
  for (let index = 0; index < lines.length; index += 1) {
    const keyMatch = lines[index].match(/^#\. Key: (maps:[A-Za-z0-9._-]+)$/);
    if (keyMatch) {
      if (key !== undefined) throw new TypeError(`source/maps/messages.pot key has no msgid: ${key}`);
      key = keyMatch[1];
      references = [];
      continue;
    }
    if (key && lines[index].startsWith('#:')) {
      for (const token of lines[index].slice(2).trim().split(/\s+/).filter(Boolean)) {
        const match = token.match(/^(.+):([1-9][0-9]*)$/);
        if (!match) throw new TypeError(`invalid gettext source reference: ${token}`);
        references.push({ path: match[1], line: Number(match[2]) });
      }
      continue;
    }
    if (!lines[index].startsWith('msgid ')) continue;
    const parsed = parsePoValue(lines, index, 'msgid ');
    index = parsed.lastIndex;
    if (!key) continue;
    if (parsed.value.length === 0) throw new TypeError(`source/maps/messages.pot has an empty msgid for ${key}`);
    if (entries.has(key)) throw new TypeError(`source/maps/messages.pot has duplicate key ${key}`);
    entries.set(key, { source: parsed.value, references: references.sort(compareReferences) });
    key = undefined;
    references = [];
  }
  if (key !== undefined) throw new TypeError(`source/maps/messages.pot key has no msgid: ${key}`);
  if (entries.size === 0) throw new TypeError('source/maps/messages.pot has no keyed messages');
  return entries;
}

function parseTranslatedPo(po, locale) {
  if (typeof po !== 'string' || po.trim().length === 0) {
    throw new TypeError(`${locale} maps.po must be nonempty`);
  }
  assertHumanOnlyPoMetadata(po, locale);
  const blocks = po
    .replaceAll('\r\n', '\n')
    .split(/\n{2,}/)
    .map(block => block.replace(/\n+$/, ''))
    .filter(block => block.trim().length > 0);
  const entries = new Map();
  let foundHeader = false;
  for (const block of blocks) {
    const entry = parsePoEntryBlock(block, locale);
    if (entry.source === '' && entry.keys.length === 0) {
      if (foundHeader) throw new TypeError(`${locale} maps.po must contain exactly one gettext header`);
      assertMatchingPoLanguageHeader(entry.translation, locale);
      if (entry.fuzzy) throw new TypeError(`${locale} maps.po gettext header must not be fuzzy`);
      foundHeader = true;
      continue;
    }
    if (entry.keys.length !== 1) {
      throw new TypeError(`every non-header entry in ${locale} maps.po must have exactly one SessionsMaps key`);
    }
    const [key] = entry.keys;
    if (entry.source.length === 0) throw new TypeError(`${locale} maps.po has an empty msgid for ${key}`);
    if (entries.has(key)) throw new TypeError(`${locale} maps.po has duplicate key ${key}`);
    entries.set(key, entry);
  }
  if (!foundHeader) throw new TypeError(`${locale} maps.po must contain exactly one matching Language header`);
  return entries;
}

function parsePoEntryBlock(block, locale) {
  const lines = block.split('\n');
  const keys = [];
  const flags = new Set();
  let source;
  let translation;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^(?:msgid_plural|msgstr\[|msgctxt\s)/.test(line)) {
      throw new TypeError(`unsupported gettext structure in ${locale} maps.po`);
    }
    if (line.startsWith('#. Key:')) {
      const match = line.match(/^#\. Key: (maps:[A-Za-z0-9._-]+)$/);
      if (!match) throw new TypeError(`invalid SessionsMaps key comment in ${locale} maps.po`);
      keys.push(match[1]);
      continue;
    }
    if (line.startsWith('#,')) {
      for (const flag of line.slice(2).split(',')) if (flag.trim()) flags.add(flag.trim());
      continue;
    }
    if (line.startsWith('#')) continue;
    if (line.startsWith('msgid ')) {
      if (source !== undefined) throw new TypeError(`duplicate msgid in ${locale} maps.po entry`);
      const parsed = parsePoValue(lines, index, 'msgid ');
      source = parsed.value;
      index = parsed.lastIndex;
      continue;
    }
    if (line.startsWith('msgstr ')) {
      if (translation !== undefined) throw new TypeError(`duplicate msgstr in ${locale} maps.po entry`);
      const parsed = parsePoValue(lines, index, 'msgstr ');
      translation = parsed.value;
      index = parsed.lastIndex;
      continue;
    }
    throw new TypeError(`invalid gettext syntax in ${locale} maps.po: ${line}`);
  }
  if (source === undefined || translation === undefined) {
    throw new TypeError(`incomplete gettext entry in ${locale} maps.po`);
  }
  return { keys, source, translation, fuzzy: flags.has('fuzzy') };
}

function parsePoValue(lines, startIndex, prefix) {
  let value = parsePoQuoted(lines[startIndex].slice(prefix.length));
  let lastIndex = startIndex;
  while (lines[lastIndex + 1]?.startsWith('"')) {
    lastIndex += 1;
    value += parsePoQuoted(lines[lastIndex]);
  }
  return { value, lastIndex };
}

function parsePoQuoted(value) {
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed !== 'string') throw new TypeError();
    return parsed;
  } catch {
    throw new TypeError(`invalid gettext string literal: ${value}`);
  }
}

function assertMatchingPoLanguageHeader(header, locale) {
  const languages = header
    .split('\n')
    .filter(line => line.startsWith('Language:'))
    .map(line => line.slice('Language:'.length).trim());
  if (languages.length !== 1 || languages[0] !== locale) {
    throw new TypeError(`${locale} maps.po must contain exactly one Language header matching ${locale}`);
  }
}

function assertHumanOnlyPoMetadata(po, locale) {
  const forbidden = [
    /X-(?:Machine-Translation|Pretranslation|AI-Translation|Translation-Provider)\s*:/i,
    /X-Generator\s*:\s*(?:DeepL|Google Translate|Microsoft Translator|OpenAI|machine|AI)\b/i,
  ];
  if (forbidden.some(pattern => pattern.test(po))) {
    throw new TypeError(`${locale} maps.po contains automated translation metadata`);
  }
}

function compareReferences(left, right) {
  return left.path.localeCompare(right.path) || left.line - right.line;
}

function assertSafeRelativePath(value, label) {
  const segments = typeof value === 'string' ? value.split('/') : [];
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.startsWith('/') ||
    value.includes('\\') ||
    value.includes('\0') ||
    /^[A-Za-z]:/.test(value) ||
    segments.some(segment => segment === '' || segment === '.' || segment === '..')
  ) {
    throw new TypeError(`${label} must be a safe repo-relative path`);
  }
}

function isAdminOnlyTranslationSourcePath(path) {
  return path
    .replaceAll('\\', '/')
    .split('/')
    .some(segment => /(?:^|[-.])admin(?:[-.]|$)/i.test(segment));
}

async function listRelativeFiles(root) {
  const files = [];
  const pending = [{ directory: root, prefix: '' }];
  while (pending.length > 0) {
    const { directory, prefix } = pending.pop();
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      if (error?.code === 'ENOENT') return files.sort();
      throw error;
    }
    for (const entry of entries) {
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) pending.push({ directory: join(directory, entry.name), prefix: relativePath });
      else if (entry.isFile()) files.push(relativePath);
      else throw new Error(`unsupported file type: ${relativePath}`);
    }
  }
  return files.sort();
}

function buildSourceDigest(files, strings) {
  const digestInput = {
    files: files.map(file => ({ namespace: file.namespace, path: file.path, messages: file.messages })),
    strings: strings.map(entry => ({ id: entry.id, source: entry.source, context: entry.context })),
  };
  return `sha256:${createHash('sha256').update(JSON.stringify(digestInput), 'utf8').digest('hex')}`;
}

export function hashCatalogs(catalogs) {
  const canonical = Object.fromEntries(
    Object.entries(catalogs)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([namespace, messages]) => [
        namespace,
        Object.fromEntries(Object.entries(messages).sort(([left], [right]) => left.localeCompare(right))),
      ]),
  );
  return createHash('sha256')
    .update(`${JSON.stringify(canonical)}\n`, 'utf8')
    .digest('hex');
}

function assertCatalogProvenance({ locale, manifest, catalogSha256, provenance, required, mode }) {
  if (provenance === undefined) {
    if (required) throw new Error(`translations/${locale}/_provenance.json is required for ${mode}`);
    return;
  }
  const expected = {
    schemaVersion: 2,
    locale,
    sourceRevision: manifest.revision,
    sourceDigest: manifest.sourceDigest,
    catalogSha256,
    provenance: 'human',
    reviewStatus: 'reviewed',
  };
  if (!isDeepStrictEqual(provenance, expected)) {
    throw new Error(`translations/${locale}/_provenance.json is malformed or stale`);
  }
}

async function readJson(path, label) {
  let source;
  try {
    source = await readFile(path, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') error.message = `${label} is missing`;
    throw error;
  }
  try {
    return JSON.parse(source);
  } catch {
    throw new TypeError(`${label} is not valid JSON`);
  }
}

async function readOptionalJson(path, label) {
  try {
    return await readJson(path, label);
  } catch (error) {
    if (error?.code === 'ENOENT') return undefined;
    throw error;
  }
}

async function readOptionalText(path) {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') return undefined;
    throw error;
  }
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function assertExactObjectKeys(value, expectedKeys, label) {
  if (!isDeepStrictEqual(Object.keys(value).sort(), [...expectedKeys].sort())) {
    throw new TypeError(`${label} contains missing or unsupported metadata`);
  }
}
