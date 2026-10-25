# GEMINI.md - HỆ THỐNG GHI NHẬP VÀ QUẢN TRỊ DỰ ÁN AGENT MULTI (AGENT PIXELS 4 DŨNG)

> **MỤC ĐÍCH FILE NÀY**:
> File này đóng vai trò là "Nhật ký dự án & Bản đồ chỉ dẫn tối cao" (Single Source of Truth).
> Bất kỳ khi nào thực hiện, cập nhật hoặc sửa chữa một vấn đề gì, BẮT BUỘC phải ghi chép lại tại đây.
> Khi máy tính cài lại Windows hoặc bất kỳ AI (Gemini, Claude, GPT,...) hay lập trình viên (DEV) nào khác tiếp nhận dự án, chỉ cần đọc file này là nắm bắt 100% hiện trạng, kiến trúc, quy tắc và việc cần làm tiếp theo.

---

## 1. QUY TẮC BẤT DI BẤT DỊCH CỦA DỰ ÁN
1. **Kiểm tra và cập nhật tài liệu trước & sau khi làm**: Luôn đối chiếu `README.md` và `GEMINI.md`. Bổ sung log thay đổi trước khi hoàn thành phiên làm việc.
2. **Quy tắc Git & GitHub**:
   - Repository chính thức: `https://github.com/adwewecat/Agent_Mutil.git` (nhánh `main`).
   - Bất kỳ khi nào thêm tính năng hoặc chỉnh sửa xong: **BẮT BUỘC ĐẨY CODE NGAY LÊN GITHUB**.
3. **Chất lượng mã nguồn (Clean Code)**:
   - Tuyệt đối không để code rác, code thừa không sử dụng (no dead code / no unused imports).
   - Mọi hàm, component, API endpoint và module logic đều phải có chú thích (comments/docstrings) rõ ràng bằng tiếng Việt, giúp DEV đọc vào là hiểu ngay logic.
4. **Quy trình Build & Đóng gói**:
   - Sau khi xử lý xong tính năng, phải build app ra thư mục `dist` sạch sẽ, sẵn sàng triển khai lên Production Web Server.

---

## 2. KIẾN TRÚC & CÔNG NGHỆ DỰ ÁN

Hệ thống được thiết kế theo mô hình **Độc lập tách biệt (Decoupled Architecture)** giữa Backend và Frontend:

### 2.1. Backend
- **Ngôn ngữ**: Python 3.10+
- **Framework**: FastAPI (hỗ trợ REST API theo chuẩn OpenAPI tự động tại `/docs`, `/redoc` và WebSocket `/ws/office`).
- **Database**: SQL Server (hỗ trợ `SQLAlchemy 2.0` + `pyodbc` + `ODBC Driver 18 for SQL Server`), đồng thời có cơ chế fallback linh hoạt sang SQLite (`sqlite:///./agent_multi.db`) khi chạy local dev chưa kết nối SQL Server thật.
- **Thư mục**: `backend/`

### 2.2. Frontend
- **Framework**: React 19 + TypeScript + Vite.
- **Phong cách giao diện**: Mô phỏng văn phòng Pixel Art tương tác sống động, lấy cảm hứng từ `gcampton/Agent-Pixels`.
- **Đồ họa**: HTML5 Canvas Game Engine xử lý render bản đồ phòng họp, phòng giám đốc, phòng kiến trúc sư, phòng lập trình, phòng kiểm thử, khu vực cà phê/lounge, animation nhân vật pixel đi lại, gõ phím, suy nghĩ, hội thoại, hệ thống camera an ninh giám sát chuyển đổi góc nhìn.
- **Hiệu ứng & Âm thanh**: Retro CRT scanline toggle, Web Audio API 8-bit sound effects, Dark Mode hiện đại.
- **Thư mục**: `frontend/` (Build output: `frontend/dist/`).

---

## 3. THIẾT KẾ ĐỘI NGŨ 4 AGENT (BỘ TỨ "DŨNG")

Hệ thống gồm đúng 4 nhân vật AI chuyên gia cốt lõi:

| Nhân vật | Chức danh / Vai trò | Kinh nghiệm | Nhiệm vụ chính trong Workflow |
| :--- | :--- | :--- | :--- |
| **Dũng 1** | **Software Director** | Giám đốc phần mềm | Tiếp nhận đề bài từ người dùng, phân tích mục tiêu kinh doanh, đề xuất giải pháp chiến lược và trao đổi trực tiếp với Dũng 2 để chốt phương án tối ưu. |
| **Dũng 2** | **Software Architect & Project Manager** | 40 năm kinh nghiệm | Thẩm định tính khả thi, tài nguyên, chi phí, rủi ro hệ thống; chủ động phản biện giải pháp của Dũng 1, đề xuất rẽ nhánh hoặc thậm chí tư vấn quy trình không cần phần mềm nếu không cần thiết; phân tích kỹ thuật sâu sắc, cấu trúc hệ thống, kiến trúc microservices/monolith, độ trễ và tài nguyên. |
| **Dũng 3** | **Senior Fullstack Developer** | 40 năm kinh nghiệm | Hiện thực hóa giải pháp sau khi Dũng 1 và Dũng 2 đã chốt phương án; viết mã nguồn chuẩn xác, tối ưu thuật toán, xây dựng API RESTful và cấu trúc dữ liệu sạch. |
| **Dũng 4** | **Test Engineer / QA Specialist** | 40 năm kinh nghiệm | Kiểm tra toàn bộ mã nguồn của Dũng 3; thiết lập ma trận Test Cases, phân tích giá trị biên (boundary values), stress test, phát hiện mọi lỗi tiềm ẩn và lỗ hổng bảo mật. |

---

## 4. HƯỚNG DẪN KHÔI PHỤC DỰ ÁN KHI CÀI LẠI WINDOWS

Nếu máy tính vừa cài lại Windows, DEV chỉ cần thực hiện 4 bước sau:
1. **Cài đặt công cụ nền tảng**:
   - Python 3.10+ (tích hợp PATH).
   - Node.js LTS (v18+ hoặc v20+).
   - Git.
   - Microsoft ODBC Driver 18 for SQL Server (nếu kết nối SQL Server thật).
2. **Clone mã nguồn**:
   ```bash
   git clone https://github.com/adwewecat/Agent_Mutil.git
   cd Agent_Mutil
   ```
