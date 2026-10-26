from PIL import Image

im = Image.open('frontend/public/sprites/office/cyberpunk_office.jpg')

# Desk 1 chair (Dev Lab - front left):
# Let's crop around x: 100..320, y: 500..750
crop1 = im.crop((100, 500, 340, 768))
crop1.save('scripts/chair_desk1.png')

# Desk 2 chair (mid left):
crop2 = im.crop((260, 420, 460, 640))
crop2.save('scripts/chair_desk2.png')

# Desk 3 chair (back left):
crop3 = im.crop((380, 350, 540, 520))
crop3.save('scripts/chair_desk3.png')

# Round table chairs:
crop_table = im.crop((480, 540, 920, 768))
crop_table.save('scripts/round_table_chairs.png')

print("Crops saved!")
