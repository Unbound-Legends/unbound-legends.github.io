# Glossary and ownership scaffold

The glossary is a human-maintained product artifact. It defines meaning and consistency, not just word substitution. Locale owners should fill this document or its eventual structured replacement before broad catalog translation begins.

## Locale ownership

| Locale         | Primary translator      | Reviewer                  | Backup reviewer | Status | Contact channel |
| -------------- | ----------------------- | ------------------------- | --------------- | ------ | --------------- |
| English (`en`) | Product copy owner: TBD | Engineering reviewer: TBD | TBD             | source | TBD             |
| French (`fr`)  | TBD                     | TBD                       | TBD             | pilot  | TBD             |
| Spanish (`es`) | TBD                     | TBD                       | TBD             | pilot  | TBD             |

Do not place private email addresses in the public bridge. Use public GitHub handles or a community role/channel intended for publication.

## Namespace ownership

| Namespace       | English source owner | Product reviewer | Required locale review | Notes                                        |
| --------------- | -------------------- | ---------------- | ---------------------- | -------------------------------------------- |
| `common`        | TBD                  | TBD              | French and Spanish     | Shared product chrome                        |
| `enums`         | TBD                  | TBD              | French and Spanish     | Stable rules and product terms               |
| `auth`          | TBD                  | TBD              | French and Spanish     | Account and access copy                      |
| `settings`      | TBD                  | TBD              | French and Spanish     | Personal and game settings                   |
| `character`     | TBD                  | TBD              | French and Spanish     | Character sheet chrome only                  |
| `game-table`    | TBD                  | TBD              | French and Spanish     | Shared and personal scope must be identified |
| `dice`          | TBD                  | TBD              | French and Spanish     | Plural and result terminology                |
| `discord`       | TBD                  | TBD              | French and Spanish     | Discord length and naming limits             |
| `notifications` | TBD                  | TBD              | French and Spanish     | Recipient-facing copy                        |
| `email`         | TBD                  | TBD              | French and Spanish     | Recipient-facing copy                        |
| `maps`          | TBD                  | TBD              | French and Spanish     | SessionsMaps UI only                         |
| `errors`        | TBD                  | TBD              | French and Spanish     | Stable public error meaning                  |

## Term glossary

Translations remain `TBD` until a locale owner approves them. Product names and user-authored values may be intentionally unchanged.

| Term ID                  | English term     | Product meaning and context              | Translate? | French      | Spanish     | Owner | Status and notes                                 |
| ------------------------ | ---------------- | ---------------------------------------- | ---------- | ----------- | ----------- | ----- | ------------------------------------------------ |
| `product.rpgsessions`    | RPGSessions      | Product name                             | No         | RPGSessions | RPGSessions | TBD   | locked product name                              |
| `role.game-master`       | Game Master      | Person who runs a game                   | Yes        | TBD         | TBD         | TBD   | decide abbreviation policy separately            |
| `role.player`            | Player           | Person participating in a game           | Yes        | TBD         | TBD         | TBD   | do not confuse with player character             |
| `actor.player-character` | Player Character | Character controlled by a player         | Yes        | TBD         | TBD         | TBD   | define approved abbreviation                     |
| `actor.adversary`        | Adversary        | Non-player actor category in RPGSessions | Yes        | TBD         | TBD         | TBD   | product taxonomy term                            |
| `game.story-point`       | Story Point      | Shared narrative game resource           | Yes        | TBD         | TBD         | TBD   | theme labels may be user-authored                |
| `character.wounds`       | Wounds           | Narrative dice character resource        | Yes        | TBD         | TBD         | TBD   | preserve official system meaning                 |
| `character.strain`       | Strain           | Narrative dice character resource        | Yes        | TBD         | TBD         | TBD   | preserve official system meaning                 |
| `dice.advantage`         | Advantage        | Narrative dice positive side effect      | Yes        | TBD         | TBD         | TBD   | coordinate singular and plural                   |
| `dice.threat`            | Threat           | Narrative dice negative side effect      | Yes        | TBD         | TBD         | TBD   | coordinate singular and plural                   |
| `dice.triumph`           | Triumph          | Narrative dice result symbol             | Yes        | TBD         | TBD         | TBD   | coordinate with official terminology policy      |
| `dice.despair`           | Despair          | Narrative dice result symbol             | Yes        | TBD         | TBD         | TBD   | coordinate with official terminology policy      |
| `maps.map`               | Map              | SessionsMaps play surface                | Yes        | TBD         | TBD         | TBD   | distinguish from map asset or page when needed   |
| `library.data-library`   | Data Library     | RPGSessions library feature name         | Yes        | TBD         | TBD         | TBD   | official library content is out of initial scope |

## Per-term decision record

When a term needs more discussion, record:

- Term ID
- Locale
- Approved translation
- Meaning and disallowed alternatives
- Grammatical forms or gender
- Singular and plural forms
- Abbreviation
- Screens where it appears
- Translator and reviewer
- Approval date and source revision

## Scope reminder

The glossary governs product chrome and generated product messages. It does not authorize translation of user-authored character names, custom skill names, notes, chat, game content, or custom data-library entries.
