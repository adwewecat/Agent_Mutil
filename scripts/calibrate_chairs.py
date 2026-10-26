from PIL import Image

bg = Image.open('frontend/public/sprites/office/cyberpunk_office.jpg').convert('RGBA')

male_typing = Image.open('frontend/public/sprites/characters/male_typing_chair.png').convert('RGBA')
male_sitting = Image.open('frontend/public/sprites/characters/male_sitting_chair.png').convert('RGBA')
female_sitting = Image.open('frontend/public/sprites/characters/female_sitting_chair.png').convert('RGBA')

# Desk 1: Dũng 3 (Male Dev typing)
# Center exactly over the chair: cx=205, bottom=610
h1 = 150
w1 = int(h1 * male_typing.width / male_typing.height)
s1 = male_typing.resize((w1, h1), Image.Resampling.LANCZOS)
bg.paste(s1, (205 - w1 // 2, 610 - h1), s1)

# Desk 2: Dũng 2 (Female Architect)
# Center exactly over the Desk 2 chair: cx=340, bottom=550
h2 = 132
w2 = int(h2 * female_sitting.width / female_sitting.height)
s2 = female_sitting.resize((w2, h2), Image.Resampling.LANCZOS)
s2_flip = s2.transpose(Image.FLIP_LEFT_RIGHT)
bg.paste(s2_flip, (340 - w2 // 2, 550 - h2), s2_flip)

# Desk 3: Dũng 4 (Female QA Lead)
# Center exactly over the Desk 3 chair: cx=455, bottom=470
h3 = 115
w3 = int(h3 * female_sitting.width / female_sitting.height)
s3 = female_sitting.resize((w3, h3), Image.Resampling.LANCZOS)
s3_flip = s3.transpose(Image.FLIP_LEFT_RIGHT)
bg.paste(s3_flip, (455 - w3 // 2, 470 - h3), s3_flip)

# Dũng 1 (Male Director): At top-left chair of Round Conference Table!
# The chair is at cx=535, seat cushion bottom around y=640
h_dir = 145
w_dir = int(h_dir * male_sitting.width / male_sitting.height)
s_dir = male_sitting.resize((w_dir, h_dir), Image.Resampling.LANCZOS)
bg.paste(s_dir, (535 - w_dir // 2, 650 - h_dir), s_dir)

bg.save('scripts/test_calibrated_chairs2.png')
print("Calibrated 2 saved")
