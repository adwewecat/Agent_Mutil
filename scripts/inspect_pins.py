import re
import urllib.request

def get_pinimg(pin_id):
    url = f"https://www.pinterest.com/pin/{pin_id}/"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        imgs = re.findall(r'https://i\.pinimg\.com/[^"\'\s]+\.(?:jpg|png|webp)', html)
        print(f"Pin {pin_id} images:")
        for img in set(imgs):
            if '736x' in img or 'originals' in img:
                print(" ->", img)

get_pinimg("1099582065812564429")
get_pinimg("998321442479763235")
