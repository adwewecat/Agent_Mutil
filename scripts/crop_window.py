from PIL import Image

im = Image.open('frontend/public/sprites/office/cyberpunk_office.jpg')
# Let's crop the window area:
# x from 450 to 1376, y from 50 to 450
crop = im.crop((450, 50, 1376, 450))
crop.save('scripts/window_crop.png')
print("Window crop saved")
