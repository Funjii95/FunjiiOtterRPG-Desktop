import {it,expect} from 'vitest';
import {existsSync} from 'node:fs';
import art from '../src/starter-art.json';
it('all twenty legendary beginner icons have individual runtime assets',()=>{expect(Object.keys(art)).toHaveLength(20);expect(new Set(Object.values(art).map(a=>a.assetSha256)).size).toBe(20);for(const a of Object.values(art)){expect(existsSync(new URL('../public/'+a.src.replace('./',''),import.meta.url))).toBe(true);expect(a.width).toBeGreaterThan(0);}});
