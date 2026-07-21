# maps translation context

English source strings for the maps namespace.

Source revision: `catalogs@2026-07-20.profile-page-1`

Source digest: `sha256:d50f33526842ca0c8e7c608935161cb8509d625618bcd38e18c3d3e9d29e9395`

## `maps:toolbar.actors.tooltip`

English: Actors
Open character and vehicle quick sheets, including actors without map tokens

Tooltip for opening quick character and vehicle sheets, including sheets for actors that have no token on the map.

Surface: maps. Audience: personal. UI role: tooltip.

Route or operation: Sessions Maps embedded game table

Visible when: The user hovers the actors icon in the left map toolbar.

Formatting: `plain-text`. Preserve whitespace: yes.

Maximum length: 160 characters.

Do not translate: none.

Related keys: `maps:toolbar.assets.tooltip`.

Source locations: `scenes/ToolContainer/tool_container.tscn:909` anchored by `tooltip_text`.

Tone: Concise

Translator notes: Actor is the shared term for a character or vehicle represented in the game. Token means a placed map object, not an authentication token. Keep the panel title and purpose on separate lines.

## `maps:toolbar.assets.tooltip`

English: Map Assets
List, filter, and jump to every named token; manage players

Tooltip for opening the panel that lists named map tokens, supports filtering and navigation, and manages players.

Surface: maps. Audience: personal. UI role: tooltip.

Route or operation: Sessions Maps embedded game table

Visible when: The game master hovers the map-assets icon in the left map toolbar.

Formatting: `plain-text`. Preserve whitespace: yes.

Maximum length: 140 characters.

Do not translate: none.

Related keys: `maps:toolbar.layers.tooltip`, `maps:toolbar.actors.tooltip`.

Source locations: `scenes/ToolContainer/tool_container.tscn:894` anchored by `tooltip_text`.

Tone: Concise

Translator notes: Asset means an image or token placed on the map. Token means a placed map object, not an authentication token. Keep the panel title and purpose on separate lines.

## `maps:toolbar.brush.tooltip`

English: Brush Tool (B)

Tooltip for the freehand brush used to draw annotations directly on the map.

Surface: maps. Audience: personal. UI role: tooltip.

Route or operation: Sessions Maps embedded game table

Visible when: The user hovers the brush icon in the left map toolbar.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 36 characters.

Do not translate: `B`.

Related keys: `maps:toolbar.eraser.tooltip`.

Source locations: `scenes/ToolContainer/tool_container.tscn:769` anchored by `tooltip_text`.

Tone: Concise

Translator notes: Brush means the freehand drawing tool, not an object in the game world.

## `maps:toolbar.clocks.tooltip`

English: Progress Clocks
Pie clocks and counters for tracking pressure

Tooltip for opening progress clocks and counters used to track mounting pressure or progress in a tabletop game.

Surface: maps. Audience: personal. UI role: tooltip.

Route or operation: Sessions Maps embedded game table

Visible when: The user hovers the progress-clock icon in the left map toolbar.

Formatting: `plain-text`. Preserve whitespace: yes.

Maximum length: 110 characters.

Do not translate: none.

Related keys: none.

Source locations: `scenes/ToolContainer/tool_container.tscn:879` anchored by `tooltip_text`.

Tone: Concise

Translator notes: Progress clock is a tabletop roleplaying-game term for a segmented circle that tracks progress or danger. Keep the panel title and purpose on separate lines.

## `maps:toolbar.eraser.tooltip`

English: Eraser Tool (E)

Tooltip for the tool that erases freehand drawings from the map.

Surface: maps. Audience: personal. UI role: tooltip.

Route or operation: Sessions Maps embedded game table

Visible when: The user hovers the eraser icon in the left map toolbar.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 36 characters.

Do not translate: `E`.

Related keys: `maps:toolbar.brush.tooltip`.

Source locations: `scenes/ToolContainer/tool_container.tscn:784` anchored by `tooltip_text`.

Tone: Concise

Translator notes: Eraser removes map drawings, not placed assets or walls.

## `maps:toolbar.fog.tooltip`

English: Fog of war editor

Tooltip for opening the game master's fog-of-war editor, which hides or reveals map regions for players.

Surface: maps. Audience: personal. UI role: tooltip.

Route or operation: Sessions Maps embedded game table

Visible when: The game master hovers the fog icon in the left map toolbar.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 48 characters.

Do not translate: none.

Related keys: `maps:toolbar.wall.tooltip`.

Source locations: `scenes/ToolContainer/tool_container.tscn:816` anchored by `tooltip_text`.

Tone: Concise

Translator notes: Fog of war is the tabletop-map mechanic that controls what players can see.

## `maps:toolbar.hand.tooltip`

English: Hand Tool (H, or hold space for temporary hand tool)

