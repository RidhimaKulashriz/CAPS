from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/upload/search_images/cwwmJMQmQQz3.png')
target = Path('/home/ubuntu/caps-workstation/client/public/research/whole-slide.jpg')
with Image.open(source) as image:
    image = image.convert('RGB')
    image.thumbnail((1200, 1000), Image.Resampling.LANCZOS)
    image.save(target, 'JPEG', quality=82, optimize=True, progressive=True)
print(target, target.stat().st_size)
