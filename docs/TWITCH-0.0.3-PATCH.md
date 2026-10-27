# Twitch 0.0.3 – Windows parity patch (2026-10-27)

The Twitch build now uses `otter-ui`, the same gameplay components, transport,
catalog mapping and illustrations as Windows 0.9.5. Do not upload the separate,
older `tools/plugin-release/twitch-extension` build or change to version 0.0.8.

- All ten equipment rarities are recognized, including True, Cursed, Abyss,
  Eternal and Divine. A modern inventory no longer rejects the entire profile.
- Current quests, roles, parties, dungeons, regional bosses/Mimics, rewards,
  10/25/50/100 instant dives and accelerated request handling are included.
- Collection inventory, weapon navigation, set previews, source navigation,
  item details and current illustrations are available in the compact panel.
- Twitch Helper authentication is preserved. Windows updater and desktop-only
  administration are not exposed to Twitch viewers.

Build: `pnpm build:twitch` in `otter-ui`; package with
`tools/package-twitch.py` (Python with Pillow). The packager changes only archive
image encoding and references, never source artwork or gameplay data.

Upload archive contents to existing Twitch **0.0.3**, temporarily using Local
Test for editing and returning to Hosted Test afterward. All three entry paths
remain `panel.html`, `mobile.html`, `config.html`. Backend remains the configured
rc1 endpoint. No new Twitch version or review submission is required.

Validation: TypeScript, current gameplay regression tests and `pnpm test:twitch`
at 320px/390px, using synthetic Twitch authorization and profiles containing all
ten rarities. This does not claim a real player action was executed.
