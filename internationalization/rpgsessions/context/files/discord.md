# discord translation context

English source strings for the discord namespace.

Source revision: `catalogs@2026-07-16.i18n-foundation-2`

Source digest: `sha256:2100df7cd6a8bce5baa0ac23670ec5747f9d1fb876e490ab18fc78ba7b3bd227`

## `discord:destiny.point-type.private.dark-side`

English: dark side

Account-localized label for the dark-side destiny-point pool inside a private Discord validation reply.

Surface: discord. Audience: personal. UI role: label.

Route or operation: Discord slash command /destiny use

Visible when: The invoking account selected the dark-side pool but the private command validation failed.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 24 characters.

Do not translate: none.

Related keys: `discord:destiny.use.error.not-enough-points_one`, `discord:destiny.use.error.not-enough-points_other`, `discord:destiny.point-type.shared.dark-side`.

Source locations: `apps/discord-bot/src/interactions/destiny/utils/get-point-type-label.ts:37` anchored by `translate(getPointTypeTranslationKey`; `packages/i18n/locales/en/discord.json:5`.

Tone: Concise rules vocabulary

Translator notes: This label uses the invoking account or Discord locale. Use the established Star Wars rules term in the target language.

## `discord:destiny.point-type.private.gm`

English: GM

Account-localized label for the game-master-controlled story-point pool inside a private Discord validation reply.

Surface: discord. Audience: personal. UI role: label.

Route or operation: Discord slash command /story use

Visible when: The invoking account selected the GM pool but the private command validation failed.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 24 characters.

Do not translate: none.

Related keys: `discord:destiny.use.error.not-enough-points_one`, `discord:destiny.use.error.not-enough-points_other`, `discord:destiny.point-type.shared.gm`.

Source locations: `apps/discord-bot/src/interactions/destiny/utils/get-point-type-label.ts:37` anchored by `translate(getPointTypeTranslationKey`; `packages/i18n/locales/en/discord.json:3`.

Tone: Concise rules vocabulary

Translator notes: This label uses the invoking account or Discord locale. Use the conventional local abbreviation for game master.

## `discord:destiny.point-type.private.light-side`

English: light side

Account-localized label for the light-side destiny-point pool inside a private Discord validation reply.

Surface: discord. Audience: personal. UI role: label.

Route or operation: Discord slash command /destiny use

Visible when: The invoking account selected the light-side pool but the private command validation failed.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 24 characters.

Do not translate: none.

Related keys: `discord:destiny.use.error.not-enough-points_one`, `discord:destiny.use.error.not-enough-points_other`, `discord:destiny.point-type.shared.light-side`.

Source locations: `apps/discord-bot/src/interactions/destiny/utils/get-point-type-label.ts:37` anchored by `translate(getPointTypeTranslationKey`; `packages/i18n/locales/en/discord.json:4`.

Tone: Concise rules vocabulary

Translator notes: This label uses the invoking account or Discord locale. Use the established Star Wars rules term in the target language.

## `discord:destiny.point-type.private.player`

English: player

Account-localized label for the player-controlled story-point pool inside a private Discord validation reply.

Surface: discord. Audience: personal. UI role: label.

Route or operation: Discord slash command /story use

Visible when: The invoking account selected the player pool but the private command validation failed.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 24 characters.

Do not translate: none.

Related keys: `discord:destiny.use.error.not-enough-points_one`, `discord:destiny.use.error.not-enough-points_other`, `discord:destiny.point-type.shared.player`.

Source locations: `apps/discord-bot/src/interactions/destiny/utils/get-point-type-label.ts:37` anchored by `translate(getPointTypeTranslationKey`; `packages/i18n/locales/en/discord.json:2`.

Tone: Concise rules vocabulary

Translator notes: This label uses the invoking account or Discord locale. Use a noun phrase that reads naturally inside the private insufficient-points sentence.

## `discord:destiny.point-type.shared.dark-side`

English: dark side

Game-localized label for the dark-side destiny-point pool inside a shared Discord confirmation.

Surface: discord. Audience: game-shared. UI role: label.

Route or operation: Discord slash command /destiny use

Visible when: The dark-side pool was changed successfully and the channel receives the shared confirmation.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 24 characters.

Do not translate: none.

Related keys: `discord:destiny.use.success_one`, `discord:destiny.use.success_other`, `discord:destiny.point-type.private.dark-side`.

Source locations: `apps/discord-bot/src/interactions/destiny/utils/get-point-type-label.ts:37` anchored by `translate(getPointTypeTranslationKey`; `packages/i18n/locales/en/discord.json:9`.

