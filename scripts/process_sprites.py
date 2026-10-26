from PIL import Image

def transparentize_pil(src_path, dst_path, threshold=242):
    img = Image.open(src_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        r, g, b, a = item
        if r >= threshold and g >= threshold and b >= threshold:
            new_data.append((255, 255, 255, 0))
        elif r >= threshold - 15 and g >= threshold - 15 and b >= threshold - 15:
            # Soft edge
            min_c = min(r, g, b)
            alpha = int(255 * (threshold - min_c) / 15.0)
            new_data.append((r, g, b, max(0, min(255, alpha))))
        else:
            new_data.append((r, g, b, 255))
            
    img.putdata(new_data)
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    img.save(dst_path, "PNG")
    print(f"Saved: {dst_path}, size: {img.size}")

transparentize_pil(
    r"C:\Users\LAPTOPMUON\.gemini\antigravity-ide\brain\c27b2fb8-5715-49c8-a2d3-2b1f77917301\male_standing_walk_1793058202260.jpg",
    "scripts/male_walk.png"
)
transparentize_pil(
    r"C:\Users\LAPTOPMUON\.gemini\antigravity-ide\brain\c27b2fb8-5715-49c8-a2d3-2b1f77917301\female_standing_walk_white_1793058218873.jpg",
    "scripts/female_walk.png"
)
