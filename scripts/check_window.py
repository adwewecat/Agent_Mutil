from PIL import Image, ImageDraw

im = Image.open('frontend/public/sprites/office/cyberpunk_office.jpg')
w, h = im.size

# Let's check where the window glass is located.
# Looking at the image:
# On the left: there is an interior concrete/slat wall with vertical neon tubes from x=0 to around x=420.
# The window starts around x=430 or x=450?
# And notice: In the middle foreground, there are interior pillars and desks.
# But more importantly, the window is in the background between y=0 and y=500.
# Let's inspect vertical slices at x=400, 450, 500, 600, 800, 1000, 1200, 1370.
print(f"Office dimensions: {w}x{h}")