3. **Cài đặt & Chạy Backend**:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
4. **Cài đặt & Chạy Frontend**:
   ```bash
   cd ../frontend
   npm.cmd install
   npm.cmd run dev
   ```
5. **Build đóng gói lên Server**:
   ```bash
   cd frontend
   npm.cmd run build
   ```
   (Thư mục `frontend/dist` chứa toàn bộ code static sẵn sàng đưa lên Nginx/IIS/Caddy).

---

## 5. NHẬT KÝ THỰC HIỆN DỰ ÁN (CHANGE LOG)

### [2026-10-25] Khởi tạo nền tảng & cấu trúc dự án
- [x] Kiểm tra kho lưu trữ GitHub `https://github.com/adwewecat/Agent_Mutil.git`.
- [x] Tạo file `GEMINI.md` thiết lập quy tắc dự án và hướng dẫn khôi phục.
- [x] Cập nhật `README.md` chi tiết về dự án Agent-Pixels 4 Dũng.
- [x] Khởi tạo thư mục Backend (FastAPI, SQLAlchemy 2.0, pyodbc, Pydantic, WebSockets, Agent Workflow Service).
- [x] Khởi tạo thư mục Frontend (React 19 + TypeScript + Vite + Canvas Pixel Office Engine + 4 Dũng sprites + Multi-camera + Sound effects).
- [x] Tích hợp API giao tiếp giữa Backend và Frontend.
- [x] Build ứng dụng frontend ra thư mục `dist` sạch sẽ, 0 lỗi, 0 warning.
- [x] Commit toàn bộ mã nguồn sạch sẽ.

### [2026-10-25] Nâng cấp giao diện 2.5D Isometric và tái cấu trúc Layout
- [x] Đưa bảng **GIAO ĐỀ BÀI CHO BỘ TỨ DŨNG** lên vị trí trên cùng của trang (Top Panel) tiện thao tác nhanh.
- [x] Chuyển đổi hiển thị của **4 Dũng (Dũng 1, Dũng 2, Dũng 3, Dũng 4)** thành danh sách theo chiều dọc bên cột phải (Right Sidebar).
- [x] Nâng cấp toàn diện đồ họa Canvas Pixel Art mô phỏng 100% phong cách 2.5D Isometric chuẩn của `Agent-Pixels`:
  - Sàn gỗ parquet ấm cúng cho văn phòng dev & làm việc.
  - Hành lang gạch caro đen trắng (checkerboard).
  - Phòng giải trí bida (billiard table có bóng và gậy cơ) và máy Arcade retro tím.
  - Phòng họp chiến lược với bàn gỗ dài, ghế xoay bọc da, máy tính xách tay và bảng trắng (whiteboard).
  - Khu vực pantry/kitchen lát gạch trắng men bóng với bồn rửa, bình nước nóng lạnh và máy bán nước.
  - Tủ sách gỗ đầy màu sắc, tranh phong cảnh nghệ thuật viền vàng treo tường, chậu cây monstera/ficus chi tiết.
- [x] Cải tiến Animation nhân vật pixel sống động: đi bộ đu đưa tay chân 4 frame nhịp nhàng, ngồi gõ bàn phím nhấp nháy màn hình, ngồi họp và đứng đánh bida.
- [x] Build bản đóng gói sạch sẽ ra `frontend/dist/`.
- [x] Commit và sẵn sàng push mã nguồn lên GitHub.

### [2026-10-25] Khắc phục tương tác nhân vật & quy trình tranh luận thời gian thực
- [x] **Tương tác chuột trực tiếp (Click-to-Move)**: Người dùng có thể click chuột vào bất kỳ Dũng nào trên Canvas để chọn (hiện vòng phát sáng cyan, bảng tên và âm thanh thông báo), sau đó click vào bất kỳ vị trí sàn nào để ra lệnh Dũng đó đi bộ tới đó ngay lập tức.
- [x] **Điều động không delay (0-latency Dispatching)**: Khi click "Họp", "Bàn làm việc", "Bida", "Pantry", nhân vật bắt đầu bước đi tức thì trên Canvas với tiếng bước chân 8-bit, đồng thời đồng bộ ngầm về DB.
- [x] **Diễn biến tranh luận tuần tự sống động (Live Staged Workflow)**: Khi bấm "KÍCH HOẠT TOÀN BỘ QUY TRÌNH (4 DŨNG)":
  - Dũng 1 rời phòng bước vào Boardroom, camera zoom theo, phát biểu mở màn.
  - Dũng 2 rời phòng kiến trúc đi qua hành lang gạch caro vào Boardroom ngồi cạnh Dũng 1 tranh luận, phản biện rủi ro và chốt kiến trúc.
  - Dũng 3 bước vào Dev Lab, ngồi vào bàn máy tính gõ bàn phím liên tục sinh mã nguồn Clean Code.
  - Dũng 4 bước vào trạm kiểm thử chạy ma trận Stress Test 5,000 req/s, quét an ninh và phát âm thanh chiến thắng.
### [2026-10-25] Khắc phục triệt để hiện tượng nhân vật trèo lên bàn & căn chỉnh vị trí ghế ngồi
- [x] **Nguyên nhân cốt lõi**:
  - Tọa độ ban đầu trong Database bị trùng vào giữa mặt bàn máy tính, mặt bàn bida hoặc mặt bàn trà phòng khách.
  - Vòng lặp render cũ vẽ toàn bộ bản đồ trước rồi vẽ nhân vật lên sau, khiến nhân vật ngồi sau bàn họp bị vẽ đè lên mặt bàn, tạo cảm giác như đang đứng/trèo trên mặt bàn.
