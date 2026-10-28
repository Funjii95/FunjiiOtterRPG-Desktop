# Item artwork audit – 28 October 2026

Reviewed the 415 effective item-image mappings in runtime override order, using six contact sheets and direct inspection of suspicious assets. All mapped files exist. The scope is the item catalog (equipment, materials, fish and sushi), not every background or illustration in the application.

## Corrected

54 old assets were replaced with individually generated square illustrations:

- 42 pieces across Gezeitenkönig, Riffwächter, Lagunenläufer, Muschelsprecher, Tangsammler, Küstenläufer and Perlenbuddler.
- Nine Legendary, True and Eternal weapons with complete diagonal silhouettes instead of horizontal strips.
- Three primordial-wrath Eternal pieces that contained remnants of labels from the original board.

The old files were technically square but contained narrow cropped illustrations and flat padding. Dimension validation alone could not detect this. All replacements were visually inspected in three contact sheets before integration. Originals are preserved in the local `artifacts/art-audit/originals` directory; runtime WebP images are 512 × 512 and total 5,454,460 bytes. They are exported without cropping. Prompts and generation provenance are recorded in `item-art-generation.json` (built-in image_gen).

Stable item IDs are unchanged, including previously owned items. Runtime overrides point to `items/audited/`. Existing rarity frames remain; inventory, character, hover, upgrade and reward views now pass the actual item's rarity instead of relying solely on the illustration's default rarity.

## Validation

- Effective catalog: every mapped file exists and is nonempty.
- All 54 replacements: correct runtime mapping, unique digest, verified file hash, 512 × 512 metadata and rarity mapping.
- Existing item and starter artwork tests: pass (five targeted tests total).
- Windows and Twitch production UI builds: pass.
- Twitch panel (320px) and mobile (390px): images decode at 512px, actual instance rarity reaches the image frame, all navigation groups remain usable without horizontal overflow (two browser tests pass).

This is a source/build correction. It has not yet been published as a new Windows installer or uploaded to Twitch.
