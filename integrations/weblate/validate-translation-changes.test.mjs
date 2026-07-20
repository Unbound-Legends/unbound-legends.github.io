import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  parseGitNameStatus,
  validateWeblateChanges,
} from "./validate-translation-changes.mjs";

test("parses NUL-delimited Git name-status output without treating paths as shell input", () => {
  assert.deepEqual(
    parseGitNameStatus(
      "M\0internationalization/rpgsessions/translations/fr/settings.json\0D\0internationalization/rpgsessions/translations/es/maps.po\0",
    ),
    [
      {
        status: "M",
        path: "internationalization/rpgsessions/translations/fr/settings.json",
      },
      {
        status: "D",
        path: "internationalization/rpgsessions/translations/es/maps.po",
      },
    ],
  );
});

test("accepts only additions and modifications to the managed French and Spanish catalogs", () => {
  assert.deepEqual(
    validateWeblateChanges([
      {
        status: "M",
        path: "internationalization/rpgsessions/translations/fr/settings.json",
      },
      {
        status: "A",
        path: "internationalization/rpgsessions/translations/es/maps.po",
      },
    ]),
    [],
  );
});

test("rejects deletion or rename of every Weblate-managed translation file", () => {
  assert.deepEqual(
    validateWeblateChanges([
      {
        status: "D",
        path: "internationalization/rpgsessions/translations/fr/settings.json",
      },
      {
        status: "D",
        path: "internationalization/rpgsessions/translations/es/maps.po",
      },
      {
        status: "R100",
        path: "internationalization/rpgsessions/translations/fr/common.json",
      },
    ]),
    [
      "Weblate may not delete: internationalization/rpgsessions/translations/fr/settings.json",
      "Weblate may not delete: internationalization/rpgsessions/translations/es/maps.po",
      "Weblate may only add or modify translation files: internationalization/rpgsessions/translations/fr/common.json (R100)",
    ],
  );
});

test("rejects changes outside the exact active catalog allowlist", () => {
  assert.deepEqual(
    validateWeblateChanges([
      {
        status: "M",
        path: "internationalization/rpgsessions/translations/fr/_provenance.json",
      },
      {
        status: "M",
        path: "internationalization/rpgsessions/source/en/settings.json",
      },
    ]),
    [
      "Weblate may not modify: internationalization/rpgsessions/translations/fr/_provenance.json",
      "Weblate may not modify: internationalization/rpgsessions/source/en/settings.json",
    ],
  );
});

test("the workflow executes the guard from the trusted base revision and declared branch", async () => {
  const workflow = await readFile(
    new URL("../../.github/workflows/i18n-bridge.yml", import.meta.url),
    "utf8",
  );
  const inventory = JSON.parse(
    await readFile(new URL("./components.json", import.meta.url), "utf8"),
  );
  assert.match(workflow, /pull_request_target:/);
  assert.match(workflow, /github\.event_name == 'pull_request_target'/);
  assert.ok(
    workflow.includes(
      `github.event.pull_request.head.ref == '${inventory.repository.translationBranch}'`,
    ),
  );
  assert.match(
    workflow,
    /git show "\$BASE_SHA:integrations\/weblate\/validate-translation-changes\.mjs"/,
  );
  assert.match(workflow, /node "\$guard" "\$BASE_SHA" "\$HEAD_SHA"/);
  assert.doesNotMatch(
    workflow,
    /run: node integrations\/weblate\/validate-translation-changes\.mjs/,
  );
});