- [x] **Giải pháp đã thực hiện**:
  1. **Căn chuẩn tọa độ ghế ngồi thực tế (Pixel-Perfect Seating Coordinates)**:
     - Dũng 1 (Giám đốc): Tọa độ `(595, 65)` - Ngồi chính giữa đệm ghế sofa da đỏ phòng Giám đốc, bàn trà cà phê đặt phía trước.
     - Dũng 2 (Kiến trúc sư): Tọa độ `(140, 152)` - Ngồi ghế xoay bọc da trước bàn vẽ thiết kế kiến trúc và 2 màn hình lớn.
     - Dũng 3 (Dev Fullstack): Tọa độ `(120, 402)` - Ngồi ghế xoay trước bàn máy tính Dev Lab, tay vươn gõ phím cơ trên bàn tại `y = 372`.
     - Dũng 4 (Test Lead): Tọa độ `(320, 400)` - Đứng bên cạnh bàn bida trên nền gạch tím hoa văn, tay cầm gậy cơ chĩa vào bàn bida (tuyệt đối không đứng lên mặt nỉ xanh của bàn bida).
     - Phòng họp (Boardroom): Dũng 1 tại `(715, 318)` và Dũng 2 tại `(765, 318)` - Ngồi đúng vào dãy ghế phía trên bàn họp hội nghị.
  2. **Áp dụng kỹ thuật xếp tầng chiều sâu 2.5D Isometric (Y-Depth Sorting)**:
     - `SpriteRenderer.drawBackground`: Vẽ sàn gạch, tường 3D, tủ sách, tranh tường, quầy pantry và dãy ghế phía sau của bàn họp.
     - Dựng các nhân vật ngồi ở dãy ghế sau (`pos_y < 330`).
     - `SpriteRenderer.drawForeground`: Vẽ mặt bàn họp hội đồng (kèm laptop, tài liệu, bình hoa), bàn Dev Lab, bàn bida, bàn trà và ghế dãy trước. Bàn họp tự động phủ lên chân và nửa thân dưới của nhân vật một cách tự nhiên.
     - Dựng các nhân vật ngồi trước bàn / đứng sàn còn lại.
  3. **Tư thế ngồi và hành động đặc thù (Sitting Pose & Micro-animations)**:
     - Khi ngồi sau bàn họp: Bàn che nửa thân dưới, hai tay đặt lên bàn tranh luận sôi nổi (`debating`), cử chỉ tay nhịp nhàng.
     - Khi ở Dev Lab: Tựa ghế xoay đỡ lưng, hai tay gõ phím liên tục sinh Clean Code.
     - Khi ở phòng Giám đốc: Ngồi đệm sofa đỏ thư thái, quyền uy.
     - Khi ở phòng Bida: Cầm gậy cơ bằng gỗ chĩa vào bàn bi-a.
- [x] Cập nhật Database SQLite / SQL Server và dữ liệu cấu hình đồng bộ.
- [x] Build bản đóng gói `frontend/dist` thành công sạch sẽ 100%, 0 lỗi, 0 cảnh báo.
- [x] Commit và đẩy code lên GitHub repository `https://github.com/adwewecat/Agent_Mutil.git`.

### [2026-10-25] Tái cấu trúc không gian chuẩn The Pixel Office (thepixeloffice.ai) & Agent-Pixels
- [x] **Vấn đề đã xử lý**:
  - Giao diện trước đây vẽ các phòng hình hộp rời rạc, nhồi nhét quá nhiều vật trang trí trong không gian chật hẹp dẫn đến tình trạng chồng chéo, đè lên tường và đồ vật khác.
  - Thiếu tính chiều sâu và không gian mở liền mạch của một văn phòng ảo chuyên nghiệp.
- [x] **Giải pháp kiến trúc không gian mới (Unified 2.5D Isometric Floor Plan)**:
  1. **Bố cục không gian mở thoáng đãng (Open-Plan Unified Architecture)**:
     - Tường hậu phía sau (Back Wall) có độ sâu 3D Isometric, tích hợp 5 cửa sổ kính lớn (Cityscape Windows) chiếu ánh sáng thành phố hiện đại.
     - Hành lang trung tâm gạch caro đen trắng (Checkerboard Hallway) nối liền thông suốt giữa 2 dãy phòng.
     - Vách ngăn lửng kính mờ 2.5D giữa các phòng, cửa ra vào rộng rãi 44px, không gây chắn đường hay tù túng.
  2. **Hệ thống nội thất Zero-Overlap (Khoảng cách chuẩn Pixel-Perfect)**:
     - Loại bỏ toàn bộ vật dụng dư thừa, tính toán tọa độ và kích thước từng vật thể cách nhau tối thiểu 25-40px:
       + **Phòng Kiến Trúc (Dũng 2)**: Kệ sách sát tường sau, mini server rack đèn LED, cây xanh góc phòng, bàn làm việc lớn 2 màn hình PC, ghế xoay tại `(125, 195)`.
       + **Phòng Giám Đốc (Dũng 1)**: Thảm sapphire hoàng gia, sofa da đỏ êm ái tại `(470, 130)`, bàn trà gỗ tiếp khách phía trước có 2 tách cà phê, tranh nghệ thuật viền vàng và 2 chậu ficus đối xứng.
       + **Khu Pantry & Cà Phê Bar**: Quầy bar bồn rửa inox, tủ lạnh 2 cánh, máy bán nước tự động, bình nước khoáng nóng lạnh úp ngược, cây xanh thoáng mát.
       + **Phòng Dev Lab (Dũng 3)**: Bàn làm việc Fullstack Dev rộng rãi, 2 màn hình sáng code matrix xanh lá, bàn phím cơ, cốc cà phê, ghế xoay công thái học tại `(135, 410)`.
       + **Phòng Họp Chiến Lược (Boardroom)**: Bàn họp hội đồng gỗ óc chó lớn ở trung tâm, 6 ghế xoay nỉ xanh đối xứng xung quanh, laptop điều hành mở sẵn, bảng trắng kiến trúc.
       + **Phòng Bida & Giải Trí (Dũng 4)**: Bàn bida nỉ xanh chuẩn thi đấu ở trung tâm, 4 phía đều có khoảng trống rộng rãi; máy game Arcade retro tím neon góc tường, Dũng 4 đứng cầm gậy cơ tại `(710, 405)`.
  3. **Kiến trúc Z-Sort Rendering Pipeline thực thụ**:
     - Mọi đồ vật nội thất và 4 nhân vật Dũng đều được đưa vào mảng `allDrawables`, sắp xếp tự động theo trục Y (`zY = y + height`).
     - Đảm bảo 100% không bao giờ xảy ra hiện tượng chồng chéo, vật thể đè lên nhau hay nhân vật trèo lên bàn.
- [x] Đồng bộ dữ liệu tọa độ trên Backend FastAPI, Database SQLite / SQL Server và Frontend React Canvas.
- [x] Build bản đóng gói `frontend/dist` hoàn tất 100%, 0 lỗi, 0 warning.
- [x] Đẩy toàn bộ mã nguồn lên GitHub `https://github.com/adwewecat/Agent_Mutil.git`.

