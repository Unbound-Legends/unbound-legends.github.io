# settings translation context

English source strings for the settings namespace.

Source revision: `catalogs@2026-07-20.profile-page-1`

Source digest: `sha256:8ec2afa9197c7b8010c7789caac0ab813b20f3516624eac9bd99ef94bf5456b9`

## `settings:account.error`

English: Unable to update your settings. Please try again.

Safe message shown when account settings cannot be saved: account error.

Surface: web. Audience: personal. UI role: notification.

Route or operation: /user/profile

Visible when: The Account Settings card is visible on the profile page.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 180 characters.

Do not translate: none.

Related keys: none.

Source locations: `apps/web-ui/src/features/user/sections/settings.tsx:121` anchored by `settings:account.error`; `packages/i18n/locales/en/settings.json:2`.

Tone: Calm and direct

## `settings:account.heading`

English: Account Settings

Heading that identifies the account settings account control.

Surface: web. Audience: personal. UI role: heading.

Route or operation: /user/profile

Visible when: The Account Settings card is visible on the profile page.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 64 characters.

Do not translate: none.

Related keys: none.

Source locations: `apps/web-ui/src/features/user/sections/settings.tsx:42` anchored by `settings:account.heading`; `apps/web-ui/src/features/user/sections/settings.tsx:114` anchored by `settings:account.heading`; `packages/i18n/locales/en/settings.json:3`.

Tone: Direct

## `settings:account.save`

English: Save Settings

Button or link that applies the account settings account save control.

Surface: web. Audience: personal. UI role: button.

Route or operation: /user/profile

Visible when: The Account Settings card is visible on the profile page.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 40 characters.

Do not translate: none.

Related keys: none.

Source locations: `apps/web-ui/src/features/user/sections/settings.tsx:255` anchored by `settings:account.save`; `packages/i18n/locales/en/settings.json:4`.

Tone: Direct

## `settings:account.success`

English: Settings updated

Confirmation shown after the account settings account control succeeds.

Surface: web. Audience: personal. UI role: notification.

Route or operation: /user/profile

Visible when: The Account Settings card is visible on the profile page.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 180 characters.

Do not translate: none.

Related keys: none.

Source locations: `apps/web-ui/src/features/user/sections/settings.tsx:89` anchored by `settings:account.success`; `packages/i18n/locales/en/settings.json:5`.

Tone: Calm and direct

## `settings:dice-shorthand.label`

English: Dice Shorthand Style

Label or prompt for the account settings dice shorthand control.

Surface: web. Audience: personal. UI role: label.

Route or operation: /user/profile

Visible when: The Account Settings card is visible on the profile page.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 64 characters.

Do not translate: none.

Related keys: none.

Source locations: `apps/web-ui/src/features/user/sections/settings.tsx:51` anchored by `settings:dice-shorthand.label`; `apps/web-ui/src/features/user/sections/settings.tsx:158` anchored by `settings:dice-shorthand.label`; `packages/i18n/locales/en/settings.json:6`.

Tone: Direct

## `settings:dice-shorthand.placeholder`

English: Select a shorthand style

Label or prompt for the account settings dice shorthand placeholder control.

Surface: web. Audience: personal. UI role: label.

Route or operation: /user/profile

Visible when: The Account Settings card is visible on the profile page.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 64 characters.

Do not translate: none.

Related keys: none.

Source locations: `apps/web-ui/src/features/user/sections/settings.tsx:163` anchored by `settings:dice-shorthand.placeholder`; `packages/i18n/locales/en/settings.json:7`.

Tone: Direct

## `settings:dice-theme.label`

English: Dice Theme

Label or prompt for the account settings dice theme control.

Surface: web. Audience: personal. UI role: label.

Route or operation: /user/profile

Visible when: The Account Settings card is visible on the profile page.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 64 characters.

Do not translate: none.

Related keys: none.

Source locations: `apps/web-ui/src/features/user/sections/settings.tsx:47` anchored by `settings:dice-theme.label`; `apps/web-ui/src/features/user/sections/settings.tsx:132` anchored by `settings:dice-theme.label`; `packages/i18n/locales/en/settings.json:8`.

Tone: Direct

## `settings:dice-theme.placeholder`

English: Select a dice theme

Label or prompt for the account settings dice theme placeholder control.

Surface: web. Audience: personal. UI role: label.

Route or operation: /user/profile

Visible when: The Account Settings card is visible on the profile page.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 64 characters.

Do not translate: none.

Related keys: none.

Source locations: `apps/web-ui/src/features/user/sections/settings.tsx:136` anchored by `settings:dice-theme.placeholder`; `packages/i18n/locales/en/settings.json:9`.

Tone: Direct

## `settings:game-language.description`

English: Sets the language for newly generated shared game output. Existing game history is not changed.

Explains that the selected game language affects only shared game output generated after the setting is saved.

Surface: web. Audience: personal. UI role: body.

Route or operation: /game/:gameId/settings

Visible when: Game settings are open and the game language picker is visible.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 150 characters.

Do not translate: none.

Related keys: `settings:game-language.label`, `settings:game-language.placeholder`.

Source locations: `apps/web-ui/src/features/game/components/game-settings.tsx:324` anchored by `settings:game-language.description`; `packages/i18n/locales/en/settings.json:15`.

Tone: Clear and explicit