Tone: Concise rules vocabulary

Translator notes: This label uses the game's language, not the invoking account's language. Use the established Star Wars rules term in the target language.

## `discord:destiny.point-type.shared.gm`

English: GM

Game-localized label for the game-master-controlled story-point pool inside a shared Discord confirmation.

Surface: discord. Audience: game-shared. UI role: label.

Route or operation: Discord slash command /story use

Visible when: The GM pool was changed successfully and the channel receives the shared confirmation.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 24 characters.

Do not translate: none.

Related keys: `discord:destiny.use.success_one`, `discord:destiny.use.success_other`, `discord:destiny.point-type.private.gm`.

Source locations: `apps/discord-bot/src/interactions/destiny/utils/get-point-type-label.ts:37` anchored by `translate(getPointTypeTranslationKey`; `packages/i18n/locales/en/discord.json:7`.

Tone: Concise rules vocabulary

Translator notes: This label uses the game's language, not the invoking account's language. Use the conventional local abbreviation for game master.

## `discord:destiny.point-type.shared.light-side`

English: light side

Game-localized label for the light-side destiny-point pool inside a shared Discord confirmation.

Surface: discord. Audience: game-shared. UI role: label.

Route or operation: Discord slash command /destiny use

Visible when: The light-side pool was changed successfully and the channel receives the shared confirmation.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 24 characters.

Do not translate: none.

Related keys: `discord:destiny.use.success_one`, `discord:destiny.use.success_other`, `discord:destiny.point-type.private.light-side`.

Source locations: `apps/discord-bot/src/interactions/destiny/utils/get-point-type-label.ts:37` anchored by `translate(getPointTypeTranslationKey`; `packages/i18n/locales/en/discord.json:8`.

Tone: Concise rules vocabulary

Translator notes: This label uses the game's language, not the invoking account's language. Use the established Star Wars rules term in the target language.

## `discord:destiny.point-type.shared.player`

English: player

Game-localized label for the player-controlled story-point pool inside a shared Discord confirmation.

Surface: discord. Audience: game-shared. UI role: label.

Route or operation: Discord slash command /story use

Visible when: The player pool was changed successfully and the channel receives the shared confirmation.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 24 characters.

Do not translate: none.

Related keys: `discord:destiny.use.success_one`, `discord:destiny.use.success_other`, `discord:destiny.point-type.private.player`.

Source locations: `apps/discord-bot/src/interactions/destiny/utils/get-point-type-label.ts:37` anchored by `translate(getPointTypeTranslationKey`; `packages/i18n/locales/en/discord.json:6`.

Tone: Concise rules vocabulary

Translator notes: This label uses the game's language, not the invoking account's language. Use a noun phrase that reads naturally after the shared confirmation count.

## `discord:destiny.use.error.amount-range`

English: You can only use between {{minimum}} and {{maximum}} points at a time.

Private Discord validation reply shown when an account requests an unsupported number of story or destiny points.

Surface: discord. Audience: personal. UI role: validation.

Route or operation: Discord slash commands /story use and /destiny use

Visible when: The invoking account supplied an amount below the minimum or above the maximum, before any game state changed.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 100 characters.

Placeholder `maximum` (number): Largest number of points allowed in one use command. Example: 10. User-authored: no.

Placeholder `minimum` (number): Smallest number of points allowed in one use command. Example: 1. User-authored: no.

Do not translate: none.

Related keys: `discord:destiny.use.error.not-enough-points_one`, `discord:destiny.use.error.not-enough-points_other`.

Source locations: `apps/discord-bot/src/interactions/destiny/use.command.ts:41` anchored by `discord:destiny.use.error.amount-range`; `packages/i18n/locales/en/discord.json:10`.

Tone: Direct and helpful

Translator notes: This reply is ephemeral and only the invoking account can see it. Keep both numeric placeholders and make the inclusive range clear.

## `discord:destiny.use.error.not-enough-points_one`

English: There aren't enough {{pointType}} points to use. You asked for {{requested}}, but there's only {{available}}.

Private Discord error explaining that the selected game pool contains fewer points than the account requested, when exactly one point remains.

Surface: discord. Audience: personal. UI role: validation.

Route or operation: Discord slash commands /story use and /destiny use

Visible when: The selected shared pool has exactly one point, fewer than the requested amount, and no points were changed.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 180 characters.

Placeholder `available` (number): Number of matching points currently available in the shared game pool. Example: 1. User-authored: no.

