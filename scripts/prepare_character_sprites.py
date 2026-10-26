import os
from PIL import Image

output_dir = "frontend/public/sprites/characters"
os.makedirs(output_dir, exist_ok=True)

def transparentize(src_path, dst_path, threshold=240):
    img = Image.open(src_path).convert("RGBA")
    datas = img.getdata()
    new_data = []
    for r, g, b, a in datas:
        if r >= threshold and g >= threshold and b >= threshold:
            new_data.append((255, 255, 255, 0))
        elif r >= threshold - 16 and g >= threshold - 16 and b >= threshold - 16:
            min_c = min(r, g, b)
            alpha = int(255 * (threshold - min_c) / 16.0)
            new_data.append((r, g, b, max(0, min(255, alpha))))
        else:
            new_data.append((r, g, b, 255))
            
    img.putdata(new_data)
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    img.save(dst_path, "PNG")
    print(f"Processed: {dst_path}, size: {img.size}")

# Process files
brain_dir = r"C:\Users\LAPTOPMUON\.gemini\antigravity-ide\brain\c27b2fb8-5715-49c8-a2d3-2b1f77917301"

# 1. Male sitting on chair (facing viewer / meeting / relax)
transparentize(
    os.path.join(brain_dir, "male_sitting_on_chair_1793058332019.jpg"),
    os.path.join(output_dir, "male_sitting_chair.png")
)

# 2. Female sitting on chair (facing viewer / meeting / relax)
transparentize(
    os.path.join(brain_dir, "female_sitting_on_chair_1793058316867.jpg"),
    os.path.join(output_dir, "female_sitting_chair.png")
)

# 3. Male typing on chair (desk work)
transparentize(
    os.path.join(brain_dir, "male_typing_chair_1793058345323.jpg"),
    os.path.join(output_dir, "male_typing_chair.png")
)

# 4. Copy walks
img_mw = Image.open("scripts/male_walk.png")
img_mw.save(os.path.join(output_dir, "male_walk.png"))

img_fw = Image.open("scripts/female_walk.png")
img_fw.save(os.path.join(output_dir, "female_walk.png"))

print("All character sprites saved to frontend/public/sprites/characters!")
