"""Extract the supplied item artwork, without recreating or changing the illustrations.
Each entry records the exact source hash and crop for review and reproducibility.
"""
from pathlib import Path
import json, hashlib, shutil
from PIL import Image, ImageOps, ImageDraw

ROOT=Path(__file__).resolve().parents[2]
SOURCE=Path(__file__).parent/'sources'
OUT=ROOT/'otter-ui/public/items/depths'
SOURCE.mkdir(exist_ok=True); OUT.mkdir(parents=True,exist_ok=True)
files=['d81d90ca-95c6-4528-ab9c-0c5b64ff5d41','d2415797-cf6d-49ff-90b8-9404a7030d2c','eb05ec4c-c812-4d0b-836d-2f75a9c6abf3','ef603256-aa49-4e41-bbc5-874cd97a8ff5','b351585b-a142-444e-bf75-3db11d915ce7','b2abed2a-b8cd-48d2-87fc-bd58989962d3','55dd04af-baff-4cf3-97bf-e11fe39f474b','082fb791-e110-4055-85f6-8f674d9d672b']
images=[]
for n,f in enumerate(files):
    p=SOURCE/f'{n+1}.png'
    if not p.exists(): shutil.copyfile(Path('C:/Users/Benjamin/AppData/Local/Temp')/f'codex-clipboard-{f}.png',p)
    images.append(Image.open(p))
entries={}
def add(id,source,box):
    image=images[source-1].crop(box)
    path=OUT/f'{id}.webp'; image.save(path,'WEBP',quality=94,method=6)
    entries[id]=dict(src=f'./items/depths/{id}.webp',name=id,width=image.width,height=image.height,sourceSha256=hashlib.sha256((SOURCE/f'{source}.png').read_bytes()).hexdigest(),assetSha256=hashlib.sha256(path.read_bytes()).hexdigest(),crop=list(box))
suffix=['helmet','chest','gloves','boots','ring','amulet']
for col,prefix in enumerate(['true_eternal_reef','true_deep_guardian','true_ancient_current']):
    for n,s in enumerate(suffix):
        x=50+col*470+(n%3)*144; y=270+(n//3)*200
        add(prefix+'_'+s,1,(x,y,x+124,y+120))
for col,prefix in enumerate(['abyss_devourer','abyss_blood_dynasty','abyss_sunken_world']):
    for n,s in enumerate(suffix):
        x=49+col*465+(n%3)*143; y=302 if n<3 else 500
        add(prefix+'_'+s,2,(x,y,x+122,y+104))
for row,ids in enumerate([['abyss_void_tide_ring','abyss_devourer_fang','abyss_depth_eye','abyss_blood_pearl_seal','abyss_lost_world_ring','abyss_bone_ring'],['abyss_void_heart','abyss_depthlord_soul','abyss_whisper','abyss_sunken_crown','abyss_infinity_jellyfish','abyss_endless_tide_amulet']]):
    for col,id in enumerate(ids):
        x=24+col*252;y=160 if row==0 else 627
        add(id,4,(x,y,x+226,y+166))
for n,id in enumerate(['cursed_greed_crown','cursed_whisper_chest','cursed_broken_current_claws','cursed_restless_echo_boots','cursed_last_sacrifice_ring','cursed_black_mercy_amulet']):
    x=70+(n%3)*470;y=237 if n<3 else 695
    add(id,5,(x,y,x+414,y+(163 if n<3 else 150)))
materials=['red_pearl','blue_pearl','white_pearl','abyss_shard','true_coral_core','cursed_silk','luminous_scale','rune_shell','pearl_dust','eternal_depth_core']
for n,id in enumerate(materials):
    x=27+(n%5)*303;y=113 if n<5 else 543
    add(id,8,(x,y,x+265,y+193))
add('reinforcement_core',7,(255,180,1030,845))
# Existing four-piece sets keep their stable IDs and existing instances.
for group,ids in enumerate([['deepsea-crown','deepsea-chest','deepsea-grip','deepsea-boots'],['ocean-mask','ocean-garment','ocean-fingers','ocean-flippers'],['warden-helm','warden-chest','warden-gloves','warden-boots'],['wrath-helm','wrath-chest','wrath-gloves','wrath-boots']]):
    for n,id in enumerate(ids):
        x=260+(group%2)*764+n*123;y=164 if group<2 else 638
        add(id,3,(x,y,x+111,y+137))
(ROOT/'otter-ui/src/depths-art.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2),encoding='utf-8')
thumbs=[]
for id,e in entries.items():
    tile=Image.new('RGB',(180,155),'#071323'); im=Image.open(OUT/f'{id}.webp');im.thumbnail((174,118));tile.paste(im,((180-im.width)//2,0));ImageDraw.Draw(tile).text((3,120),id,fill='white');thumbs.append(tile)
sheet=Image.new('RGB',(180*8,155*((len(thumbs)+7)//8)))
for n,t in enumerate(thumbs):sheet.paste(t,((n%8)*180,(n//8)*155))
sheet.save(Path(__file__).parent/'art-contact-sheet.jpg')
print(f'{len(entries)} mapped artwork assets extracted.')