### [2026-10-25] Hoàn thiện quy trình phân tích chiến lược, Cổng phê duyệt (Approval Gate) & Đồ họa Fallout Shelter
- [x] **Chuẩn hóa quy trình tranh luận nghiệp vụ (Deliberation Business Flow)**:
  - Tiếp nhận bài toán mẫu thực chiến: *"Phân tích rủi ro khi triển khai QR Code order menu cho khách hàng, đánh giá rủi ro vận hành & rủi ro hệ thống, kiến trúc giải pháp chống gian lận và rớt đơn"*.
  - **Dũng 1 (Software Director)**: Phân tích thị trường sâu sắc, tâm lý khách hàng (hơn 60% khách trên 40 tuổi bực bội khi bị ép quét QR), rủi ro rớt đơn (Order Drop-off), gian lận tráo mã QR (QR Phishing), rủi ro nghẽn mạng 4G/WiFi cục bộ vào giờ cao điểm F&B.
  - **Dũng 2 (Software Architect & PM - 40 năm KN)**: Phản biện kỹ thuật chuyên sâu, thiết kế kiến trúc Dynamic QR Token HMAC SHA-256 (hết hạn sau 5 phút), cơ chế Offline-First Local SQLite Sync đồng bộ mạng LAN nội bộ giữa máy khách - POS Thu ngân - Bếp KDS, chống duplicate đơn bằng Idempotency Key.
- [x] **Cổng kiểm soát phê duyệt (Human-in-the-Loop Gate)**:
  - Khi chạy chu trình, Dũng 1 và Dũng 2 tranh luận xong thì hệ thống **DỪNG LẠI và chuyển sang trạng thái `waiting_approval`**.
  - Tuyệt đối không tự tiện cho Dũng 3 (Lập trình) và Dũng 4 (Kiểm thử) chạy trước.
  - Hiển thị banner cảnh báo phong cách Vault-Tec với nút bấm: **"PHÊ DUYỆT PHƯƠNG ÁN & KÍCH HOẠT DŨNG 3, DŨNG 4 THỰC THI"**.
  - Khi người dùng bấm Phê duyệt: Dũng 3 mới bước vào Dev Lab viết Clean Code, Dũng 4 vào QA Lab lập ma trận Stress Test 5,000 TPS.
- [x] **Nâng cấp đồ họa chân thật phong cách Fallout Shelter (Vault-Tec Aesthetic)**:
  - **Hệ thống đèn trần hình nón công nghiệp (Vault Conical Spotlights)**: 5 chao đèn kim loại thả trần rọi luồng sáng hình nón ấm áp xuống các cụm bàn làm việc, bàn họp và phòng giám đốc.
  - **Khói cà phê nóng bốc lên (Animated Coffee Steam)**: Các tách cà phê tại bàn Dev Lab, bàn tiếp khách Giám đốc và bàn họp có luồng khói trắng lượn sóng bốc lên sống động.
  - **Màn hình máy tính động (Animated CRT Terminals)**: 2 màn hình tại Dev Lab cuộn code matrix xanh lá liên tục kèm con trỏ nhấp nháy, màn hình phụ hiển thị biểu đồ mạng.
  - **Bong bóng hành động Fallout Shelter (Vault Action Bubbles)**: Bong bóng nổi bồng bềnh (`floating bob`) có icon chuyên biệt: `🔍 THỊ TRƯỜNG & VẬN HÀNH` (Dũng 1), `⚙️ RỦI RO HỆ THỐNG & PM` (Dũng 2), `⚡ CLEAN CODE & REST API` (Dũng 3), `🎯 STRESS TEST 5,000 TPS` (Dũng 4).
- [x] Build bản đóng gói `frontend/dist` hoàn tất 100%, 0 lỗi, 0 warning.
- [x] Đã đẩy mã nguồn lên GitHub.

### [2026-10-25] Mở rộng Full Màn Hình Responsive, Tích hợp Nhân vật Pinterest và Chiều Sâu 4D cho Phòng & Cây Cảnh
- [x] **Giao diện Full Màn Hình thích ứng (100% Full-Width Responsive & Fullscreen API)**:
  - Loại bỏ hoàn toàn giới hạn cố định `max-width: 1200px` / `1440px`, chuyển toàn bộ layout sang `width: 100%; max-width: 100%` co giãn tự động theo mọi độ phân giải màn hình (Full HD, 2K, 4K, Ultrawide).
  - Tích hợp nút **"Toàn màn hình" (Fullscreen Toggle)** trên thanh Header, hỗ trợ `document.documentElement.requestFullscreen()` và `exitFullscreen()`, chuyển đổi icon phóng to/thu nhỏ trực quan.
  - Tối ưu tỉ lệ Canvas và bảng điều khiển `grid-template-columns: 1fr 340px`, tự động co giãn kích thước Canvas mượt mà, bộ chuyển đổi tọa độ chuột `screenToWorld` tính toán chính xác tuyệt đối tỷ lệ thu phóng `scaleX/scaleY`.
- [x] **Thiết kế & Tích hợp nhân vật chuẩn Pinterest (`https://www.pinterest.com/pin/820077413439603422/`)**:
  - Trích xuất và tối ưu hóa 4 bộ Sprite PNG trong suốt (Transparent 32-bit PNG) mang đúng phong cách của link tham khảo, phân chia chuẩn xác theo diện mạo và cá tính từng Dũng:
    - **Dũng 1 (Software Director)**: Tóc đen vuốt bóng bẩy, kính râm đen phản quang, vest xanh navy lịch lãm và cà vạt đỏ quyền lực.
    - **Dũng 2 (Software Architect & PM - 40 năm KN)**: Mũ fedora xám tro, kính râm, bộ com-lê xám sang trọng và cà vạt đồng điệu.
    - **Dũng 3 (Senior Fullstack Dev)**: Mũ nồi flat cap cá tính, râu quai nón, áo gi-lê xanh rêu trên sơ mi trắng chuẩn chất lập trình viên kỳ cựu.
    - **Dũng 4 (Test Lead & QA)**: Mũ fedora đỏ nổi bật, kính râm đen ngầu, áo khoác đỏ và quần tây đen sắc sảo.
  - Nhân vật được đồng bộ hiển thị xuyên suốt trên **Canvas Pixel Office** (kích thước tỉ lệ vàng 34x58px, bước đi nghiêng người nhịp nhàng, bóng đổ chân mềm mại), **Thẻ Agent Card** ở thanh Sidebar và **Bong bóng hội thoại Deliberation Chat**.
