# Unbound Legends translation bridge

This repository publishes the source catalogs and translator context used by RPGSessions. It is a build-time collaboration bridge. RPGSessions does not fetch these files at runtime.

The active translation workspace is [`internationalization/rpgsessions/`](internationalization/rpgsessions/). It contains:

- generated English source catalogs
- detailed per-string context and approved screenshots
- French and Spanish translation files
- dependency-free validation and reviewer sealing tools
- a generated orphan archive when source changes retire nonempty human translations
- the human-only translation policy

The files directly under `internationalization/app/` and the top-level `internationalization/rpgsessions/{en,fr,es}.json` files are frozen compatibility snapshots. They are not current source catalogs. Exact archival copies and checksums live under [`internationalization/legacy/`](internationalization/legacy/).

## Weblate

The repository is ready to connect to a self-hosted Weblate instance. The intended component layout and maintainer setup are in [`integrations/weblate/`](integrations/weblate/). Weblate may add or modify only French and Spanish active catalogs under `internationalization/rpgsessions/translations/` through a pull request. CI rejects deletions, renames, review evidence, source, context, and configuration changes from that branch.

Machine translation, generative AI translation, and automatic pretranslation are not permitted. Volunteers may use approved human translation memory from this project.

## Validation

Use Node.js 22 or newer. There are no package dependencies.

```sh
npm test
```

Draft validation accepts incomplete human work, rejects malformed or unsafe catalogs, and ignores existing review seals while catalogs are being updated. Release validation requires current seals. A maintainer creates new content-bound review evidence only after a locale is complete and reviewed:

```sh
npm run i18n:seal -- --locale fr
npm run i18n:seal -- --locale fr --apply
```

The first command is a dry run. The second writes the review evidence. Git history and protected branch review record who approved it.