Placeholder `pointType` (enum): Prelocalized app-owned point-pool label rendered with the same account translator as this private reply. Example: light side. User-authored: no.

Placeholder `requested` (number): Number of points the invoking account asked to use. Example: 2. User-authored: no.

Do not translate: none.

Related keys: `discord:destiny.use.error.not-enough-points_other`, `discord:destiny.use.error.amount-range`.

Source locations: `apps/discord-bot/src/interactions/destiny/use.command.ts:57` anchored by `discord:destiny.use.error.not-enough-points`; `packages/i18n/locales/en/discord.json:11`.

Tone: Clear and non-accusatory

Translator notes: This reply is ephemeral and uses the invoking account's language, not the game's language. The pointType value is already localized by a discord:destiny.point-type key and is not user-authored text. Keep the distinction between requested and available counts.

## `discord:destiny.use.error.not-enough-points_other`

English: There aren't enough {{pointType}} points to use. You asked for {{requested}}, but there are only {{available}}.

Private Discord error explaining that the selected game pool contains fewer points than the account requested, when zero or multiple points remain.

Surface: discord. Audience: personal. UI role: validation.

Route or operation: Discord slash commands /story use and /destiny use

Visible when: The selected shared pool has zero or multiple points, fewer than the requested amount, and no points were changed.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 180 characters.

Placeholder `available` (number): Number of matching points currently available in the shared game pool. Example: 0. User-authored: no.

Placeholder `pointType` (enum): Prelocalized app-owned point-pool label rendered with the same account translator as this private reply. Example: light side. User-authored: no.

Placeholder `requested` (number): Number of points the invoking account asked to use. Example: 3. User-authored: no.

Do not translate: none.

Related keys: `discord:destiny.use.error.not-enough-points_one`, `discord:destiny.use.error.amount-range`.

Source locations: `apps/discord-bot/src/interactions/destiny/use.command.ts:57` anchored by `discord:destiny.use.error.not-enough-points`; `packages/i18n/locales/en/discord.json:12`.

Tone: Clear and non-accusatory

Translator notes: This reply is ephemeral and uses the invoking account's language, not the game's language. The pointType value is already localized by a discord:destiny.point-type key and is not user-authored text. Keep the distinction between requested and available counts.

## `discord:destiny.use.success_one`

English: Used {{count}} {{pointType}} point!

Discord embed heading confirming that one story or destiny point was used in the shared game.

Surface: discord. Audience: game-shared. UI role: notification.

Route or operation: Discord slash commands /story use and /destiny use

Visible when: Exactly one point changed pools and the bot is showing the updated shared game state.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 256 characters.

Placeholder `count` (number): Number of points used by the command. Example: 1. User-authored: no.

Placeholder `pointType` (enum): Prelocalized app-owned point-pool label rendered with the same game translator as this shared Discord heading. Example: player. User-authored: no.

Do not translate: none.

Related keys: `discord:destiny.use.success_other`, `game-table:story-point.flipped_one`.

Source locations: `apps/discord-bot/src/interactions/destiny/use.command.ts:160` anchored by `discord:destiny.use.success`; `packages/i18n/locales/en/discord.json:13`.

Tone: Concise and affirmative

Translator notes: This heading is visible to the Discord channel and therefore uses the game's language. The pointType value is already localized by a discord:destiny.point-type key and is not user-authored text. Keep the confirmation concise because Discord embed author names allow at most 256 characters.

## `discord:destiny.use.success_other`

English: Used {{count}} {{pointType}} points!

Discord embed heading confirming that multiple story or destiny points were used in the shared game.

Surface: discord. Audience: game-shared. UI role: notification.

Route or operation: Discord slash commands /story use and /destiny use

Visible when: Two or more points changed pools and the bot is showing the updated shared game state.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 256 characters.

Placeholder `count` (number): Number of points used by the command. Example: 2. User-authored: no.

Placeholder `pointType` (enum): Prelocalized app-owned point-pool label rendered with the same game translator as this shared Discord heading. Example: player. User-authored: no.

Do not translate: none.

Related keys: `discord:destiny.use.success_one`, `game-table:story-point.flipped_other`.

Source locations: `apps/discord-bot/src/interactions/destiny/use.command.ts:160` anchored by `discord:destiny.use.success`; `packages/i18n/locales/en/discord.json:14`.

Tone: Concise and affirmative

Translator notes: This heading is visible to the Discord channel and therefore uses the game's language. The pointType value is already localized by a discord:destiny.point-type key and is not user-authored text. Keep the confirmation concise because Discord embed author names allow at most 256 characters.
