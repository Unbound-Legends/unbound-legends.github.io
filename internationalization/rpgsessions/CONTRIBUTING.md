# Contributing RPGSessions translations

People must write and review every translation. Do not use machine translation, generative AI, or automatic pretranslation.

## Where to translate

- French JSON files belong in `translations/fr/`.
- Spanish JSON files belong in `translations/es/`.
- SessionsMaps gettext contributions use `maps.po`; see `MAPS-CONTRIBUTING.md` when that optional source bundle is present.
- Do not edit `source/en/`, `manifest.json`, `context/`, or `screenshots.json`. They are generated from the private application source.

## Use the context

Read `context/strings.json` before translating a key. It includes the UI surface, audience, role, product state, formatting rules, placeholder meaning, safe examples, source locations, and screenshot anchors. For example, keep `{{ authorName }}` unchanged.

Never rename, remove, or add a placeholder. Keep every value listed under `doNotTranslate` unchanged.

## Human review evidence

After reviewing every nonempty translation in the exact JSON snapshot against source revision `catalogs@2026-07-16.i18n-foundation-2` and digest `sha256:2100df7cd6a8bce5baa0ac23670ec5747f9d1fb876e490ab18fc78ba7b3bd227`, a locale reviewer runs `npm run i18n:seal -- --locale fr --mode preview --surface app --apply`. The command computes a deterministic SHA-256 over every locale JSON catalog and writes `_provenance.json`. Missing or empty translations continue to use English in preview builds. Release validation separately requires the selected snapshot to be complete. Do not create or edit the seal by hand. The importer accepts only this exact shape:

```json
{
  "schemaVersion": 2,
  "locale": "fr",
  "sourceRevision": "catalogs@2026-07-16.i18n-foundation-2",
  "sourceDigest": "sha256:2100df7cd6a8bce5baa0ac23670ec5747f9d1fb876e490ab18fc78ba7b3bd227",
  "catalogSha256": "<generated content hash>",
  "provenance": "human",
  "reviewStatus": "reviewed"
}
```

Use `es` instead of `fr` for Spanish. Any catalog edit after sealing invalidates the review evidence and requires another human review and seal. Missing hashes and extra generation, provider, or pretranslation metadata are rejected. Each locale and surface may be validated and imported independently after review of its exact content.
