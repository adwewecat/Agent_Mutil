# ADR-0001: Bộ Ba Chuyên Gia AI (3 Dũng) và Cổng Phê Duyệt Từng Ý (Human-in-the-Loop)

- **Trạng thái**: Đã chấp thuận (Accepted)
- **Ngày**: 2026-10-31
- **Người quyết định**: Hội đồng Kiến trúc & Người dùng

---

## Bối cảnh (Context)
Ban đầu, hệ thống thử nghiệm với mô hình 4 Agent chung chung. Tuy nhiên, quy trình thực tế đòi hỏi:
1. Phân định rạch ròi giữa **Nghiệp vụ Vận hành & Chiến lược thị trường** (F&B, Fastfood, Retail) và **Kiến trúc Công nghệ & Phần mềm**.
2. Phải có sự cọ xát, tranh luận nảy lửa và đối chiếu với các mô hình đối thủ/đối tác hàng đầu thế giới (McDonald's, Starbucks, Domino's, Haidilao, Toast POS, Olo, Square, Meituan).
3. Đảm bảo tính an toàn: AI không được tự tiện viết code mà phải dừng lại ở Cổng Phê Duyệt để người dùng tích chọn từng ý cần phát triển.
4. Lập trình viên (Dũng 3) chỉ thực thi các ý đã được duyệt và phải có quy trình nghiệm thu hai chiều từ cả Giám đốc Vận hành và Giám đốc Phần mềm.

---

## Quyết định (Decision)
1. **Chuẩn hóa đội ngũ thành 3 chuyên gia cao cấp**:
   - **Dũng 1**: Giám đốc Vận hành & Chiến lược F&B (40 năm KN).
   - **Dũng 2**: Giám đốc Phần mềm & Kiến trúc Hệ thống (40 năm KN).
   - **Dũng 3**: Senior Fullstack Developer (30 năm KN).
2. **Thiết lập quy trình 5 giai đoạn nghiêm ngặt**:
   - Giai đoạn 1: Tranh luận nảy lửa giữa Dũng 1 và Dũng 2 tại Boardroom bàn tròn Hologram 3D.
   - Giai đoạn 2: Lập Bảng Thống Nhất gồm 5 tiêu chuẩn cốt lõi (% đáp ứng, quy trình, tích cực, tiêu cực, rủi ro, giải pháp mềm SOP).
   - Giai đoạn 3: Cổng Phê Duyệt Người Dùng (Human-in-the-Loop Gate) kiểm soát từng ý.
   - Giai đoạn 4: Dũng 3 thực thi mã nguồn Clean Code tối ưu, bảo mật HMAC SHA-256 + Idempotency Key.
   - Giai đoạn 5: Dũng 1 & Dũng 2 nghiệm thu 2 chiều và kích hoạt Popup Báo Cáo Toàn Diện.

---

## Hệ quả (Consequences)
- **Tích cực**:
  - Nghiệp vụ sâu sắc, thực chiến, không ảo tưởng công nghệ.
  - Người dùng nắm quyền kiểm soát 100% chi phí và hướng phát triển tính năng.
  - Mã nguồn do Dũng 3 sinh ra có mục tiêu rõ ràng và được kiểm chứng kép.
- **Tiêu cực**:
  - Thêm một bước chờ người dùng duyệt trên giao diện thay vì chạy tự động hoàn toàn (đây là đánh đổi có chủ đích để đảm bảo an toàn).
