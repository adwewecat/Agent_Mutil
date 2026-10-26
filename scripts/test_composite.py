from PIL import Image

bg = Image.open('frontend/public/sprites/office/cyberpunk_office.jpg').convert('RGBA')

# Load character sprites
male_typing = Image.open('frontend/public/sprites/characters/male_typing_chair.png').convert('RGBA')
male_sitting = Image.open('frontend/public/sprites/characters/male_sitting_chair.png').convert('RGBA')
female_sitting = Image.open('frontend/public/sprites/characters/female_sitting_chair.png').convert('RGBA')

# Desk 1: Dũng 3 (Male Dev typing)
# Chair seat is around x: 235, y: 570.
# Size of seated character: h=155, w=int(h * male_typing.width / male_typing.height)
h1 = 155
w1 = int(h1 * male_typing.width / male_typing.height)
s1 = male_typing.resize((w1, h1), Image.Resampling.LANCZOS)
# Anchor at bottom wheels: cx = 220, bottom = 645
bg.paste(s1, (220 - w1 // 2, 645 - h1), s1)

# Desk 2: Dũng 2 (Female Architect sitting)
# Chair at Desk 2: seat at y: 515, wheels at y: 575
h2 = 135
w2 = int(h2 * female_sitting.width / female_sitting.height)
s2 = female_sitting.resize((w2, h2), Image.Resampling.LANCZOS)
# Mirror to face right/desk
s2_flip = s2.transpose(Image.FLIP_LEFT_RIGHT)
bg.paste(s2_flip, (355 - w2 // 2, 575 - h2), s2_flip)

# Desk 3: Dũng 4 (Female QA sitting)
# Chair at Desk 3: seat at y: 435, wheels at y: 495
h3 = 115
w3 = int(h3 * female_sitting.width / female_sitting.height)
s3 = female_sitting.resize((w3, h3), Image.Resampling.LANCZOS)
bg.paste(s3, (465 - w3 // 2, 495 - h3), s3)

# Director / Round table: Dũng 1 (Male Director sitting)
# Left chair of round table: seat at y: 640, wheels at y: 720
h_dir = 160
w_dir = int(h_dir * male_sitting.width / male_sitting.height)
s_dir = male_sitting.resize((w_dir, h_dir), Image.Resampling.LANCZOS)
bg.paste(s_dir, (535 - w_dir // 2, 730 - h_dir), s_dir)

bg.save('scripts/test_characters_placed.png')
print("Saved test_characters_placed.png")
