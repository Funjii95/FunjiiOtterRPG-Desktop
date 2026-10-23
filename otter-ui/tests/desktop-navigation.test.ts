import {it,expect,vi,afterEach} from 'vitest';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {App} from '../src/GraphicalApp';
import {mapProfile} from '../src/remote/model';
import {profile} from './remote-fixtures';
afterEach(()=>vi.unstubAllGlobals());
function render(desktop:boolean,admin=false){
 vi.stubGlobal('location',{pathname:'/index.html'});
 const source:any={mode:'remote',getSnapshot:()=>mapProfile(profile()),subscribe:()=>()=>{},canDispatch:()=>false};
 return renderToStaticMarkup(createElement(App,{source,desktop,desktopAdmin:admin?createElement('section',null,'Adminfunktionen'):undefined}));
}
it('offers all four formerly hidden sections directly in desktop navigation',()=>{
 const nav=render(true).match(/<nav[^>]*>[\s\S]*?<\/nav>/)![0];
 for(const name of ['Talente','Perks','Kochen','Perlen-Minispiele'])expect(nav).toContain(name);
 expect(nav).not.toContain('♛ Admin');
});
it('offers a dedicated Admin navigation entry when the owner-only panel is provided',()=>{
 expect(render(true,true)).toContain('♛ Admin');
 expect(render(false,true)).not.toContain('♛ Admin');
});