Tooltip for the hand tool used to pan the map without moving assets.

Surface: maps. Audience: personal. UI role: tooltip.

Route or operation: Sessions Maps embedded game table

Visible when: The user hovers the hand icon in the left map toolbar.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 90 characters.

Do not translate: `H`, `space`.

Related keys: `maps:toolbar.pointer.tooltip`.

Source locations: `scenes/ToolContainer/tool_container.tscn:754` anchored by `tooltip_text`.

Tone: Concise

Translator notes: Hand tool is the standard graphics-editor term for panning the viewport.

## `maps:toolbar.lasso.tooltip`

English: Lasso Selection Tool (L)
Drag to draw selection area
Select multiple assets at once

Tooltip for drawing a selection region around several map assets so they can be manipulated together.

Surface: maps. Audience: personal. UI role: tooltip.

Route or operation: Sessions Maps embedded game table

Visible when: The user hovers the lasso icon in the left map toolbar.

Formatting: `plain-text`. Preserve whitespace: yes.

Maximum length: 130 characters.

Do not translate: `L`.

Related keys: `maps:toolbar.pointer.tooltip`.

Source locations: `scenes/ToolContainer/tool_container.tscn:799` anchored by `tooltip_text`.

Tone: Instructional

Translator notes: Lasso is the graphics-editor selection tool, not an in-world rope. Keep the tool name, gesture, and result on separate lines.

## `maps:toolbar.layers.tooltip`

English: Layers Panel
Organize assets and drawings into layers

Tooltip for opening the panel that organizes map assets and freehand drawings into visual layers.

Surface: maps. Audience: personal. UI role: tooltip.

Route or operation: Sessions Maps embedded game table

Visible when: The user hovers the layers icon in the left map toolbar.

Formatting: `plain-text`. Preserve whitespace: yes.

Maximum length: 100 characters.

Do not translate: none.

Related keys: `maps:toolbar.assets.tooltip`.

Source locations: `scenes/ToolContainer/tool_container.tscn:864` anchored by `tooltip_text`.

Tone: Concise

Translator notes: Layers has the same meaning as layers in an image editor. Keep the panel title and purpose on separate lines.

## `maps:toolbar.note.tooltip`

English: Note Tool (N)
Click on map to place a sticky note

Tooltip for placing a sticky note containing text at a point on the map.

Surface: maps. Audience: personal. UI role: tooltip.

Route or operation: Sessions Maps embedded game table

Visible when: The user hovers the note icon in the left map toolbar.

Formatting: `plain-text`. Preserve whitespace: yes.

Maximum length: 90 characters.

Do not translate: `N`.

Related keys: none.

Source locations: `scenes/ToolContainer/tool_container.tscn:848` anchored by `tooltip_text`.

Tone: Instructional

Translator notes: Sticky note is a text annotation placed on the map. Keep the tool name and action on separate lines.

## `maps:toolbar.ping.tooltip`

English: Ping Tool
Click the map once to ping a location
Shortcuts: P at cursor, Alt-click to ping, Alt-drag to trace

Tooltip for the tool that briefly marks a map location or traces a visible path for other players.

Surface: maps. Audience: personal. UI role: tooltip.

Route or operation: Sessions Maps embedded game table

Visible when: The user hovers the ping icon in the left map toolbar.

Formatting: `plain-text`. Preserve whitespace: yes.

Maximum length: 180 characters.

Do not translate: `P`, `Alt-click`, `Alt-drag`.

Related keys: `maps:toolbar.pointer.tooltip`.

Source locations: `scenes/ToolContainer/tool_container.tscn:737` anchored by `tooltip_text`.

Tone: Instructional

Translator notes: Ping means a temporary attention marker visible to the table. Keep the tool name, basic action, and shortcuts on separate lines.

## `maps:toolbar.pointer.tooltip`

English: Pointer Tool (V)

Tooltip for the default pointer tool used to select and manipulate map assets.

Surface: maps. Audience: personal. UI role: tooltip.

Route or operation: Sessions Maps embedded game table

Visible when: The user hovers the pointer icon in the left map toolbar.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 36 characters.

Do not translate: `V`.

Related keys: `maps:toolbar.hand.tooltip`, `maps:toolbar.lasso.tooltip`.

Source locations: `scenes/ToolContainer/tool_container.tscn:721` anchored by `tooltip_text`.

Tone: Concise

Translator notes: Pointer is the default selection and manipulation tool, not the mouse cursor itself.

## `maps:toolbar.wall.tooltip`

English: Wall tool (W)
Click to place wall start, click again to place end
Walls block light in the lighting system

Tooltip for drawing wall segments that block light in the map lighting system.

Surface: maps. Audience: personal. UI role: tooltip.

Route or operation: Sessions Maps embedded game table

Visible when: The game master hovers the wall icon in the left map toolbar.

