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
- [x] Build bản đóng gói sạch sẽ và đẩy mã nguồn lên GitHub.



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

