from PIL import Image

def clean_female_typing():
    img = Image.open(r"C:\Users\LAPTOPMUON\.gemini\antigravity-ide\brain\c27b2fb8-5715-49c8-a2d3-2b1f77917301\female_seated_worker_1793058115129.jpg").convert("RGBA")
    w, h = img.size
    pix = img.load()
    
    # We want only the woman, chair, and keyboard under her hands!
    # The monitor is at x > 640 and y < 330.
    # The desk is white at x > 720 and y > 350.
    for y in range(h):
        for x in range(w):
            r, g, b, a = pix[x, y]
            # White background:
            if r > 235 and g > 235 and b > 235:
                pix[x, y] = (255, 255, 255, 0)
            # Remove the monitor area on the right:
            elif x > 640 and y < 330:
                pix[x, y] = (255, 255, 255, 0)
            # Remove desk edge on right:
            elif x > 760 and y < 550:
                pix[x, y] = (255, 255, 255, 0)
            # Remove table leg on bottom right:
            elif x > 850:
                pix[x, y] = (255, 255, 255, 0)
            elif r > 220 and g > 220 and b > 220 and (x > 580 and y < 300):
                # Desk surface
                pix[x, y] = (255, 255, 255, 0)
                
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    img.save("frontend/public/sprites/characters/female_typing_chair.png")
    print("Cleaned female_typing_chair.png saved, size:", img.size)

clean_female_typing()
