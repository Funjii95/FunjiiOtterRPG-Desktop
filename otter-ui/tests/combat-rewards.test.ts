import {it,expect} from 'vitest';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {CombatRewardContent,readCombatRewards,type CombatReward} from '../src/CombatRewardPopup';
const receipt:CombatReward={Id:'boss:one',Kind:'boss',EnemyId:'boss_korallus',EnemyName:'Korallus, der Riffkönig',ZoneId:'sunny_lagoon',AwardedAt:'2026-10-26T01:00:00Z',Pearls:123,Experience:456,Items:[{InstanceId:'one',ItemId:'starter_crab_breaker',Name:'Krabbenbrecher',Rarity:4}],Materials:{white_pearl:3}};
it('shows only awarded currencies, individual items and material amounts with images',()=>{const html=renderToStaticMarkup(createElement(CombatRewardContent,{reward:receipt,onClose(){}}));for(const text of ['123 Perlen','456 EP','Krabbenbrecher','3 × Weiße Perle','boss_korallus.png','5 Sekunden'])expect(html).toContain(text);expect(html).not.toContain('Mögliche Beute');});
it('does not label partial participation as a boss kill and rejects malformed notification data',()=>{expect(renderToStaticMarkup(createElement(CombatRewardContent,{reward:{...receipt,Kind:'participation'},onClose(){}}))).not.toContain('Kampf gewonnen!');expect(readCombatRewards([receipt,{...receipt,Items:[null]},{...receipt,Pearls:-1}])).toEqual([receipt]);});
