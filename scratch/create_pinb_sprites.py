"""
Script tạo 4 sprites nhân vật pixel art chuẩn phong cách Pinterest Pin B (80 Elements Office):
- Dũng 1 (Software Director): Vest xám công sở sang trọng, sơ mi trắng, cà vạt xanh biển, giày da nâu
- Dũng 2 (Software Architect & PM): Sơ mi trắng công sở, cà vạt xanh navy, quần tây xanh đen, kính mắt
- Dũng 3 (Senior Fullstack Dev): Áo thun đen công nghệ, tai nghe đeo quanh cổ, quần jeans xanh, tay cầm cốc cà phê đỏ
- Dũng 4 (Test Lead & QA): Áo len xanh lá tươi cổ sơ mi trắng, quần âu xám than, thẻ QA vàng
Kích thước: 36 x 64 px, Transparent PNG, viền pixel sắc nét chuẩn 2.5D Isometric.
"""

from PIL import Image, ImageDraw

def create_sprite(char_type: str, out_path: str):
    # Tạo canvas RGBA 36x64
    w, h = 36, 64
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Tâm nhân vật
    cx = w // 2 # 18

    # 1. Bóng đổ chân
    draw.ellipse([cx - 10, h - 8, cx + 10, h - 2], fill=(0, 0, 0, 80))

    # 2. Giày
    shoe_color = (69, 26, 3, 255) if char_type in ['dung_1', 'dung_2'] else (30, 41, 59, 255)
    # Giày trái
    draw.rectangle([cx - 8, h - 10, cx - 2, h - 6], fill=shoe_color, outline=(15, 23, 42, 255))
    # Giày phải
    draw.rectangle([cx + 2, h - 10, cx + 8, h - 6], fill=shoe_color, outline=(15, 23, 42, 255))

    # 3. Quần
    if char_type == 'dung_1':
        pants_color = (71, 85, 105, 255) # Quần tây xám
        pants_outline = (15, 23, 42, 255)
    elif char_type == 'dung_2':
        pants_color = (30, 58, 138, 255) # Quần tây xanh navy
        pants_outline = (15, 23, 42, 255)
    elif char_type == 'dung_3':
        pants_color = (37, 99, 235, 255) # Quần jeans xanh
        pants_outline = (15, 23, 42, 255)
    else: # dung_4
        pants_color = (51, 65, 85, 255) # Quần âu xám đậm
        pants_outline = (15, 23, 42, 255)

    # Ống quần trái
    draw.rectangle([cx - 8, h - 26, cx - 2, h - 10], fill=pants_color, outline=pants_outline)
    # Ống quần phải
    draw.rectangle([cx + 2, h - 26, cx + 8, h - 10], fill=pants_color, outline=pants_outline)
    # Đáy quần & Thắt lưng
    draw.rectangle([cx - 8, h - 28, cx + 8, h - 24], fill=pants_color, outline=pants_outline)
    draw.line([cx - 7, h - 28, cx + 7, h - 28], fill=(30, 20, 10, 255), width=2) # Thắt lưng da
    draw.rectangle([cx - 2, h - 29, cx + 2, h - 27], fill=(234, 179, 8, 255)) # Khóa thắt lưng vàng

    # 4. Thân áo (Torso)
    if char_type == 'dung_1':
        # Dũng 1: Vest xám công sở, sơ mi trắng, cà vạt xanh biển
        suit_color = (100, 116, 139, 255)
        draw.rectangle([cx - 10, h - 46, cx + 10, h - 28], fill=suit_color, outline=(15, 23, 42, 255))
        # Sơ mi trắng chữ V
        draw.polygon([(cx - 4, h - 46), (cx + 4, h - 46), (cx, h - 36)], fill=(248, 250, 252, 255))
        # Cà vạt xanh biển
        draw.polygon([(cx - 1.5, h - 45), (cx + 1.5, h - 45), (cx + 2, h - 35), (cx, h - 32), (cx - 2, h - 35)], fill=(2, 132, 199, 255))
        # Nút áo vest
        draw.point([cx, h - 31], fill=(15, 23, 42, 255))

    elif char_type == 'dung_2':
        # Dũng 2: Sơ mi trắng công sở cộc tay/xắn tay, cà vạt xanh navy
        draw.rectangle([cx - 10, h - 46, cx + 10, h - 28], fill=(248, 250, 252, 255), outline=(15, 23, 42, 255))
        # Cà vạt xanh navy
        draw.polygon([(cx - 1.5, h - 46), (cx + 1.5, h - 46), (cx + 2, h - 35), (cx, h - 32), (cx - 2, h - 35)], fill=(30, 64, 175, 255))
        # Hàng cúc áo sơ mi
        draw.line([cx, h - 31, cx, h - 28], fill=(203, 213, 225, 255))

    elif char_type == 'dung_3':
        # Dũng 3: Áo thun tech đen charcoal, tai nghe quanh cổ
        draw.rectangle([cx - 10, h - 46, cx + 10, h - 28], fill=(30, 41, 59, 255), outline=(15, 23, 42, 255))
        # Logo in chữ trắng nhỏ trên áo
        draw.rectangle([cx - 3, h - 40, cx + 3, h - 38], fill=(56, 189, 248, 255))
        # Tai nghe đeo quanh cổ (Silver Headphones around neck)
        draw.arc([cx - 7, h - 48, cx + 7, h - 42], start=0, end=180, fill=(203, 213, 225, 255), width=2)
        draw.rectangle([cx - 9, h - 46, cx - 6, h - 42], fill=(2, 132, 199, 255)) # Đệm tai nghe trái
        draw.rectangle([cx + 6, h - 46, cx + 9, h - 42], fill=(2, 132, 199, 255)) # Đệm tai nghe phải

    else: # dung_4
        # Dũng 4: Áo len cổ tim xanh lá tươi, bên trong sơ mi trắng, thẻ đeo vàng
        draw.rectangle([cx - 10, h - 46, cx + 10, h - 28], fill=(22, 163, 74, 255), outline=(15, 23, 42, 255))
        # Cổ sơ mi trắng chữ V
        draw.polygon([(cx - 3, h - 46), (cx + 3, h - 46), (cx, h - 42)], fill=(248, 250, 252, 255))
        # Thẻ đeo an ninh / QA badge
        draw.line([cx - 2, h - 46, cx - 1, h - 38], fill=(245, 158, 11, 255))
        draw.rectangle([cx - 2, h - 38, cx + 2, h - 34], fill=(250, 204, 21, 255), outline=(180, 83, 9, 255))

    # 5. Cánh tay & Tay cầm
    skin_color = (254, 215, 170, 255)
    skin_outline = (15, 23, 42, 255)

    if char_type == 'dung_3':
        # Dũng 3 tay phải cầm cốc cà phê đỏ
        # Tay trái
        draw.rectangle([cx - 13, h - 46, cx - 10, h - 34], fill=(30, 41, 59, 255), outline=skin_outline)
        draw.rectangle([cx - 13, h - 34, cx - 10, h - 30], fill=skin_color, outline=skin_outline)
        # Tay phải vươn ra
        draw.rectangle([cx + 10, h - 46, cx + 13, h - 36], fill=(30, 41, 59, 255), outline=skin_outline)
        draw.rectangle([cx + 10, h - 36, cx + 13, h - 32], fill=skin_color, outline=skin_outline)
        # Cốc cà phê đỏ (Red coffee mug)
        draw.rectangle([cx + 11, h - 37, cx + 17, h - 30], fill=(220, 38, 38, 255), outline=(127, 29, 29, 255))
        draw.rectangle([cx + 12, h - 39, cx + 16, h - 37], fill=(69, 26, 3, 255)) # Nước cà phê
        draw.line([cx + 17, h - 35, cx + 17, h - 32], fill=(220, 38, 38, 255), width=1) # Quai cốc
    else:
        # Cánh tay 2 bên
        sleeve_color = suit_color if char_type == 'dung_1' else (248, 250, 252, 255) if char_type == 'dung_2' else (22, 163, 74, 255)
        # Tay trái
        draw.rectangle([cx - 13, h - 46, cx - 10, h - 34], fill=sleeve_color, outline=skin_outline)
        draw.rectangle([cx - 13, h - 34, cx - 10, h - 30], fill=skin_color, outline=skin_outline)
        # Tay phải
        draw.rectangle([cx + 10, h - 46, cx + 13, h - 34], fill=sleeve_color, outline=skin_outline)
        draw.rectangle([cx + 10, h - 34, cx + 13, h - 30], fill=skin_color, outline=skin_outline)

    # 6. Khuôn mặt
    draw.rectangle([cx - 7, h - 58, cx + 7, h - 46], fill=skin_color, outline=skin_outline)

    # 7. Mắt và Nét mặt
    draw.point([cx - 3, h - 52], fill=(15, 23, 42, 255)) # Mắt trái
    draw.point([cx + 3, h - 52], fill=(15, 23, 42, 255)) # Mắt phải
    draw.line([cx - 2, h - 48, cx + 2, h - 48], fill=(194, 65, 12, 255)) # Miệng cười nhẹ

    # Kính cho Dũng 2
    if char_type == 'dung_2':
        draw.rectangle([cx - 5, h - 54, cx - 1, h - 50], outline=(234, 179, 8, 255))
        draw.rectangle([cx + 1, h - 54, cx + 5, h - 50], outline=(234, 179, 8, 255))
        draw.line([cx - 1, h - 52, cx + 1, h - 52], fill=(234, 179, 8, 255))

    # 8. Mái tóc công sở tươi sáng, chỉn chu
    if char_type == 'dung_1':
        # Tóc nâu bóng bẩy chải gọn gàng
        hair_color = (69, 26, 3, 255)
        draw.rectangle([cx - 8, h - 62, cx + 8, h - 56], fill=hair_color, outline=skin_outline)
        draw.rectangle([cx - 8, h - 58, cx - 7, h - 52], fill=hair_color)
        draw.rectangle([cx + 7, h - 58, cx + 8, h - 54], fill=hair_color)
    elif char_type == 'dung_2':
        # Tóc đen chải lịch sự rẽ ngôi
        hair_color = (20, 20, 25, 255)
        draw.rectangle([cx - 8, h - 62, cx + 8, h - 56], fill=hair_color, outline=skin_outline)
        draw.rectangle([cx - 8, h - 58, cx - 7, h - 53], fill=hair_color)
        draw.rectangle([cx + 7, h - 58, cx + 8, h - 53], fill=hair_color)
    elif char_type == 'dung_3':
        # Tóc nâu vàng hạt dẻ bồng bềnh trẻ trung
        hair_color = (120, 53, 15, 255)
        draw.rectangle([cx - 8, h - 63, cx + 8, h - 55], fill=hair_color, outline=skin_outline)
        draw.rectangle([cx - 8, h - 57, cx - 7, h - 51], fill=hair_color)
        draw.rectangle([cx + 7, h - 57, cx + 8, h - 51], fill=hair_color)
    else: # dung_4
        # Tóc vàng óng/nâu sáng cắt ngắn năng động
        hair_color = (180, 83, 9, 255)
        draw.rectangle([cx - 8, h - 62, cx + 8, h - 56], fill=hair_color, outline=skin_outline)
        draw.rectangle([cx - 8, h - 58, cx - 7, h - 52], fill=hair_color)
        draw.rectangle([cx + 7, h - 58, cx + 8, h - 52], fill=hair_color)

    # Lưu ảnh ra file
    img.save(out_path, format="PNG")
    print(f"Created: {out_path} ({w}x{h})")

if __name__ == "__main__":
    import os
    base_dir = "frontend/public/assets/characters"
    os.makedirs(base_dir, exist_ok=True)
    create_sprite("dung_1", f"{base_dir}/dung_1.png")
    create_sprite("dung_2", f"{base_dir}/dung_2.png")
    create_sprite("dung_3", f"{base_dir}/dung_3.png")
    create_sprite("dung_4", f"{base_dir}/dung_4.png")
    print("All 4 Pin B sprites generated successfully!")