Translator notes: Newly generated shared game output includes persisted system-authored chat messages and notifications created for the game after this setting is saved. Existing game history keeps the rendered text that was stored when each entry was created. Do not imply that user-authored character, item, or chat text will be translated.

## `settings:game-language.label`

English: Game Language

Label for the GM-controlled language picker in game settings.

Surface: web. Audience: personal. UI role: label.

Route or operation: /game/:gameId/settings

Visible when: Game settings are open. The control is editable by a GM and read-only for other game members.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 32 characters.

Do not translate: none.

Related keys: `settings:game-language.placeholder`, `settings:game-language.description`.

Source locations: `apps/web-ui/src/features/game/components/game-settings.tsx:303` anchored by `settings:game-language.label`; `packages/i18n/locales/en/settings.json:13`.

Tone: Direct

Translator notes: This is one language shared by the game, not the signed-in user's personal interface language. Keep Game distinct from Account Language.

## `settings:game-language.placeholder`

English: Select a language

Placeholder shown by the game language picker when it has no visible selection.

Surface: web. Audience: personal. UI role: label.

Route or operation: /game/:gameId/settings

Visible when: Game settings are open and the game language control has no visible selection.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 40 characters.

Do not translate: none.

Related keys: `settings:game-language.label`, `settings:game-language.description`.

Source locations: `apps/web-ui/src/features/game/components/game-settings.tsx:307` anchored by `settings:game-language.placeholder`; `packages/i18n/locales/en/settings.json:14`.

Tone: Brief and instructive

Translator notes: Use an instruction that asks the GM to choose one language for the game.

## `settings:language.description`

English: Language for app labels. Your characters keep their own skill names.

Supporting copy below the account language picker. Clarifies that user-authored skill names are not renamed.

Surface: web. Audience: personal. UI role: body.

Route or operation: /user/profile

Visible when: The Language section is visible.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 140 characters.

Do not translate: none.

Related keys: `settings:language.label`, `settings:language.preview-option`.

Source locations: `apps/web-ui/src/features/user/sections/settings.tsx:245` anchored by `settings:language.description`; `packages/i18n/locales/en/settings.json:11`.

Tone: Direct and reassuring

Translator notes: Skill names means names entered or customized by players, not built-in app labels.

Screenshot `account-language-settings`: [open screenshot](../../screenshots/web-ui/account-language-settings.png). Account language field with the French preview selected and English fallback copy visible. Anchor: `language-description`.

## `settings:language.label`

English: Language

Label for the account language picker.

Surface: web. Audience: personal. UI role: label.

Route or operation: /user/profile

Visible when: The Language section is visible.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 24 characters.

Do not translate: none.

Related keys: `settings:language.description`, `settings:language.preview-option`.

Source locations: `apps/web-ui/src/features/user/sections/settings.tsx:212` anchored by `settings:language.label`; `packages/i18n/locales/en/settings.json:10`.

Tone: Direct

Translator notes: Use the standard term for the language selected for the application interface.

Screenshot `account-language-settings`: [open screenshot](../../screenshots/web-ui/account-language-settings.png). Account language field with the French preview selected and English fallback copy visible. Anchor: `language-label`.

## `settings:language.preview-option`

English: {{languageName}} (Preview)

Formats a preview-stage language name in account and game language pickers so users know that its catalog is incomplete.

Surface: web. Audience: personal. UI role: label.

Route or operation: /user/profile and /game/:gameId/settings

Visible when: An account or game language picker is open and the option is available for preview before its catalog is complete.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 40 characters.

Placeholder `languageName` (string): The localized display name of the language offered by this option. Example: French. User-authored: no.

Do not translate: `{{languageName}}`.

Related keys: `settings:language.label`, `settings:language.description`.

Source locations: `apps/web-ui/src/features/game/components/game-settings.tsx:314` anchored by `settings:language.preview-option`; `apps/web-ui/src/features/user/sections/settings.tsx:232` anchored by `settings:language.preview-option`; `packages/i18n/locales/en/settings.json:12`.

Tone: Concise and transparent

Translator notes: Keep the preview status visibly attached to the language name. The placeholder is another translated interface label, not user-authored text. Reorder the placeholder and preview status if that reads more naturally in the target language.

Screenshot `account-language-settings`: [open screenshot](../../screenshots/web-ui/account-language-settings.png). Account language field with the French preview selected and English fallback copy visible. Anchor: `preview-selected-value`.

## `settings:site-theme.label`

English: Site Theme

Label or prompt for the account settings site theme control.

Surface: web. Audience: personal. UI role: label.

Route or operation: /user/profile

Visible when: The Account Settings card is visible on the profile page.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 64 characters.

Do not translate: none.

Related keys: none.

Source locations: `apps/web-ui/src/features/user/sections/settings.tsx:55` anchored by `settings:site-theme.label`; `apps/web-ui/src/features/user/sections/settings.tsx:184` anchored by `settings:site-theme.label`; `packages/i18n/locales/en/settings.json:16`.

Tone: Direct

## `settings:site-theme.placeholder`

English: Select a theme

Label or prompt for the account settings site theme placeholder control.

Surface: web. Audience: personal. UI role: label.

Route or operation: /user/profile

Visible when: The Account Settings card is visible on the profile page.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 64 characters.

Do not translate: none.

Related keys: none.

Source locations: `apps/web-ui/src/features/user/sections/settings.tsx:188` anchored by `settings:site-theme.placeholder`; `packages/i18n/locales/en/settings.json:17`.

Tone: Direct
