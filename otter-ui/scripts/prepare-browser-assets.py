"""Prepare the browser frontend for same-origin Cloud Run hosting. Re-encode PNG assets, retain originals in the UI project."""
from pathlib import Path
from PIL import Image
import io,json,hashlib,sys
ROOT=Path(__file__).resolve().parents[2]
source=ROOT/'otter-ui/dist-browser';target=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else ROOT/'artifacts/browser'
assert (source/'browser.html').is_file()
target.mkdir(parents=True,exist_ok=True)
images={p.relative_to(source).as_posix():p.relative_to(source).with_suffix('.browser.webp').as_posix() for p in source.rglob('*.png')}
count=0;total=0;expected=set()
for p in source.rglob('*'):
 if not p.is_file():continue
 name=p.relative_to(source).as_posix();data=p.read_bytes()
 if name in images:
  with Image.open(p) as im:
   im.thumbnail((1024,1024),Image.Resampling.LANCZOS);buf=io.BytesIO();im.save(buf,'WEBP',quality=90,method=6);data=buf.getvalue()
  name=images[name]
 elif p.suffix in {'.html','.js','.css'}:
  text=data.decode('utf-8-sig')
  for old,new in images.items():text=text.replace(old,new)
  data=text.encode('utf-8')
 expected.add(name)
 out=target/name;out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(data);count+=1;total+=len(data)
# Remove only obsolete generated files inside the explicitly selected output directory.
for old in target.rglob('*'):
 if old.is_file() and old.relative_to(target).as_posix() not in expected:
  assert old.resolve().is_relative_to(target.resolve())
  old.unlink()
print(f'Browser frontend prepared: {count} files, {total} bytes.')
