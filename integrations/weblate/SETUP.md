# Self-hosted Weblate setup

This setup keeps translation work public, source catalogs maintainer-owned, and deployment credentials outside this repository.

## 1. Deploy and operate Weblate

Use Weblate's [official Docker deployment](https://docs.weblate.org/en/latest/admin/install/docker.html) with pinned image versions, PostgreSQL, Valkey, HTTPS, SMTP, and persistent `/app/data` storage. Allocate at least 2 CPUs and 3 GB RAM; 4 GB RAM is a more comfortable starting point.

Back up the database, `/app/data`, uploaded screenshots, configuration, and GitHub App credentials. Use encrypted remote backups and test restores. Follow the [backup](https://docs.weblate.org/en/latest/admin/backup.html) and [upgrade](https://docs.weblate.org/en/latest/admin/upgrade.html) guides before changing versions.

Keep production secrets in the deployment environment. Do not add them to this repository.

## 2. Connect GitHub

1. Create the `unbound-legends` Weblate workspace and an `rpgsessions` project.
2. Register Weblate's GitHub App under the workspace.
3. Install it for the `Unbound-Legends` organization with access only to `unbound-legends.github.io`.
4. Import the repository through that connection.
5. Use `master` as the repository branch and `weblate/translations` as the push branch.
6. Configure Weblate to open or update a pull request. Never push translations directly to `master`.
7. Protect `master`, require both the `validate` and base-trusted `guard-weblate` checks, and require CODEOWNER review for protected artifacts. The guard uses `pull_request_target` only to inspect the name-status diff with code loaded from the base revision; it never executes files from the pull request.

See Weblate's [code-hosting integration guide](https://docs.weblate.org/en/latest/admin/code-hosting.html).

## 3. Configure the project workflow

- Public project, registration required to translate.
- Guests can view but cannot add suggestions.
- Translators can translate, comment, and suggest only in French or Spanish.
- Reviewers receive language-scoped review permission.
- Reviews are enabled and VCS commits include only approved translations.
- The Weblate pull-request branch may add or modify only the listed French and Spanish target catalogs. CI rejects deletion, rename, provenance, source, context, tool, and policy changes.
- Source editing and new-language creation are disabled for volunteers.
- Component language filter is `^(fr|es)$`.
- Suggestions are enabled, voting and automatic acceptance are disabled.
- Translation propagation between components is disabled.
- No machine translation or LLM service is configured.
- The automatic translation add-on is not installed.
- Shared and workspace translation memory are disabled.
- Translation-memory suggestions stay disabled for the pilot. Enable project-only memory later only after verifying that pending or rejected entries cannot be suggested as approved human work and documenting a cleanup process.

Weblate documents the [review workflow](https://docs.weblate.org/en/latest/workflows.html) and [approved-only component setting](https://docs.weblate.org/en/latest/admin/projects.html).

## 4. Create components

Treat [`components.json`](components.json) as the exact inventory. It is not a native import file.

Create `settings` first through the GitHub App connection because it owns the repository clone. Create each remaining component from the existing `settings` component and use `weblate://rpgsessions/settings` as its linked repository.

The current `common.json` and `email.json` sources are empty. Defer those components until they receive their first source strings if the installed Weblate version refuses an empty monolingual base. The other components and the context sync do not depend on them.

The six JSON components use Weblate's [`i18nextv4` format](https://docs.weblate.org/en/latest/formats/i18next.html). In the Weblate UI, set each English JSON path as the **Monolingual base language file**, leave **Template for new translations** blank, and use the listed file mask. The Maps component uses [Gettext PO](https://docs.weblate.org/en/latest/formats/gettext.html); leave its monolingual base blank, set the checked-in POT as **Template for new translations**, enable `weblate.gettext.msgmerge`, and set the `po_remove_obsolete` file-format parameter to `true`. This prevents `#~` obsolete blocks from entering the strict active PO files.

Seeded French and Spanish files allow deterministic language discovery. Do not install MO generation, cleanup, or automatic translation add-ons during the pilot.

## 5. Synchronize translator context

i18next JSON cannot carry descriptions or screenshots. The private RPGSessions context sync reads `context/strings.json` and `screenshots.json`, then updates Weblate source-unit explanations and screenshot associations through the API.

Create a project-scoped token with only source-info and screenshot permissions. It must not have translation, review, VCS, or automatic translation permissions. After creating a pilot component, run the private contract probe from a trusted checkout:

```sh
WEBLATE_API_URL=https://weblate.example.com \
  pnpm i18n:weblate-sync -- \
  --bridge ../unbound-legends.github.io/internationalization/rpgsessions \
  --maps-root /path/to/private/SessionsMaps \
  --project rpgsessions \
  --probe-contract
```

Review the deliberately unverified output against the installed Weblate version and pilot component as described in the private RPGSessions runbook. Store the resulting reviewed contract outside this public repository. Then run the dry-run command after an English source export is merged:

```sh
WEBLATE_API_URL=https://weblate.example.com \
  pnpm i18n:weblate-sync -- \
  --bridge ../unbound-legends.github.io/internationalization/rpgsessions \
  --maps-root /path/to/private/SessionsMaps \
  --project rpgsessions \
  --contract ~/.config/rpgsessions/weblate-i18next-contract.json
```

The default is a dry run. Review the plan before adding `--apply`. The token is supplied through `WEBLATE_API_TOKEN` and must never be stored here.

The sync must fail on missing, duplicate, or source-mismatched units. It may update explanations, flags, screenshots, and associations only. It must never change source strings, target translations, approval state, or VCS settings. Weblate exposes these operations through its [units](https://docs.weblate.org/en/latest/api.html#units) and [screenshots](https://docs.weblate.org/en/latest/api.html#screenshots) APIs.

## 6. Run the pilot

Start with `settings` and `maps` before enabling every component.

1. Confirm French and Spanish discovery from the seeded files.
2. Probe a normal key, dotted key, plural family, duplicate English value, and interpolation placeholder.
3. Sync one full explanation and one screenshot. Confirm both appear in French and Spanish editor views.
4. Translate with one account and approve with a separate reviewer account.
5. Confirm unapproved values do not reach the Git branch or pull request.
6. Change and retire application keys. Confirm the source exporter archives affected nonempty human text under `orphaned/translations.json`, blanks changed active values, removes only retired active keys or namespace files, and leaves approval evidence invalidated.
7. Change and retire keyed POT messages. Confirm the source exporter carries `msgstr` forward only for an unchanged stable key and exact `msgid`, archives changed or removed human text, blanks changed and new messages, preserves `#. Key:` comments, placeholders, and headers, and produces no `#~` entries.
8. Confirm all components update one pull request and nothing outside `translations/` changes.
9. Run `npm test` here and the private importer in report-only mode.
10. Back up and restore the pilot before wider volunteer access.

Record the installed Weblate version and the observed i18next plural unit shape before enabling context synchronization. Exact nested/plural API keys, approved-only serialization after source edits, screenshot repository paths, PO serialization, and the shared pull request behavior must be verified against the deployed version rather than assumed.

## 7. Release reviewed translations

Weblate approval does not create RPGSessions review evidence. After every expected unit for one locale is approved and the Weblate translation PR is merged, create a separate maintainer branch, run the public reviewer sealer in dry-run mode, inspect the result, then apply it and open a protected review-evidence PR. The Weblate branch is deliberately blocked from authoring provenance files. Protected branch review supplies reviewer identity.

Draft validation ignores existing review evidence, so a catalog-only Weblate PR can pass while its old seal is stale. Release validation still rejects the locale until a maintainer reseals it.

The private importer accepts only complete, safe catalogs whose content hash, source revision, source digest, human provenance, and review status match the review evidence. Translation changes after sealing invalidate the evidence.

Before opening volunteer registration, choose and publish translation contribution terms. This repository does not currently grant a license.