- [x] **Nâng cấp Chiều Sâu 4D & Cây cảnh chân thực (Monstera & 4D Depth)**:
  - Nâng cấp toàn diện hàm `drawPottedPlant`: Thay thế chậu cây tròn đơn điệu bằng cây trầu bà lá xẻ **Monstera Deliciosa** nhiệt đới chân thực với chậu gốm nung men sứ 3D có bóng đổ, thân cây nâu gỗ và các phiến lá Monstera to bản xếp tầng, có gân lá trắng chi tiết và hiệu ứng đung đưa theo gió nhịp nhàng (`subtle wind sway`).
  - Tăng cường chiều sâu 4D cho các phòng: Phào chân tường 3D (Baseboard Skirting), bóng đổ chân tường tiếp giáp sàn (Ambient Occlusion Shadow), skyline thành phố về đêm ngoài cửa sổ kính với các tòa cao ốc nhấp nháy đèn vàng ấm áp.
- [x] Kiểm tra bản build `frontend/dist` hoàn tất 100%, 0 lỗi, 0 warning.
- [x] Đã đẩy mã nguồn lên GitHub.

### [2026-10-25] Tinh Chỉnh Khung Hình Vừa Vặn & Nâng Cấp Toàn Diện Bàn Ghế Nội Thất 2.5D (Chuẩn Pinterest)
- [x] **Khắc phục triệt để hiện tượng "Màn hình quá to, không nhìn thấy gì"**:
  - Tinh chỉnh `.main-content`: Đặt `max-width: 1440px; margin: 0 auto; padding: 12px 20px 40px` tạo bố cục cân đối hoàn hảo trên mọi kích thước màn hình.
  - Tinh chỉnh `.canvas-wrapper`: Giới hạn `max-width: 980px; max-height: 520px; margin: 0 auto` đảm bảo Canvas hiển thị trọn vẹn trong 1 màn hình nhìn (viewport), không bị tràn kéo dài gây che mất thanh công cụ và khung chat bên dưới.
  - Tinh chỉnh Camera Engine: Điều chỉnh độ zoom phòng khi chuyển camera từ `1.35x` thành `1.12x` nhẹ nhàng, kèm thuật toán kẹp biên (`Math.max(0, Math.min(raw, max))`) chống giật khung hình và không bao giờ bị cắt mất mép phòng.
  - Loại bỏ biển tên phòng to quá khổ: Thay thế bằng bảng biển tên phòng kiến trúc tinh tế (`height: 14px`, `font: 7.5px`) đặt sát góc trên bên trái, tuyệt đối không bao giờ đè lên bàn ghế, sofa hay nhân vật.
  - Tinh giản bong bóng hành động Fallout Shelter: Đưa về kích thước nhỏ gọn (`height: 15px`, `font: 7.5px`) kèm mũi tên chỉ định hướng thanh lịch, không che khuất nhân vật khác khi đứng gần.
- [x] **Nâng cấp Toàn diện Bàn Ghế & Nội thất 2.5D Isometric Chuẩn Pinterest**:
  - Dựa trên tư liệu tham khảo Pinterest `https://www.pinterest.com/pin/677791812714105149/` (Tech Workshop & Lab) và `https://www.pinterest.com/pin/633811347596055880/` (Retro Cyberpunk Lounge & Cafe):
    - **Dev Lab (Dũng 3)**: Trạm làm việc kỹ thuật cao với khung chân thép nòng súng, thanh giằng chịu lực, mặt bàn gỗ dày butcher block, hộc tủ 3 ngăn tay nắm nhôm xước; giá đỡ kép màn hình uốn cong 32" hiển thị terminal code ma trận đổi màu cú pháp, màn hình phụ dọc 24" đo TPS/Microservices DAG, bàn phím cơ gầm LED RGB, lót chuột pad và cốc cà phê đỏ bốc khói.
    - **Phòng Kiến Trúc Sư (Dũng 2)**: Bàn vẽ kỹ thuật khung thép, mặt gỗ sáng, bản vẽ blueprint thực tế trải rộng có thước T-Square, màn hình lớn vẽ sơ đồ kiến trúc hệ thống, ống đựng bản vẽ cuộn.
    - **Phòng Giám Đốc (Dũng 1)**: Bộ sofa da đỏ phong cách Chesterfield cao cấp với kỹ thuật may rút cúc quả trám (Diamond Button Tufting), tay vịn cuộn tròn đóng hàng đinh tán mạ đồng, chân gỗ hồ đào bun feet; bàn trà mặt kính cường lực đen trong suốt phản chiếu vát cạnh, khung mạ vàng, kệ tạp chí bên dưới và 2 tách cà phê sứ trắng bốc khói.
    - **Phòng Họp Boardroom**: Bàn họp hội đồng dáng thuyền (Boat-shaped) bằng gỗ óc chó vát góc, hộp máng cáp nhôm xước trung tâm có cổng cắm LED, thảm da lót bàn tại 4 góc ngồi, 2 chiếc laptop siêu mỏng mở sẵn trình chiếu slide chiến lược, ly nước đá pha lê.
    - **Bảng Kính Kiến Trúc (Whiteboard)**: Mặt kính mờ gắn 4 chốt inox góc, sơ đồ luồng hệ thống kết nối 4 Dũng kèm các mẩu giấy ghi chú Sticky Notes vàng/hồng/xanh.
    - **Server Datacenter Rack 42U**: Vỏ thép đen, cửa kính tối, màn hình LCD xanh giám sát CPU, 5 khay máy chủ server blades với dãy đèn LED trạng thái (CPU xanh lá, Network xanh cyan, Disk vàng cam nhấp nháy liên tục).
    - **Phòng Bida (Dũng 4)**: Bàn bida 9-foot thi đấu chuẩn quốc tế, mặt nỉ Simonis xanh lục đổ bóng, thành bàn gỗ gụ khảm điểm ngắm ngọc trai (Diamond Sights), 6 lỗ bọc góc đồng, tam giác xếp 15 bi bóng có phản chiếu ánh sáng và gậy cơ bịt lơ xanh.
    - **Máy Arcade Retro '84**: Thân tím neon cyberpunk, biển hiệu phát sáng "PIXEL '84", màn hình CRT cong có scanlines hiển thị game bắn phi thuyền 8-bit, 2 cần gạt joystick đỏ và 4 nút bấm, cửa nhét xu 25¢ sáng đèn.
    - **Khu Cafe & Pantry**: Quầy bar mặt đá granite đen bóng, bồn rửa inox vòi cổ ngỗng, máy pha Espresso 2 cần chuyên nghiệp có đồng hồ áp suất và khói bốc lên; tủ lạnh 2 cánh inox thương mại có màn hình LED nhiệt độ `-18°C/4°C` và giấy nhớ nam châm; máy bán nước tự động có đèn LED phát sáng và 3 tầng lon nước giải khát.
