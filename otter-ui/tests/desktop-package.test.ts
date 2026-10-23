import {it,expect} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
it('packages the original assets with a local-only desktop entry',()=>{
 const html=fs.readFileSync('dist/desktop.html','utf8');
 expect(html).not.toContain('twitch-ext.min.js');
 expect(html).toContain("connect-src 'self'");
 const scripts=fs.readdirSync('dist/assets').filter(name=>name.endsWith('.js')).map(name=>fs.readFileSync(path.join('dist/assets',name),'utf8')).join('\n');
 expect(scripts).not.toContain('class MockRpgDataSource');expect(scripts).not.toContain('settleMinigameFixture');
 const check=(dir:string)=>{for(const item of fs.readdirSync(path.join('public',dir),{withFileTypes:true})){const relative=path.join(dir,item.name);if(item.isDirectory())check(relative);else expect(fs.readFileSync(path.join('dist',relative)).equals(fs.readFileSync(path.join('public',relative)))).toBe(true);}};
 check('');
});
