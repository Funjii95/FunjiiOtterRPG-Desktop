import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import plan from '../../docs/tank-equipment-plan.json';
import artwork from '../src/redesigned-art.json';
import {readCombatRewards} from '../src/CombatRewardPopup';
it('ships all 27 unique tank icons with matching names, sizes and hashes',()=>{expect(plan.items).toHaveLength(27);expect(new Set(plan.items.map(i=>i.id)).size).toBe(27);for(const i of plan.items){const a=artwork[i.id as keyof typeof artwork];expect(a.name).toBe(i.name);expect(a.width).toBe(256);expect(a.height).toBe(256);expect(createHash('sha256').update(readFileSync('public/'+a.src.replace(/^\.\//,''))).digest('hex')).toBe(a.assetSha256);}});
it('accepts Mythic rewards without discarding the victory popup',()=>{const r={Id:'tank',Kind:'dungeon',EnemyName:'Test',AwardedAt:'2026-10-29T12:00:00Z',Pearls:1,Experience:1,Items:[{InstanceId:'one',ItemId:'tank_sentinel_belt',Name:'Abyss-Gürtel',Rarity:10}],Materials:{}};expect(readCombatRewards([r])).toHaveLength(1);expect(readCombatRewards([{...r,Items:[{...r.Items[0],Rarity:11}]}])).toHaveLength(0);});
