# Public translation bridge tools

These files are self-contained and use only stock Node.js 22 APIs. The private source exporter publishes them under `tools/`, renaming `cli.mjs` to `i18n.mjs`, and verifies their exact bytes during import.

## Validate contributions

Draft validation allows missing or empty translations and allows absent provenance files:

```sh
node tools/i18n.mjs validate --bridge . --mode draft
node tools/i18n.mjs validate --bridge . --mode draft --locale fr
```

Release validation requires every locale key, a complete SessionsMaps PO when the Maps source bundle is present, and current schema version 2 provenance:

```sh
node tools/i18n.mjs validate --bridge . --mode release --locale fr
```

Both modes reject unsafe content, source or context drift, unknown files and keys, symlinks, placeholder or formatting changes, and invalid PO structure. Draft mode does not validate existing provenance because Weblate edits must land before a maintainer can reseal them. Release mode requires current provenance and rejects stale seals. Source-export automation removes `_provenance.json` or `_maps-provenance.json` when its corresponding source snapshot changes while preserving current seals and all translation files.

## Seal a human-reviewed locale

The seal command checks completeness and safety before preparing content-bound provenance. It is a dry run unless `--apply` is present:

```sh
node tools/i18n.mjs seal --bridge . --locale fr
node tools/i18n.mjs seal --bridge . --locale fr --apply
```

Only a locale reviewer should run the apply command after the translations have been written and reviewed by people. The command writes `_provenance.json` and, when applicable, `_maps-provenance.json`. It does not edit translations or record a reviewer identity.

JSON seals hash deterministic, key-sorted locale catalogs. SessionsMaps seals hash `maps.po` after adding a canonical final newline, matching the private importer. Editing translated content after sealing makes release validation fail until a reviewer seals the locale again.