- [x] Bản build đóng gói `frontend/dist` hoàn tất 100%, 0 lỗi, 0 warning.
- [x] Đã commit và đẩy toàn bộ mã nguồn lên GitHub.

### [2026-10-25] Nâng cấp Không gian Ánh sáng 4D Tự nhiên (Pin A) & Trọn bộ Nội thất Văn phòng Isometric (Pin B)
- [x] **Tham khảo & Nghiên cứu trực tiếp**:
  - `https://www.pinterest.com/pin/788974428470075560/` (Pin A: Phòng Isometric ấm cúng, tia nắng tự nhiên chiếu xiên qua cửa sổ xuống sàn gỗ, bụi hạt ánh sáng lơ lửng, kệ cây leo tường, lò vi sóng trên nóc tủ lạnh).
  - `https://www.pinterest.com/pin/412290540892514371/` (Pin B: Trọn bộ hơn 80 chi tiết văn phòng isometric - Bộ sofa nỉ góc Royal Blue kèm 2 gối tựa cam trên thảm sọc xanh lá, máy photocopy laser đa khay văn phòng có thùng rác tái chế xanh, tủ kính trưng bày tài liệu hồ sơ có file kẹp nhiều màu sắc, cây bonsai Nhật Bản uốn lượn trên đôn gỗ trắc, cây cảnh hình cầu cắt tỉa Topiary trong chậu gốm nung, vách ngăn kính mờ nhôm xước).
- [x] **Triển khai kỹ thuật Chiều sâu 4D & Hiệu ứng Ánh sáng (Pin A)**:
  - **Tia nắng xiên tự nhiên (Volumetric Sunlight God Rays)**: Khung cửa sổ kiến trúc đa ô kính trắng đón ánh nắng vàng ấm (`#fef08a`), tạo dải sáng xiên tự nhiên chiếu rọi xuống sàn gỗ sồi tạo vệt sáng hình thang 3D ấm áp.
  - **Hạt bụi ánh sáng động (Floating Dust Motes)**: Tích hợp các hạt vi bụi vàng lơ lửng bồng bềnh chuyển động trong luồng sáng mặt trời, mang lại cảm giác chân thực sống động.
  - **Kệ cây leo thường xuân (Wall Ivy Shelf)**: Kệ gỗ gắn tường giá đỡ đồng, chậu gốm sứ trắng với các nhánh dây leo English Ivy rủ dài xuống tường, lá thường xuân rung rinh theo gió.
  - **Lò vi sóng điện tử trên nóc tủ lạnh (Microwave on Fridge)**: Lò vi sóng kim loại xám than đặt trên nóc tủ lạnh inox pantry, cửa kính tối, tay nắm nhôm, bảng điều khiển số màn hình LED xanh cyan phát sáng `0:45` và núm vặn hẹn giờ.
- [x] **Triển khai Trọn bộ Nội thất Isometric Chuẩn xác (Pin B)**:
  - **Sofa nỉ góc Royal Blue & Thảm sọc xanh lá (Executive Lounge Suite)**: Thảm trải sàn sọc xanh ngọc bích (`#15803d` / `#22c55e`), bộ sofa góc modular màu xanh hoàng gia (Royal Blue) với tựa lưng rút múi, đệm ngồi êm ái, chân gỗ sồi vát thon và điểm nhấn là 2 gối tựa màu cam rực rỡ (`#ea580c` / `#f97316`) ở 2 góc sofa.
  - **Máy Photocopy & In Laser Đa Khay (Office Multifunction Copier)**: Thân máy kim loại trắng sứ & xám hiện đại, 2 khay kéo đựng giấy A4/A3, nắp nạp tài liệu tự động ADF, màn hình cảm ứng điều khiển góc nghiêng đèn LED nhấp nháy, khay xuất tài liệu bên hông và thùng rác tái chế giấy màu xanh dương có logo recycling trắng.
  - **Tủ kính trưng bày tài liệu hồ sơ (Glass Filing Cabinet)**: Khung tủ thép tĩnh điện, 3 tầng đợt kệ bên trong chứa đầy các file còng tài liệu màu sắc rực rỡ (đỏ, vàng, xanh dương, xanh lục, tím, cam có nhãn gáy trắng), cánh cửa kính trong suốt phản chiếu vệt sáng vát chéo và tay nắm nhôm dài.
  - **Cây cảnh hình cầu Topiary (Manicured Ball Topiary)**: Chậu gốm nung Terracotta vát tròn có viền và đốm sáng, đất mùn đen, thân gỗ đứng, vương miện lá hình cầu tròn cắt tỉa hoàn hảo với nhiều lớp chuyển màu xanh lá và đốm nắng.
  - **Cây Bonsai Nhật Bản (Japanese Zen Bonsai)**: Đôn trưng bày bằng gỗ trắc đen chạm trổ, chậu gốm oval dẹt tráng men xanh lục, đất rêu phong, thân gỗ gồ ghề uốn lượn và 3 cụm tán lá mây đa tầng vươn ngang.
  - **Vách ngăn lửng kính mờ hiện đại (Frosted Glass Cubicle Partitions)**: Khung cột nhôm phay xước, tấm kính mờ cường lực dán các mẩu giấy ghi chú sticky note và thanh nẹp gỗ sồi chân tường viền đồng thau.
- [x] Kiểm tra bản build `frontend/dist` hoàn tất 100%, 0 lỗi, 0 warning.
- [x] Đã commit và đẩy toàn bộ mã nguồn lên GitHub.

