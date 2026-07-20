# Public translation bridge tools

These files are self-contained and use only stock Node.js 22 APIs. The private source exporter publishes them under `tools/`, renaming `cli.mjs` to `i18n.mjs`, and verifies their exact bytes during import.

## Validate contributions

Draft validation allows missing or empty translations and allows absent provenance files:

```sh
node tools/i18n.mjs validate --bridge . --mode draft
node tools/i18n.mjs validate --bridge . --mode draft --locale fr
```

Preview validation allows missing and empty translations but requires current schema version 2 provenance for the selected content. Release validation also requires the selected content to be complete:

```sh
node tools/i18n.mjs validate --bridge . --mode preview --locale fr --surface app
node tools/i18n.mjs validate --bridge . --mode preview --locale fr --surface maps
node tools/i18n.mjs validate --bridge . --mode release --locale fr
```

Use `--surface app`, `--surface maps`, or `--surface all` to validate the shared JSON catalogs, SessionsMaps PO, or both. The default is `all`. App and Maps review independently, so pending work on one surface does not block a selected preview of the other. Explicitly selecting Maps requires the Maps source bundle and a `maps.po` file in preview and release modes.

All modes reject unsafe content, source or context drift, unknown files and keys, symlinks, placeholder or formatting changes, and invalid PO structure. Draft mode does not validate existing provenance because Weblate edits must land before a maintainer can reseal them. Preview and release modes require current provenance and reject stale seals. Source-export automation removes `_provenance.json` or `_maps-provenance.json` when its corresponding source snapshot changes while preserving current seals and all translation files.

## Seal a human-reviewed locale

The seal command checks safety before preparing content-bound provenance. Preview seals may cover an incomplete reviewed snapshot. Release seals require complete selected content. The command defaults to release mode and both surfaces for compatibility, and it is a dry run unless `--apply` is present:

```sh
node tools/i18n.mjs seal --bridge . --locale fr --mode preview --surface app
node tools/i18n.mjs seal --bridge . --locale fr --mode preview --surface maps --apply
node tools/i18n.mjs seal --bridge . --locale fr
node tools/i18n.mjs seal --bridge . --locale fr --apply
```

Only a locale reviewer should run the apply command after the selected translations have been written and reviewed by people. The command writes `_provenance.json`, `_maps-provenance.json`, or both according to `--surface`. It does not edit translations or record a reviewer identity. Draft content cannot be sealed.

JSON seals hash deterministic, key-sorted locale catalogs. Missing app namespace files are treated as empty catalogs in preview mode, and empty values remain untranslated. SessionsMaps seals hash `maps.po` after adding a canonical final newline, matching the private importer; empty `msgstr` values remain untranslated. Editing selected translated content after sealing makes preview and release validation fail until a reviewer seals that surface again.
