# game-table translation context

English source strings for the game-table namespace.

Source revision: `catalogs@2026-07-20.profile-page-1`

Source digest: `sha256:8ec2afa9197c7b8010c7789caac0ab813b20f3516624eac9bd99ef94bf5456b9`

## `game-table:initiative.label`

English: Initiative

Section label for choosing whether an NDS character skill is used for proactive or reactive initiative.

Surface: web. Audience: personal. UI role: label.

Route or operation: /char/nds/:characterId skill editor

Visible when: The skill modal is open for a skill that can be assigned an initiative function.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 28 characters.

Do not translate: none.

Related keys: none.

Source locations: `apps/web-ui/src/features/char/legacy/skills/skill-modal.tsx:358` anchored by `ui.initiative.label`; `packages/i18n/locales/en/game-table.json:2`.

Tone: Concise

Translator notes: Initiative is the encounter turn-order mechanic. This label introduces the Proactive and Reactive choices for one character skill; it is not a tracker heading.

## `game-table:notifications.story-point-flipped`

English: {{authorName}} flipped a story point

Recipient-personal browser push framing that summarizes who flipped a story point in the game.

Surface: push. Audience: personal. UI role: notification.

Route or operation: Browser push payloads built by the web app and import server

Visible when: A game member flips a story point and each recipient receives notification framing in their account locale.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 120 characters.

Placeholder `authorName` (string): Display name of the person who flipped the story point. Example: Bree. User-authored: yes.

Do not translate: none.

Related keys: `game-table:story-point.flipped_one`, `game-table:story-point.flipped_other`.

Source locations: `apps/import-server/src/push-notifications/build-push-delivery-groups.ts:55` anchored by `game-table:notifications.story-point-flipped`; `apps/web-ui/src/features/game-table/components/chat/chat-notifiers.tsx:217` anchored by `buildNotificationPayload`; `apps/web-ui/src/features/game-table/utils/build-notification-payload.ts:57` anchored by `game-table:notifications.story-point-flipped`; `packages/i18n/locales/en/game-table.json:5`.

Translator notes: Translate only the personal notification framing. The stored shared event text remains in the game's language. Keep the author name placeholder unchanged.

## `game-table:story-point.flipped_one`

English: Flipped {{count}} {{pointLabel}} point from {{fromLabel}} to {{toLabel}}!

Shared game output announcing that one story point moved between the configured pools.

Surface: generated-game-output. Audience: game-shared. UI role: generated-sentence.

Route or operation: Story-point pool update

Visible when: Exactly one story point is flipped between the game's configured pools.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: not specified.

Placeholder `count` (number): Number of story points moved between pools. Example: 1. User-authored: no.

Placeholder `fromLabel` (string): Game theme label for the pool the point moved from. Example: Light. User-authored: yes.

Placeholder `pointLabel` (string): Game theme label for a story point. Example: Destiny. User-authored: yes.

Placeholder `toLabel` (string): Game theme label for the pool the point moved to. Example: Dark. User-authored: yes.

Do not translate: none.

Related keys: `game-table:story-point.flipped_other`, `game-table:notifications.story-point-flipped`.

Source locations: `packages/core/src/game/functions/generate-story-point-flip-message.ts:43` anchored by `STORY_POINT_FLIP_TRANSLATION_KEY`; `packages/i18n/locales/en/game-table.json:3`.

Translator notes: Keep all placeholders unchanged. The three label placeholders are configured by the game and must not be translated.

## `game-table:story-point.flipped_other`

English: Flipped {{count}} {{pointLabel}} points from {{fromLabel}} to {{toLabel}}!

Shared game output announcing that multiple story points moved between the configured pools.

Surface: generated-game-output. Audience: game-shared. UI role: generated-sentence.

Route or operation: Story-point pool update

Visible when: Two or more story points are flipped between the game's configured pools.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: not specified.

Placeholder `count` (number): Number of story points moved between pools. Example: 2. User-authored: no.

Placeholder `fromLabel` (string): Game theme label for the pool the points moved from. Example: Light. User-authored: yes.

Placeholder `pointLabel` (string): Game theme label for a story point. Example: Destiny. User-authored: yes.

Placeholder `toLabel` (string): Game theme label for the pool the points moved to. Example: Dark. User-authored: yes.

Do not translate: none.

Related keys: `game-table:story-point.flipped_one`, `game-table:notifications.story-point-flipped`.

Source locations: `packages/core/src/game/functions/generate-story-point-flip-message.ts:43` anchored by `STORY_POINT_FLIP_TRANSLATION_KEY`; `packages/i18n/locales/en/game-table.json:4`.

Translator notes: Keep all placeholders unchanged. The three label placeholders are configured by the game and must not be translated.