### [2026-10-25] Hoàn thiện Không gian Văn phòng Thật Chuẩn Pinterest Pin B (80 Elements Open-Plan Office)
- [x] **Đồng bộ hóa Sàn gạch Công sở Mở (Unified Office Isometric Tile Floor)**:
  - Thay thế các khối màu sàn tối rời rạc bằng toàn bộ sàn gạch Isometric màu lam hoa cà / xanh tím nhạt (`#b8c4df` / `#c8d4ec` với đường ron gạch `#99a8cb` sắc nét) trải dài liền mạch khắp văn phòng.
  - Phân vùng chức năng bằng thảm chuyên dụng: Thảm sọc xanh ngọc bích (`#15803d` / `#22c55e`) tại Executive Lounge, thảm xanh Navy tại Boardroom, gạch ceramic trắng tại Pantry.
- [x] **Hệ thống Vách ngăn Cubicle Chuẩn mực Công sở**:
  - Vách nỉ acoustic màu ghi sáng (`#cbd5e1`), dải kính mờ văn phòng viền trên (`rgba(186, 230, 253, 0.45)`), trụ góc nhôm xước và giấy ghi chú sticky note rực rỡ (vàng, hồng, xanh lá).
- [x] **Tủ kính xanh Royal Blue & Chậu hoa đỏ trên nóc (Signature Pin B Item)**:
  - Tủ kính kim loại xanh Royal Blue (`#1d4ed8`), 4 tầng kệ đựng đầy file còng tài liệu đa màu sắc, cánh cửa kính trong suốt phản chiếu vát chéo và **chậu gốm nung có hoa đỏ nở rộ trên nóc tủ** chuẩn 100% hình ảnh tham khảo.
- [x] **Bàn trà đĩa trái cây tươi (Fruit Bowl Table)**:
  - Bàn trà gỗ xanh Teal bóng bẩy sẫm màu (`#0f2942`) đặt đĩa gốm trắng với táo đỏ, cam vàng và táo xanh ở chính giữa, bên cạnh 2 tách cà phê espresso bốc khói.
- [x] **Trạm làm việc Laminate trắng sứ & Hộp tài liệu In/Out**:
  - Bàn dev và bàn kiến trúc phủ mặt laminate trắng ngà viền nẹp ABS xám, hộc tủ 3 ngăn tay nắm nhôm, khay đựng tài liệu In/Out 2 tầng có xấp giấy A4.
- [x] Bản build `frontend/dist` hoàn tất 100%, 0 lỗi, 0 warning.
- [x] Đã commit và đẩy toàn bộ mã nguồn lên GitHub.

### [2026-10-25] Nâng cấp Toàn diện Nhân vật Công sở Sáng sủa, Thiết bị Hardware & Hệ thống 7 Chỗ Ngồi (Chuẩn Pin B)
- [x] **Thiết kế lại 4 Nhân vật Sáng sủa, Năng động Chuẩn Văn phòng Công nghệ (People)**:
  - Thay thế phong cách cổ điển mafia bằng 4 bộ trang phục công sở hiện đại, sáng sủa, sắc nét chuẩn 100% mục "people" của Pinterest Pin B:
    - **Dũng 1 (Software Director)**: Bộ com-lê vest xám công sở sang trọng (`#64748b`), sơ mi trắng, cà vạt xanh biển (`#0284c7`), tóc nâu chải gọn gàng và giày da nâu.
    - **Dũng 2 (Software Architect & PM)**: Sơ mi trắng công sở cộc tay/xắn tay (`#f8fafc`), cà vạt xanh navy (`#1e40af`), quần tây xanh đen (`#1e3a8a`), kính mắt gọng vàng tri thức.
    - **Dũng 3 (Senior Fullstack Dev)**: Áo thun tech đen than (`#1e293b`), **tai nghe bạc đeo quanh cổ (`#cbd5e1`)**, quần jeans xanh hiện đại (`#2563eb`), **tay cầm cốc cà phê đỏ tươi (`#ef4444`)** bốc khói.
    - **Dũng 4 (Test Lead & QA Specialist)**: Áo len cổ tim xanh lá tươi (`#16a34a`) phối cổ sơ mi trắng, quần âu xám than (`#334155`), thẻ đeo QA an ninh màu vàng.
  - Tái tạo lại cả 4 file sprite PNG trong suốt độ phân giải pixel-perfect (`frontend/public/assets/characters/dung_1.png` -> `dung_4.png`) và cập nhật đồng bộ logic render Canvas fallback.
- [x] **Trang bị Hardware & Ghế xoay Công thái học (Hardware & Furniture)**:
  - **Ghế xoay văn phòng nỉ xanh Royal Blue (`#2563eb`)**: Thiết kế tựa lưng cong công thái học, đệm nỉ xanh hoàng gia, xi lanh nâng hạ thủy lực nhôm và chân sao 5 cánh có bánh xe lăn (`#475569`).
  - **Thiết bị Hardware chuẩn Pin B**: Máy in / photocopy đa khay có thùng rác tái chế, màn hình LCD viền bạc hiển thị xanh dương, mở rộng khay tài liệu In/Out 2 tầng trên mặt bàn.
- [x] **Bố trí Không gian 7 Chỗ Ngồi Công sở (4 Nhân vật Core giữ nguyên vị trí)**:
  - Hệ thống văn phòng hiện có đầy đủ **7 vị trí ngồi / làm việc chuẩn công sở**:
    1. Chỗ số 1: Ghế sofa nỉ Royal Blue phòng tiếp khách (Dũng 1 điều hành).
    2. Chỗ số 2: Trạm vẽ kỹ thuật cubicle kiến trúc sư (Dũng 2 thẩm định).
    3. Chỗ số 3: Trạm lập trình Fullstack Dev chính (Dũng 3 gõ code).
    4. Chỗ số 4: Khu vực bida & máy Arcade testing (Dũng 4 kiểm thử).
    5. Chỗ số 5: Bàn làm việc cubicle phụ (Secondary Office Desk) có màn hình LCD, khay tài liệu và ghế xoay xanh.
    6. Chỗ số 6: Ghế xoay hội nghị số 1 phòng họp Boardroom.
    7. Chỗ số 7: Ghế xoay hội nghị số 2 phòng họp Boardroom.
  - 4 nhân vật Dũng hoạt động chính xác tại 4 vị trí cốt lõi, đồng thời có thể tự do điều động tới các chỗ ngồi họp hoặc thao tác trực tiếp.
- [x] Bản build `frontend/dist` hoàn tất 100%, 0 lỗi, 0 warning.
- [x] Đã commit và đẩy toàn bộ mã nguồn lên GitHub.

