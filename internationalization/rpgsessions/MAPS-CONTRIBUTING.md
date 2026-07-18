# Contributing SessionsMaps translations

People must write and review every translation. Do not use machine translation, generative AI, or automatic pretranslation.

Translate `source/maps/messages.pot` into `translations/fr/maps.po` or `translations/es/maps.po`. Keep every `#. Key: maps:...` comment, English `msgid`, placeholder, shortcut listed in `doNotTranslate`, and required line break intact. Use `context/maps.json` and `context/files/maps.md` for product context.

Each PO must contain exactly one `Language: fr` or `Language: es` header matching its directory. Every non-header message must keep exactly one generated key comment. Resolve or remove gettext's `fuzzy` flag before review because fuzzy translations cannot be imported.

After the complete PO is reviewed, a locale reviewer runs `npm run i18n:seal -- --locale fr --apply`. The command ensures the PO has a trailing newline, computes its SHA-256, and writes `_maps-provenance.json`. Do not create or edit the seal by hand. The importer accepts only this exact shape:

```json
{
  "schemaVersion": 2,
  "locale": "fr",
  "sourceRevision": "catalogs@2026-07-16.i18n-foundation-2",
  "sourceDigest": "sha256:d50f33526842ca0c8e7c608935161cb8509d625618bcd38e18c3d3e9d29e9395",
  "poSha256": "<generated content hash>",
  "provenance": "human",
  "reviewStatus": "reviewed"
}
```

Use `es` for Spanish. Any PO edit after sealing invalidates the review evidence and requires another human review and seal. The verified importer copies approved files back to the SessionsMaps locale directory.
