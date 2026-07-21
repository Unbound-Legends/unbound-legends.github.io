# achievements translation context

English source strings for the achievements namespace.

Source revision: `catalogs@2026-07-20.profile-page-1`

Source digest: `sha256:8ec2afa9197c7b8010c7789caac0ab813b20f3516624eac9bd99ef94bf5456b9`

## `achievements:summary.action`

English: View All Achievements

Button or link that applies the achievements summary card.

Surface: web. Audience: personal. UI role: button.

Route or operation: /user/profile

Visible when: The achievements summary card is visible on the profile page.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 40 characters.

Do not translate: none.

Related keys: none.

Source locations: `apps/web-ui/src/features/achievements/components/achievements-section.tsx:76` anchored by `achievements:summary.action`; `packages/i18n/locales/en/achievements.json:2`.

Tone: Direct

## `achievements:summary.heading`

English: Achievements

Heading that identifies the achievements summary card.

Surface: web. Audience: personal. UI role: heading.

Route or operation: /user/profile

Visible when: The achievements summary card is visible on the profile page.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 64 characters.

Do not translate: none.

Related keys: none.

Source locations: `apps/web-ui/src/features/achievements/components/achievements-section.tsx:18` anchored by `achievements:summary.heading`; `apps/web-ui/src/features/achievements/components/achievements-section.tsx:49` anchored by `achievements:summary.heading`; `packages/i18n/locales/en/achievements.json:3`.

Tone: Direct

## `achievements:summary.unlocked_one`

English: {{unlockedCount}} of {{totalCount}} unlocked

Progress summary comparing unlocked achievements with the total available.

Surface: web. Audience: personal. UI role: body.

Route or operation: /user/profile

Visible when: The achievements summary card is visible on the profile page.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 260 characters.

Placeholder `totalCount` (number): Locale-formatted total number of available achievements. Example: 24. User-authored: no.

Placeholder `unlockedCount` (number): Locale-formatted number of achievements the user has unlocked. Example: 3. User-authored: no.

Do not translate: `{{unlockedCount}}`, `{{totalCount}}`.

Related keys: `achievements:summary.unlocked_other`.

Source locations: `packages/i18n/locales/en/achievements.json:4`.

Tone: Direct

## `achievements:summary.unlocked_other`

English: {{unlockedCount}} of {{totalCount}} unlocked

Progress summary comparing unlocked achievements with the total available.

Surface: web. Audience: personal. UI role: body.

Route or operation: /user/profile

Visible when: The achievements summary card is visible on the profile page.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 260 characters.

Placeholder `totalCount` (number): Locale-formatted total number of available achievements. Example: 24. User-authored: no.

Placeholder `unlockedCount` (number): Locale-formatted number of achievements the user has unlocked. Example: 3. User-authored: no.

Do not translate: `{{unlockedCount}}`, `{{totalCount}}`.

Related keys: `achievements:summary.unlocked_one`.

Source locations: `packages/i18n/locales/en/achievements.json:5`.

Tone: Direct
