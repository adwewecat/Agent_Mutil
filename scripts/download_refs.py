import urllib.request
from PIL import Image

headers = {'User-Agent': 'Mozilla/5.0'}
urllib.request.urlretrieve('https://i.pinimg.com/originals/ce/62/a3/ce62a313da2b58c48028ee65e284d335.jpg', 'scripts/female_ref.jpg')
urllib.request.urlretrieve('https://i.pinimg.com/originals/f1/a2/3a/f1a23aedd992c7b21773ed861374b9a7.jpg', 'scripts/male_ref.jpg')

im1 = Image.open('scripts/female_ref.jpg')
im2 = Image.open('scripts/male_ref.jpg')
print("Female ref:", im1.size)
print("Male ref:", im2.size)
