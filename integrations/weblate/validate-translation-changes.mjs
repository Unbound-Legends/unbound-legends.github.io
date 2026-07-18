#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const MANAGED_TRANSLATION_PATH =
  /^internationalization\/rpgsessions\/translations\/(?:fr|es)\/(?:common|discord|email|enums|game-table|settings)\.json$|^internationalization\/rpgsessions\/translations\/(?:fr|es)\/maps\.po$/;

export function validateWeblateChanges(changes) {
  const issues = [];
  for (const change of changes) {
    const status = String(change.status ?? "");
    const path = String(change.path ?? "");
    if (status.startsWith("D")) {
      issues.push(`Weblate may not delete: ${path}`);
      continue;
    }
    if (!["A", "M"].includes(status)) {
      issues.push(
        `Weblate may only add or modify translation files: ${path} (${status})`,
      );
      continue;
    }
    if (!MANAGED_TRANSLATION_PATH.test(path)) {
      issues.push(`Weblate may not modify: ${path}`);
    }
  }
  return issues;
}

export function parseGitNameStatus(output) {
  const tokens = String(output)
    .split("\0")
    .filter((token) => token.length > 0);
  const changes = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const tab = token.indexOf("\t");
    if (tab !== -1) {
      changes.push({ status: token.slice(0, tab), path: token.slice(tab + 1) });
      continue;
    }
    const path = tokens[index + 1];
    if (path === undefined)
      throw new Error("git diff emitted an incomplete name-status record");
    changes.push({ status: token, path });
    index += 1;
  }
  return changes;
}

function validateRef(value, label) {
  if (
    typeof value !== "string" ||
    !/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(value)
  ) {
    throw new TypeError(`${label} must be a Git ref name`);
  }
  return value;
}

function main(argv) {
  if (argv.length !== 2) {
    throw new TypeError(
      "usage: node integrations/weblate/validate-translation-changes.mjs <base-ref> <head-ref>",
    );
  }
  const base = validateRef(argv[0], "base ref");
  const head = validateRef(argv[1], "head ref");
  const result = spawnSync(
    "git",
    [
      "diff",
      "--no-renames",
      "--name-status",
      "--diff-filter=ACDMRTUXB",
      "-z",
      `${base}...${head}`,
      "--",
    ],
    { encoding: "utf8" },
  );
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(result.stderr.trim() || `git diff exited ${result.status}`);
  const issues = validateWeblateChanges(parseGitNameStatus(result.stdout));
  if (issues.length > 0) {
    for (const issue of issues) console.error(issue);
    process.exitCode = 1;
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
