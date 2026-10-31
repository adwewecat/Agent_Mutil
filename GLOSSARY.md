# Project Glossary (Từ Điển Nghiệp Vụ & Thuật Ngữ Dự Án)

Tài liệu định nghĩa ngôn ngữ chung (Ubiquitous Language) của dự án **Agent Multi - Virtual Pixel Office & Bộ Ba Chuyên Gia Dũng**.
Mọi AI agent, kỹ sư phần mềm và tài liệu thiết kế phải tuân thủ nghiêm ngặt các thuật ngữ sau:

---

## 1. Con Người & Phân Vai AI (AI Agents & Roles)

### Bộ Ba Chuyên Gia Dũng (The Three Dũngs)
- **Dũng 1 (Nhân viên 1)**: Giám đốc Vận hành & Chiến lược F&B (40 năm kinh nghiệm). Chịu trách nhiệm bóc tách quy trình thực chiến, phân tích thị trường, nghiên cứu đối thủ F&B toàn cầu (McDonald's, Starbucks, Domino's, Haidilao), tranh luận nảy lửa với Dũng 2 và đề xuất giải pháp vận hành mềm (SOP).
- **Dũng 2 (Nhân viên 2)**: Giám đốc Phần mềm & Kiến trúc Hệ thống (40 năm kinh nghiệm). Thẩm định tính khả thi kỹ thuật, đối chiếu đối thủ công nghệ (Toast POS, Olo, Square, Meituan), tính toán tỷ lệ % hệ thống đáp ứng, bóc tách rủi ro và cùng Dũng 1 lập Bảng Thống Nhất.
- **Dũng 3 (Nhân viên 3)**: Senior Fullstack Developer (30 năm kinh nghiệm). Chỉ thực thi lập trình Clean Code khi Người dùng đã duyệt từng ý trên Bảng Thống Nhất. Sau khi hoàn thành, báo cáo lại để Dũng 1 & Dũng 2 nghiệm thu 2 chiều.

---

## 2. Quy Trình & Kiến Trúc Hệ Thống (Workflow & System Architecture)

### Bảng Thống Nhất (Consensus Board / Matrix)
Bảng thông tin gồm 5 tiêu chuẩn cốt lõi được Dũng 1 và Dũng 2 đúc kết sau cuộc tranh luận nảy lửa:
1. **Yêu cầu là gì** (`requirement`).
2. **Phân tích quy trình, mặt tích cực, tiêu cực và rủi ro** (`process_analysis`, `positives`, `negatives`, `risks`).
3. **Tỷ lệ % hệ thống đáp ứng** (`system_compliance_percent`: 0 - 100%).
4. **Các vấn đề hệ thống có thể đáp ứng được** (`supported_features`).
5. **Những gì hệ thống chưa đáp ứng được & Giải pháp mềm SOP** (`unsupported_gaps`, `soft_solutions`).
6. **Nhiệm vụ cụ thể giao cho Dũng 3** (`software_task_for_dev`).

### Cổng Phê Duyệt Người Dùng (Human-in-the-Loop Approval Gate)
Cơ chế kiểm soát an toàn: Hệ thống tạm dừng sau Giai đoạn 1 (`waiting_feature_selection`), hiển thị `ConsensusModal` để người dùng chủ động tích chọn từng ý cần phát triển. Dũng 3 tuyệt đối không tự ý viết code nếu chưa được phê duyệt.

### Nghiệm Thu Hai Chiều (Bi-directional Acceptance Review)
Sau khi Dũng 3 lập trình xong tại Dev Lab, cả 3 Dũng tập trung lại phòng họp bàn tròn Hologram 3D để Dũng 1 (Nghiệp vụ vận hành) và Dũng 2 (Kiến trúc phần mềm) cùng thẩm định, sau đó kích hoạt `FinalReviewModal` trình bày báo cáo toàn diện cho Người dùng.

---

## 3. Kỹ Thuật Công Nghệ Cốt Lõi (Core Technical Terms)

### Dynamic QR Token HMAC SHA-256
Mã QR động gắn liền với số bàn ăn và phiên phục vụ, được ký điện tử HMAC SHA-256 kèm muối bảo mật (salt), có thời hạn hết hạn (TTL) và tự hủy khi thanh toán hoàn tất nhằm triệt tiêu nạn dán đè mã QR lừa đảo (QR Phishing).

### Idempotency Key
Mã định danh duy nhất (UUID) gửi kèm Header request của API tạo đơn nhằm khử trùng lặp giao dịch 100% khi khách bấm nhiều lần do mạng 4G/WiFi chập chờn.

### Offline-First Local Gateway Sync
Cơ chế đồng bộ trực tiếp qua mạng LAN nội bộ giữa máy khách, POS Thu ngân và Màn hình Bếp KDS dưới 2ms, cho phép quán ăn tiếp tục vận hành và nấu nướng bình thường ngay cả khi đứt cáp quang biển hoặc Cloud bị mất kết nối.

---

## 4. Nghiệp Vụ Văn Phòng Chuyên Biệt (Knowledge Work Plugins)

### Knowledge Work Plugins (Anthropic)
Hệ thống các gói plugin kỹ năng nghiệp vụ chuyên sâu theo từng phòng ban doanh nghiệp (Sales, Operations, Legal, Finance, Marketing, Product Management, Data, Customer Support, HR), giúp AI trả lời khách quan, chuẩn xác theo tiêu chuẩn thực tế của từng ngành nghề.

### Process Optimization & SOP Runbooks (Vận hành & Doanh nghiệp - Dũng 1)
Khung phân tích quy trình nghiệp vụ: Lập bản đồ hiện trạng, định danh 5 điểm lãng phí (Chờ đợi, Làm lại, Chuyển giao handoff, Thao tác thừa, Tác vụ thủ công), thiết kế luồng tương lai và đo lường chỉ số tiết kiệm chi phí/thời gian.

### Spec-Writing & System Architecture Matrix (Kiến trúc & Kỹ thuật - Dũng 2)
Đặc tả giải pháp kỹ thuật, phân tích dữ liệu, đánh giá dung lượng tải (Capacity Plan), thẩm định rủi ro an ninh thông tin và khung pháp lý tuân thủ (Compliance).

