# Human-only translation policy

## Non-negotiable rule

Every translation shipped by RPGSessions must be written or explicitly selected by a person and approved by a human reviewer for that locale.

Do not use:

- Machine translation engines
- Generative AI or language models
- Automatic translation or automatic pre-translation
- Unreviewed third-party translated text
- A translation memory whose entries cannot be traced to approved human work

This applies to production catalogs, draft suggestions committed to the public bridge, screenshots, examples, and historical recovery.

## Human translation memory

An approved human translation memory may be used when all of these are true:

1. Every suggested entry came from known human translation work.
2. The current translator explicitly accepts or edits the suggestion.
3. The locale reviewer checks it in the current source context.
4. The source revision and approval are recorded by the translation platform.

Translation memory is assistance for people. It is not permission to fill a catalog automatically.

## Roles

| Role                    | Responsibility                                                              |
| ----------------------- | --------------------------------------------------------------------------- |
| English source owner    | Writes stable English copy, key, placeholders, and translator context.      |
| Translator              | Produces the target-language wording and flags ambiguous source copy.       |
| Locale reviewer         | Reviews meaning, terminology, grammar, placeholders, and product fit.       |
| Localization maintainer | Maintains catalogs, glossary, bridge synchronization, and recovery reports. |
| Release owner           | Confirms required namespaces and review state before enabling a locale.     |

One person may hold more than one role, but a new or materially changed translation should receive review from a second person when a reviewer is available.

## Provenance states

Use these states when moving translations through the bridge:

- `new`: written by a person for the current source
- `human-tm-candidate`: suggested from approved human history, not yet accepted
- `reviewed`: checked by the locale reviewer against current context
- `needs-retranslation`: source English changed or context is materially different
- `orphaned`: no current exact key exists
- `rejected`: unsuitable, untraceable, or suspected machine-generated text

Only `reviewed` entries may be imported into a shipped locale snapshot.

The importer requires schema version 2 public review evidence containing exactly the current source revision and digest, the locale, `provenance: human`, `reviewStatus: reviewed`, and a content hash. JSON catalogs use `_provenance.json` with `catalogSha256`, computed deterministically across the locale catalogs. SessionsMaps gettext catalogs use `_maps-provenance.json` with `poSha256` over the normalized PO bytes because their POT and context have a separate digest. A person must review the complete content before running the sealing command. Any catalog or PO edit after sealing invalidates that review evidence. Schema version 1 public evidence, missing or stale hashes, generation-provider metadata, machine-translation metadata, AI-translation metadata, and pretranslation metadata are rejected even when their value is false.

The private `reviewed-imports.json` ledgers remain schema version 1. They are written only by the verified importer after public review evidence has passed and are not interchangeable with public schema version 2 seals.

## Privacy and content boundary

Public translation material may contain static product copy, stable keys, repository-relative source locations, synthetic examples, and approved screenshots.

It must not contain:

- User-authored character names, notes, messages, or library content
- Real user identifiers, email addresses, access tokens, or production payloads
- Environment variables, signed URLs, private storage paths, or credentials
- Absolute developer workstation paths
- Internal logs, exception payloads, or private repository remotes
- Private operational interfaces, including their actions, notifications, emails, API responses, source locations, or screenshots

Placeholder examples must be synthetic. Mark whether a placeholder value is user-authored so translators know it must remain unchanged.

## Suspected policy violation

If a translation may have come from machine or AI translation:

1. Do not merge or import it.
2. Mark the entries `rejected` or return them to draft.
3. Ask the contributor for provenance without requesting private personal information.
4. Have a locale reviewer rewrite and approve the text from the English source and context.
5. Remove the untrusted entries from translation memory before it is used again.
