import os, glob
from PIL import Image

brain_dir = r'C:\Users\LAPTOPMUON\.gemini\antigravity-ide\brain\4aa2581c-fc02-48d9-953d-de440330cfd9'
output_dir = r'd:\LAPTRINH\Agent_multi\frontend\public\assets\characters'
os.makedirs(output_dir, exist_ok=True)

chars = {
    'dung_1': glob.glob(os.path.join(brain_dir, 'dung_1_cartoon*.jpg'))[-1],
    'dung_2': glob.glob(os.path.join(brain_dir, 'dung_2_cartoon*.jpg'))[-1],
    'dung_3': glob.glob(os.path.join(brain_dir, 'dung_3_cartoon*.jpg'))[-1],
    'dung_4': glob.glob(os.path.join(brain_dir, 'dung_4_cartoon*.jpg'))[-1]
}

def remove_white_background_pillow(img_path):
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        r, g, b, a = item
        # Calculate max difference to ensure it's neutral white/grey background
        diff = max(abs(r - g), abs(r - b), abs(g - b))
        min_c = min(r, g, b)
        
        if min_c > 240 and diff < 20:
            # Pure white background -> fully transparent
            new_data.append((r, g, b, 0))
        elif min_c > 220 and diff < 15:
            # Soft feather edge
            avg = (r + g + b) / 3.0
            alpha = int(max(0, min(255, (245.0 - avg) / 25.0 * 255.0)))
            new_data.append((r, g, b, alpha))
        else:
            new_data.append((r, g, b, 255))
            
    img.putdata(new_data)
    
    bbox = img.getbbox()
    if bbox:
        w, h = img.size
        pad = 6
        crop_box = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(w, bbox[2] + pad), min(h, bbox[3] + pad))
        img = img.crop(crop_box)
        
    return img

for code, path in chars.items():
    print(f"Processing {code} from {path}...")
    transparent_img = remove_white_background_pillow(path)
    
    # Save high-res
    highres_path = os.path.join(output_dir, f"{code}_highres.png")
    transparent_img.save(highres_path, format="PNG")
    
    # Target sprite: height around 160-200 with preserved aspect ratio
    aspect = transparent_img.width / transparent_img.height
    target_h = 160
    target_w = int(target_h * aspect)
    sprite = transparent_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    out_path = os.path.join(output_dir, f"{code}.png")
    sprite.save(out_path, format="PNG")
    print(f"Saved {code}.png ({target_w}x{target_h}) and {code}_highres.png ({transparent_img.size})")

print("All characters processed successfully!")