### [2026-10-25] Nâng cấp Toàn diện Sàn gạch Diamond 2:1 Isometric, Bốt Tardis, Chú mèo ngủ & Đồng bộ 6 Phân vùng (Chuẩn Artwork)
- [x] **Sàn gạch Diamond 2:1 Isometric Chuẩn Habbo / Retro Vector Art**:
  - Thay thế toàn bộ sàn phẳng 2D bằng hệ lưới hình thoi Isometric 2:1 (`tileW: 28px, tileH: 14px`) sắc nét.
  - Phối màu gạch lam hoa cà / xanh tím nhạt xen kẽ (`#c8d4ec` / `#bcc8e4`), chỉ ron gạch tinh tế (`#9aaac7`) và vệt phản quang viền trên của từng viên gạch.
- [x] **Tích hợp các Chi tiết Iconic Độc bản từ Artwork Tham Khảo**:
  - **Bốt điện thoại Retro Tardis / Police Box**: Bốt xanh navy hoàng gia (`#1e3a8a`), nóc mái dốc, đèn đỉnh phát sáng vàng, biển hiệu chữ trắng `POLICE BOX`, 4 ô kính cửa sổ xanh nhạt và tay nắm bạc đặt tại góc phòng hậu cần.
  - **Chú mèo ngủ cuộn tròn trên bàn làm việc**: Chú mèo lông trắng đốm cam (`#f97316`) gối đầu ngủ ngon lành, tai tam giác nhỏ, mắt nhắm tít và đuôi uốn cong nằm yên bình trên bàn làm việc trạm QA.
  - **Tủ Sideboard gắn tường màu xanh dương**: Cửa kính trượt mờ (`rgba(186, 230, 253, 0.6)`), tay nắm trượt, trên nóc có xấp giấy A4 trắng và khay gỗ đựng hồ sơ.
  - **Ghế xoay văn phòng có Cặp da nâu**: Chiếc cặp da nâu công tác (`#78350f`) kèm khóa đồng và quai xách đặt ngay ngắn trên mặt ghế xoay góc phòng.
  - **Poster Quả địa cầu & Tranh hoa tươi viền gỗ**: Globe Infographics Poster và Framed Floral Art treo tường sắc sảo.
  - **Đồng hồ tròn treo tường viền xanh lá**: Kim giờ và phút chỉ 10:10 thanh lịch.
  - **Hộp lưu trữ hồ sơ Carton**: Bộ hộp tài liệu văn phòng màu vàng cam và xanh lá có nhãn dán và lỗ xách.
- [x] **Đồng bộ hóa 6 Phân vùng Không gian & Z-Depth Sorting Không Chồng chéo**:
  1. **Executive Lounge & Director Hub (Dũng 1)**: Thảm sọc xanh ngọc bích, sofa nỉ góc Royal Blue kèm gối cam, bàn trà đĩa hoa quả tươi, tủ kính tài liệu hồ sơ, tranh nghệ thuật viền vàng và cây Topiary.
  2. **Cubicle Kiến Trúc Sư & PM (Dũng 2)**: Trạm vẽ kỹ thuật CAD 2 màn hình, thước chữ T, bản vẽ blueprint, kệ sách tường sau, mini server rack đèn LED và ghế xoay nỉ xanh.
  3. **Cubicle QA & Security Lead (Dũng 4)**: Trạm kiểm thử cubicle hiện đại, màn hình CRT, desk phone, chú mèo ngủ cuộn tròn, tủ sideboard kính trượt và ghế xoay cặp da.
  4. **Khu Hậu Cần & Bốt Tardis**: Bốt điện thoại Tardis, đồng hồ tròn xanh lá, tủ lạnh có lò vi sóng trên nóc, quầy pantry inox, bình nước nóng lạnh và máy bán nước tự động.
  5. **Dev Lab & Workstations (Dũng 3)**: Trạm lập trình Fullstack 2 màn hình code matrix & microservice DAG, phím cơ RGB, cốc cà phê Dev Fuel, bàn Peer Dev và cây Monstera lá xẻ.
  6. **Khu Thảo Luận Chiến Lược & Máy In**: Bàn họp thảo luận gỗ óc chó, bảng kính kiến trúc whiteboard, máy in đa khay laser có thùng rác tái chế, đôn cây Bonsai Nhật Bản và tủ kính hồ sơ.
- [x] **Kiểm tra Clean Code & Đóng gói Production**:
  - Dọn sạch 100% dead code, no unused variables/imports (`TS6133` = 0).
  - Bản build đóng gói `frontend/dist` hoàn tất 100%, 0 lỗi, 0 warning.
- [x] Sẵn sàng đẩy toàn bộ mã nguồn lên GitHub.

---

## 6. HƯỚNG DẪN KẾT NỐI SQL SERVER TRÊN PRODUCTION SERVER

Khi đưa lên máy chủ thật có SQL Server:
1. Cài đặt **Microsoft ODBC Driver 18 for SQL Server**:
   - Tải từ trang chủ Microsoft hoặc cài qua chocolatey: `choco install sqlserver-odbcdriver`
2. Tạo cơ sở dữ liệu trên SQL Server (Ví dụ: `AgentMultiDB`).
3. Khai báo biến môi trường trong file `backend/.env`:
   ```ini
   SQL_SERVER_CONNECTION_STRING=mssql+pyodbc://sa:YourStrongPassword123@localhost:1433/AgentMultiDB?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes
   ```
4. Khi khởi chạy, SQLAlchemy 2.0 sẽ tự động tạo bảng `agents`, `project_sessions`, `deliberation_messages`, `office_event_logs` và nạp sẵn 4 chuyên gia Dũng vào database.

---

## 7. KẾ HOẠCH BÀN GIAO & VIỆC CẦN LÀM TIẾP THEO (NEXT STEPS)
1. **Kiểm tra đẩy mã nguồn**: Đẩy các commit lên GitHub `https://github.com/adwewecat/Agent_Mutil.git`.
2. **Triển khai Server**: Đưa thư mục `frontend/dist` lên Web Server (IIS/Nginx) và chạy FastAPI Backend bằng Supervisor / PM2 / Windows Service.
3. **Mở rộng**: Có thể tích hợp thêm LLM trực tiếp (OpenAI API key hoặc Gemini API key) nếu muốn câu trả lời của 4 Dũng được sinh động theo thời gian thực từ API bên ngoài ngoài template tối ưu có sẵn.

