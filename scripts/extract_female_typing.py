from PIL import Image

def extract_female_typing():
    brain_dir = r"C:\Users\LAPTOPMUON\.gemini\antigravity-ide\brain\c27b2fb8-5715-49c8-a2d3-2b1f77917301"
    src = f"{brain_dir}\\female_seated_worker_1793058115129.jpg"
    img = Image.open(src).convert("RGBA")
    
    # Crop out the monitor on the right and top
    # The woman and chair are in x: 0..800, y: 0..1024
    w, h = img.size
    datas = img.getdata()
    new_data = []
    for x_idx, (r, g, b, a) in enumerate(datas):
        x = x_idx % w
        y = x_idx // w
        # If right side is the monitor: x > 640 and y < 350
        if x > 640 and y < 350:
            new_data.append((255, 255, 255, 0))
        # If white background
        elif r > 240 and g > 240 and b > 240:
            new_data.append((255, 255, 255, 0))
        # If white desk on bottom right (x > 840 and y > 550)
        elif x > 840:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append((r, g, b, 255))
            
    img.putdata(new_data)
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    img.save("frontend/public/sprites/characters/female_typing_chair.png")
    print("Saved female_typing_chair.png, size:", img.size)

extract_female_typing()