Formatting: `plain-text`. Preserve whitespace: yes.

Maximum length: 150 characters.

Do not translate: `W`.

Related keys: `maps:wall-mode.add.tooltip`, `maps:toolbar.fog.tooltip`.

Source locations: `scenes/ToolContainer/tool_container.tscn:831` anchored by `tooltip_text`.

Tone: Instructional

Translator notes: Wall means a segment in the lighting system. Keep the tool name, placement instructions, and lighting effect on separate lines.

## `maps:wall-mode.add.button`

English: Add

Compact button label that selects the mode for creating new light-blocking wall segments.

Surface: maps. Audience: personal. UI role: button.

Route or operation: Sessions Maps embedded game table

Visible when: The game master has opened the wall tool and chooses a wall editing mode.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 12 characters.

Do not translate: none.

Related keys: `maps:wall-mode.add.tooltip`, `maps:wall-mode.remove.button`, `maps:wall-mode.trace.button`.

Source locations: `scenes/ToolContainer/tool_container.tscn:660` anchored by `text`.

Tone: Action-oriented

Translator notes: Use a short imperative verb because this button is only 50 pixels wide.

## `maps:wall-mode.add.tooltip`

English: Add Wall Mode

Tooltip for switching the wall editor into the mode that creates new light-blocking wall segments.

Surface: maps. Audience: personal. UI role: tooltip.

Route or operation: Sessions Maps embedded game table

Visible when: The game master has opened the wall tool and the wall-mode controls are visible.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 48 characters.

Do not translate: none.

Related keys: `maps:wall-mode.add.button`, `maps:wall-mode.remove.tooltip`.

Source locations: `scenes/ToolContainer/tool_container.tscn:654` anchored by `tooltip_text`.

Tone: Concise

Translator notes: Wall means a segment that blocks light in the map lighting system.

## `maps:wall-mode.remove.button`

English: Remove

Compact button label that selects the mode for removing existing light-blocking wall segments.

Surface: maps. Audience: personal. UI role: button.

Route or operation: Sessions Maps embedded game table

Visible when: The game master has opened the wall tool and chooses a wall editing mode.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 12 characters.

Do not translate: none.

Related keys: `maps:wall-mode.remove.tooltip`, `maps:wall-mode.add.button`, `maps:wall-mode.trace.button`.

Source locations: `scenes/ToolContainer/tool_container.tscn:670` anchored by `text`.

Tone: Action-oriented

Translator notes: Use a short imperative verb because this button is only 50 pixels wide.

## `maps:wall-mode.remove.tooltip`

English: Remove Wall Mode

Tooltip for switching the wall editor into the mode that removes existing light-blocking wall segments.

Surface: maps. Audience: personal. UI role: tooltip.

Route or operation: Sessions Maps embedded game table

Visible when: The game master has opened the wall tool and the wall-mode controls are visible.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 48 characters.

Do not translate: none.

Related keys: `maps:wall-mode.remove.button`, `maps:wall-mode.add.tooltip`.

Source locations: `scenes/ToolContainer/tool_container.tscn:665` anchored by `tooltip_text`.

Tone: Concise

Translator notes: Wall means a segment that blocks light in the map lighting system.

## `maps:wall-mode.trace.button`

English: Trace

Compact button label that selects the mode for tracing a map asset outline into wall segments.

Surface: maps. Audience: personal. UI role: button.

Route or operation: Sessions Maps embedded game table

Visible when: The game master has opened the wall tool and chooses a wall editing mode.

Formatting: `plain-text`. Preserve whitespace: no.

Maximum length: 12 characters.

Do not translate: none.

Related keys: `maps:wall-mode.trace.tooltip`, `maps:wall-mode.add.button`, `maps:wall-mode.remove.button`.

Source locations: `scenes/ToolContainer/tool_container.tscn:681` anchored by `text`.

Tone: Action-oriented

Translator notes: Use a short imperative verb because this button is only 50 pixels wide.

## `maps:wall-mode.trace.tooltip`

English: Trace Asset Shape
Click an asset to auto-generate walls around it

Tooltip for the mode that generates wall segments around the visible outline of a selected map asset.

Surface: maps. Audience: personal. UI role: tooltip.

Route or operation: Sessions Maps embedded game table

Visible when: The game master has opened the wall tool and the wall-mode controls are visible.

Formatting: `plain-text`. Preserve whitespace: yes.

Maximum length: 100 characters.

Do not translate: none.

Related keys: `maps:wall-mode.trace.button`, `maps:toolbar.wall.tooltip`.

Source locations: `scenes/ToolContainer/tool_container.tscn:675` anchored by `tooltip_text`.

Tone: Instructional

Translator notes: Asset means an image or token placed on the map. Keep the title on the first line and the instruction on the second line.
