import {it,expect} from 'vitest';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {BossGallery,type AreaBossView} from '../src/BossGallery';
it('shared regional mimic shows the common HP bar, exact drop chance and attack button',()=>{
 const view:AreaBossView={enabled:true,isMimic:true,bosses:[{Id:'boss_krysalith',Name:'Mimic – Kristallrachen der Grotten',AreaId:'crystal_grotto',Level:60,BaseHp:640000,Attack:480,Experience:20000,Pearls:1200,ItemChance:50,Rarity:'Legendary',Materials:['reinforcement_core'],Ability:'Splittermaul',Enabled:true}],selectedBossId:'boss_krysalith',locked:false,remaining:.75,active:true,participants:2,log:[],victory:false,settled:false};
 const html=renderToStaticMarkup(createElement(BossGallery,{view,hp:200,maxHp:300,buffs:[],busy:false,canAttack:true,canSelect:true,cooldown:0,onAttack:()=>{},onSelect:()=>{}}));
 for(const text of ['GEMEINSAMER MIMIC-KAMPF','Gemeinsame Mimic-HP','Mimic angreifen','640.000','50 %','./mimics/crystal_grotto.webp','Kristallrachen'])expect(html).toContain(text);
 expect(html).not.toContain('src="./bosses/');
});
