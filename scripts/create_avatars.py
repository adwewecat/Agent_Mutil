from PIL import Image

# 1. Dũng 1 (Male Director): Headshot from male_ref.jpg
im_m = Image.open('scripts/male_ref.jpg')
# Bounding box of head in male_ref:
head_d1 = im_m.crop((230, 20, 540, 360)).resize((128, 128), Image.Resampling.LANCZOS)
head_d1.save('frontend/public/assets/characters/dung_1.png')

# 2. Dũng 2 (Female Architect): Headshot from female_ref.jpg
im_f = Image.open('scripts/female_ref.jpg')
head_d2 = im_f.crop((320, 20, 680, 420)).resize((128, 128), Image.Resampling.LANCZOS)
head_d2.save('frontend/public/assets/characters/dung_2.png')

# 3. Dũng 3 (Male Dev): Headshot from male_sitting_on_chair
im_m3 = Image.open(r"C:\Users\LAPTOPMUON\.gemini\antigravity-ide\brain\c27b2fb8-5715-49c8-a2d3-2b1f77917301\male_sitting_on_chair_1793058332019.jpg")
head_d3 = im_m3.crop((440, 20, 680, 280)).resize((128, 128), Image.Resampling.LANCZOS)
head_d3.save('frontend/public/assets/characters/dung_3.png')

# 4. Dũng 4 (Female QA): Headshot from female_sitting_on_chair
im_f4 = Image.open(r"C:\Users\LAPTOPMUON\.gemini\antigravity-ide\brain\c27b2fb8-5715-49c8-a2d3-2b1f77917301\female_sitting_on_chair_1793058316867.jpg")
head_d4 = im_f4.crop((460, 20, 710, 290)).resize((128, 128), Image.Resampling.LANCZOS)
head_d4.save('frontend/public/assets/characters/dung_4.png')

print("All 4 avatar portraits saved to frontend/public/assets/characters/")
