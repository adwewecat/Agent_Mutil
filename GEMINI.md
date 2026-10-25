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

