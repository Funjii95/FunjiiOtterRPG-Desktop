"""Package individual generated originals for the UI; retain alpha and source provenance."""
from pathlib import Path
from PIL import Image
import hashlib,json,re,shutil
root=Path(__file__).resolve().parent.parent
prompts=json.loads((root/'docs/mythic-dawn-art-prompts.json').read_text(encoding='utf-8'))
catalog=(root/'tools/plugin-release/RaidClipPlugin/Services/RpgDawnHealerCatalog.cs').read_text(encoding='utf-8')
names=re.findall(r'"([^"]+)"',re.search(r'Names=\[(.*?)\];',catalog).group(1))
manifest_path=root/'otter-ui/src/redesigned-art.json'
rarities_path=root/'otter-ui/src/item-rarities.json'
manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
rarities=json.loads(rarities_path.read_text(encoding='utf-8'))
target=root/'otter-ui/public/items/mythic-dawn';target.mkdir(parents=True,exist_ok=True)
originals=root/'artifacts/mythic-dawn/originals';originals.mkdir(parents=True,exist_ok=True)
plan=[]
assert len(prompts)==len(names)==11
for item,name in zip(prompts,names):
 source=Path(item['source']);id=item['id'];shutil.copy2(source,originals/(id+'.png'))
 im=Image.open(source).convert('RGBA');assert im.getextrema()[3][0]==0
 im.thumbnail((256,256),Image.Resampling.LANCZOS)
 out=target/(id+'.webp');im.save(out,quality=93,method=6)
 manifest[id]=dict(src='./items/mythic-dawn/'+out.name,name=name,width=im.width,height=im.height,sourceSha256=hashlib.sha256(source.read_bytes()).hexdigest(),assetSha256=hashlib.sha256(out.read_bytes()).hexdigest())
 rarities[id]='Mythic';plan.append(dict(id=id,name=name,rarity='Mythic'))
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
rarities_path.write_text(json.dumps(rarities,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(root/'docs/mythic-dawn-art.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Packaged 11 individual white-gold mythic icons with alpha and rarity mapping.')
