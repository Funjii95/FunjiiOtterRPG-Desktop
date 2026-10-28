"""Package visually reviewed replacement artwork; never crop the generated originals."""
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
AUDIT = ROOT / 'artifacts/art-audit'
ASSETS = ROOT / 'otter-ui/public/items/audited'
ORIGINALS = AUDIT / 'originals'
plan = json.loads((AUDIT / 'replacement-plan.json').read_text(encoding='utf-8-sig'))

def sheets():
    available = [p for p in plan if (ORIGINALS / (p['id'] + '.png')).exists()]
    for start in range(0, len(available), 24):
        sheet = Image.new('RGB', (1200, 960), '#071725')
        draw = ImageDraw.Draw(sheet)
        for i, entry in enumerate(available[start:start + 24]):
            x, y = (i % 6) * 200, (i // 6) * 240
            im = Image.open(ORIGINALS / (entry['id'] + '.png')).convert('RGB')
            im.thumbnail((192, 200))
            sheet.paste(im, (x + (200-im.width)//2, y))
            draw.text((x+3,y+202), entry['id'].replace('_','\n',1), fill='white')
        sheet.save(AUDIT / f'new-sheet-{start//24}.jpg', quality=92)
    print(f'{len(available)}/{len(plan)} generated')

def package():
    missing = [p['id'] for p in plan if not (ORIGINALS / (p['id']+'.png')).exists()]
    if missing:
        raise RuntimeError(f'Missing originals: {missing}')
    manifest_path = ROOT / 'otter-ui/src/redesigned-art.json'
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    provenance_path = ROOT / 'docs/item-art-generation.json'
    provenance = json.loads(provenance_path.read_text(encoding='utf-8'))
    records = {p['id']:p for p in provenance['assets']}
    for entry in plan:
        original = ORIGINALS / (entry['id']+'.png')
        output = ASSETS / (entry['id']+'.webp')
        with Image.open(original) as im:
            if im.width != im.height:
                raise ValueError(f'Not square: {original}')
            im.convert('RGB').resize((512,512), Image.Resampling.LANCZOS).save(output, quality=92, method=6)
        manifest[entry['id']] = dict(src='./items/audited/'+output.name, name=entry['name'], width=512, height=512,
            sourceSha256=hashlib.sha256(original.read_bytes()).hexdigest(), assetSha256=hashlib.sha256(output.read_bytes()).hexdigest())
        record = AUDIT / 'generated' / (entry['id']+'.json')
        records[entry['id']] = json.loads(record.read_text(encoding='utf-8'))
    manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n', encoding='utf-8')
    provenance['assets'] = list(records.values())
    provenance_path.write_text(json.dumps(provenance,ensure_ascii=False,indent=2)+'\n', encoding='utf-8')
    print(f'Packaged {len(plan)} reviewed replacements')

if __name__ == '__main__':
    import sys
    package() if '--package' in sys.argv else sheets()
