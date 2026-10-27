"""Package the shared UI for Twitch with compact illustrations, preserving sources."""
from pathlib import Path
import io
import hashlib
import zipfile
from PIL import Image

root = Path(__file__).resolve().parents[1]
build = root / 'otter-ui/dist-twitch'
target = root / 'artifacts/Funjii-Otter-RPG-0.0.3-windows-parity.zip'
cache = root / 'artifacts/twitch-image-cache'
cache.mkdir(parents=True, exist_ok=True)
files = {p.relative_to(build).as_posix(): p.read_bytes() for p in build.rglob('*') if p.is_file()}
replacements = {}
for name, data in list(files.items()):
    if name.endswith('.png') and len(data) > 300_000:
        converted = str(Path(name).with_suffix('.twitch.webp')).replace('\\', '/')
        cached = cache / (hashlib.sha256(data).hexdigest() + '-q92.webp')
        if not cached.exists():
            with Image.open(io.BytesIO(data)) as image:
                image.save(cached, 'WEBP', quality=92, method=6)
        encoded = cached.read_bytes()
        if len(encoded) < len(data):
            files[converted] = encoded
            del files[name]
            replacements[name] = converted
for name in list(files):
    if Path(name).suffix in ('.js', '.css', '.html', '.json'):
        text = files[name].decode('utf-8')
        for old, new in replacements.items():
            text = text.replace(old, new)
        files[name] = text.encode('utf-8')
for name in ['panel.html', 'mobile.html', 'config.html']:
    assert name in files
with zipfile.ZipFile(target, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for name, data in sorted(files.items()):
        archive.writestr(name, data)
print(f'{target}: {target.stat().st_size:,} bytes; {len(replacements)} optimized illustrations')
