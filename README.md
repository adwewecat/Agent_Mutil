# Agent Multi - Virtual Pixel Office & Bộ Ba Chuyên Gia AI (3 Dũng)

![Agent Multi Banner](https://img.shields.io/badge/Agent_Pixels-B%E1%BB%99_Ba_D%C5%A9ng-blueviolet?style=for-the-badge)
![Python 3.14+](https://img.shields.io/badge/Python-3.14%2B-blue?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC292B?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Hệ thống mô phỏng văn phòng ảo Pixel Art tương tác sống động (lấy cảm hứng từ [gcampton/Agent-Pixels](https://github.com/gcampton/Agent-Pixels) và [thepixeloffice.ai](https://thepixeloffice.ai)) tích hợp quy trình phối hợp tự động giữa **Bộ Ba Chuyên Gia AI cao cấp** ("Bộ Ba Dũng").

---

## 🏛️ 5 TRỤ CỘT KỸ THUẬT CỐT LÕI

1. **Backend**: Python 3.14+ (tương thích Python 3.10+) + FastAPI (hiệu năng cao, async, tự động sinh tài liệu Swagger/Redoc).
2. **Frontend**: React 19 + TypeScript + Vite (giao diện Cyberpunk/Retro Pixel Art, 2.5D Isometric Canvas Engine, 60fps mượt mà).
3. **Database**: Microsoft SQL Server (`SQLAlchemy 2.0` + `pyodbc` + `Microsoft ODBC Driver 18 for SQL Server`), tích hợp cơ chế fallback tự động sang SQLite (`sqlite:///./agent_multi.db`) khi chạy local dev.
4. **Phương thức giao tiếp**: REST API chuẩn hóa theo đặc tả OpenAPI tự động (tại `/docs` và `/redoc`) kết hợp WebSocket thời gian thực (`/ws/office`).
5. **Mô hình triển khai**: Kiến trúc tách biệt độc lập (Decoupled Architecture) giữa Frontend và Backend. Frontend build tĩnh ra thư mục `frontend/dist/` sẵn sàng triển khai lên mọi Web Server (IIS, Nginx, Caddy).

---

## 👥 ĐỘI NGŨ BỘ BA CHUYÊN GIA DŨNG

| Nhân vật | Chức danh / Vai trò | Kinh nghiệm | Nhiệm vụ chính trong Workflow |
| :--- | :--- | :--- | :--- |
| **Nhân viên 1 (Dũng 1)** | **Giám đốc Vận hành & Chiến lược Phát triển Toàn diện** | 40 năm kinh nghiệm F&B & Fastfood | Đề xuất quy trình chuẩn, phân tích sâu nghiệp vụ; đối chiếu case studies thị trường toàn cầu (McDonald's, Starbucks, Domino's, Haidilao... xem họ làm thế nào, gặp khó khăn gì, cái hay là gì). Tranh luận nảy lửa với Nhân viên 2. |
| **Nhân viên 2 (Dũng 2)** | **Giám đốc Phần mềm & Kiến trúc Hệ thống** | 40 năm kinh nghiệm Software & Tech | Phân tích toàn diện hệ thống xem có đáp ứng được yêu cầu của Nhân viên 1 không; bóc tách mặt lợi và tiêu cực; đối chiếu đối thủ công nghệ (Toast POS, Olo, Square, Meituan...). Cùng Nhân viên 1 lập Bảng Thống Nhất gồm 5 tiêu chuẩn cốt lõi. |
| **Nhân viên 3 (Dũng 3)** | **Senior Fullstack Developer** | 30 năm kinh nghiệm | **Chỉ thực sự làm việc khi Người dùng duyệt từng ý của Nhân viên 1 & 2 đã thống nhất** và chỉ định nhiệm vụ cụ thể cần thực thi. Viết mã nguồn Clean Code tối ưu, chuẩn OpenAPI, bọc bảo mật HMAC SHA-256 + Idempotency Key. Báo cáo nghiệm thu 2 chiều. |

---

## 🔄 QUY TRÌNH HỢP TÁC & NGHIỆM THU 5 GIAI ĐOẠN

```mermaid
flowchart TD
    A["Giao đề bài cho Bộ Ba Dũng"] --> B["Giai đoạn 1: Tranh luận nảy lửa (Dũng 1 & Dũng 2) tại Boardroom"]
    B --> C["Giai đoạn 2: Lập Bảng Thống Nhất 5 tiêu chuẩn cốt lõi"]
    C --> D{"CỔNG PHÊ DUYỆT NGƯỜI DÙNG<br/>(Tích chọn từng ý cần phát triển)"}
    D -- "Chưa duyệt" --> E["Hệ thống dừng chờ Người dùng"]
    D -- "Đã duyệt từng ý" --> F["Giai đoạn 3: Dũng 3 vào Dev Lab viết Clean Code & REST API"]
    F --> G["Giai đoạn 4: Dũng 1 & Dũng 2 họp Boardroom thẩm định & nghiệm thu 2 chiều"]
    G --> H["Giai đoạn 5: Kích hoạt Popup Báo Cáo Nghiệm Thu Toàn Diện cho Người dùng"]
```

---

## 🚀 HƯỚNG DẪN CHẠY DỰ ÁN NHANH NHẤT (1-CLICK RUN)

Bạn chỉ cần chạy 1 file duy nhất ở thư mục gốc:
- **Cách 1 (Chuột - Khuyến nghị)**: Nhấp đúp chuột vào file `run.bat`.
- **Cách 2 (PowerShell)**: Chạy `.\run.ps1`.
- **Để dừng toàn bộ hệ thống**: Nhấp đúp vào file `stop.bat`.

> Script sẽ tự động:
> 1. Kiểm tra môi trường Python (3.10+ / 3.14+) và Node.js.
> 2. Khởi động Backend FastAPI tại `http://localhost:8000`.
> 3. Khởi động Frontend Vite tại `http://localhost:5173`.
> 4. Tự động mở trình duyệt web đưa bạn vào văn phòng ảo Bộ Ba Dũng!

---

## 🛠️ HƯỚNG DẪN CHẠY THỦ CÔNG TỪNG THÀNH PHẦN

### 1. Khởi động Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Trên Windows:
.\venv\Scripts\activate
# Cài đặt thư viện:
pip install -r requirements.txt
# Chạy server FastAPI:
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Docs (Swagger UI): `http://localhost:8000/docs`
- API ReDoc: `http://localhost:8000/redoc`

### 2. Khởi động Frontend (React 19 + TypeScript + Vite)
```bash
cd frontend
npm.cmd install
npm.cmd run dev
```
- Giao diện văn phòng ảo: `http://localhost:5173`

### 3. Đóng gói cho Production Server
```bash
cd frontend
npm.cmd run build
```
Toàn bộ mã nguồn đóng gói nằm tại `frontend/dist/` sạch sẽ, sẵn sàng deploy lên Web Server (IIS, Nginx, Apache, Caddy).

---

## 🗄️ HƯỚNG DẪN KẾT NỐI SQL SERVER TRÊN PRODUCTION

1. Cài đặt **Microsoft ODBC Driver 18 for SQL Server**:
   - Tải từ trang chủ Microsoft hoặc qua chocolatey: `choco install sqlserver-odbcdriver`
2. Tạo cơ sở dữ liệu trên SQL Server (Ví dụ: `AgentMultiDB`).
3. Khai báo biến môi trường trong file `backend/.env`:
   ```ini
   SQL_SERVER_CONNECTION_STRING=mssql+pyodbc://sa:YourStrongPassword123@localhost:1433/AgentMultiDB?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes
   ```
4. Khi khởi chạy, SQLAlchemy 2.0 sẽ tự động tạo bảng và nạp sẵn dữ liệu Bộ Ba Chuyên Gia Dũng.

---

## 📌 QUY TẮC BẤT DI BẤT DỊCH CỦA DỰ ÁN
Mọi quy tắc phát triển, nhật ký thay đổi và hướng dẫn khôi phục toàn diện khi cài lại Windows được ghi chép đầy đủ tại [GEMINI.md](file:///d:/LAPTRINH/Agent_multi/GEMINI.md).
- **Check và note tài liệu trước & sau khi làm**: Cập nhật `GEMINI.md` sau mỗi phiên làm việc.
- **Clean Code 100%**: Tuyệt đối không để code rác, code thừa; mọi hàm và component đều có chú thích tiếng Việt rõ ràng.
- **Git & GitHub**: Bất kỳ khi nào thêm tính năng hoặc chỉnh sửa xong: **BẮT BUỘC ĐẨY CODE NGAY LÊN GITHUB**.
