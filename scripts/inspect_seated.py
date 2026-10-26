from PIL import Image

def inspect_seated(img_path):
    im = Image.open(img_path)
    print(img_path, im.size)

inspect_seated(r"C:\Users\LAPTOPMUON\.gemini\antigravity-ide\brain\c27b2fb8-5715-49c8-a2d3-2b1f77917301\female_seated_worker_1793058115129.jpg")
inspect_seated(r"C:\Users\LAPTOPMUON\.gemini\antigravity-ide\brain\c27b2fb8-5715-49c8-a2d3-2b1f77917301\male_seated_worker_1793058133389.jpg")
inspect_seated(r"C:\Users\LAPTOPMUON\.gemini\antigravity-ide\brain\c27b2fb8-5715-49c8-a2d3-2b1f77917301\female_meeting_seated_1793058151934.jpg")
inspect_seated(r"C:\Users\LAPTOPMUON\.gemini\antigravity-ide\brain\c27b2fb8-5715-49c8-a2d3-2b1f77917301\male_meeting_seated_1793058166902.jpg")
