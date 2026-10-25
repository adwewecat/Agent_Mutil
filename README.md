# Agent Multi - Virtual Pixel Office & 4 Dũng AI Collaboration System

![Agent Multi Banner](https://img.shields.io/badge/Agent_Pixels-4_D%C5%A9ng-blueviolet?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC292B?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Hệ thống mô phỏng văn phòng ảo Pixel Art (lấy cảm hứng từ [gcampton/Agent-Pixels](https://github.com/gcampton/Agent-Pixels)) tích hợp quy trình phối hợp tự động giữa **4 chuyên gia AI cao cấp** ("Bộ tứ Dũng").

---

## 👥 ĐỘI NGŨ 4 AGENT ("BỘ TỨ DŨNG")

1. **Dũng 1 - Software Director**:
   - Tiếp nhận vấn đề, yêu cầu nghiệp vụ từ người dùng.
   - Phân tích mục tiêu, đề xuất giải pháp chiến lược ban đầu.
   - Phối hợp và phản biện với Dũng 2 để chốt giải pháp tối ưu nhất.

2. **Dũng 2 - Software Architect & Project Manager (40 năm kinh nghiệm)**:
   - Thẩm định tính khả thi kỹ thuật, thời gian, chi phí, rủi ro hệ thống.
   - Sẵn sàng rẽ nhánh, tư vấn giải pháp tối ưu (thậm chí không cần code nếu có thể giải quyết bằng quy trình hoặc công cụ sẵn có).
   - Phân tích kiến trúc sâu sắc: độ trễ (latency), tài nguyên phần cứng, tải chịu đựng, bảo mật, cơ sở dữ liệu.

3. **Dũng 3 - Senior Fullstack Developer (40 năm kinh nghiệm)**:
   - Hiện thực hóa phương án sau khi Dũng 1 và Dũng 2 đã chốt.
   - Lập trình mã nguồn sạch (Clean Code), tối ưu thuật toán, xây dựng REST API và UI hoàn chỉnh.

4. **Dũng 4 - Test Engineer / QA Lead (40 năm kinh nghiệm)**:
   - Đánh giá toàn diện mã nguồn do Dũng 3 xây dựng.
   - Lập ma trận Test Cases, kiểm tra giá trị biên (boundary values), stress test, phát hiện mọi lỗi tiềm ẩn và lỗ hổng bảo mật.

---

## 🏛️ KIẾN TRÚC HỆ THỐNG

- **Backend**: Python 3.10+ & FastAPI, REST API theo chuẩn OpenAPI tự động, WebSocket cho dữ liệu văn phòng thời gian thực.
- **Database**: Hỗ trợ Microsoft SQL Server (`SQLAlchemy 2.0` + `pyodbc` + `Microsoft ODBC Driver 18`), tự động fallback linh hoạt sang SQLite khi chạy độc lập dưới môi trường máy phát triển.
- **Frontend**: React 19 + TypeScript + Vite, Canvas Pixel Art Engine hiển thị toàn bộ phòng làm việc, chuyển đổi Camera an ninh, retro sound effects, bảng điều khiển nhiệm vụ trực quan.
- **Triển khai**: Độc lập tách biệt giữa Frontend và Backend, build file tĩnh sạch sẽ vào thư mục `frontend/dist/`.

---

## 🚀 HƯỚNG DẪN CHẠY DỰ ÁN NHANH NHẤT (1-CLICK RUN)

Bạn chỉ cần chạy 1 file duy nhất ở thư mục gốc:
- **Cách 1 (Chuột - Khuyến nghị)**: Nhấp đúp chuột vào file `run.bat`.
- **Cách 2 (PowerShell)**: Chạy `.\run.ps1`.
- **Để dừng toàn bộ hệ thống**: Nhấp đúp vào file `stop.bat`.

> Script sẽ tự động:
> 1. Kiểm tra môi trường Python và Node.js.
> 2. Khởi động Backend FastAPI tại `http://localhost:8000`.
> 3. Khởi động Frontend Vite tại `http://localhost:5173`.
> 4. Tự động mở trình duyệt web đưa bạn vào văn phòng ảo 4 Dũng!

---

## 🛠️ HƯỚNG DẪN CHẠY THỦ CÔNG TỪNG THÀNH PHẦN

### 1. Khởi động Backend
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Cài đặt thư viện:
pip install -r requirements.txt
# Chạy server FastAPI:
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Docs: `http://localhost:8000/docs`

### 2. Khởi động Frontend
```bash
cd frontend
npm.cmd install
npm.cmd run dev
```
- Giao diện truy cập: `http://localhost:5173`

### 3. Đóng gói cho Production Server
```bash
cd frontend
npm.cmd run build
```
Toàn bộ mã nguồn đóng gói nằm tại `frontend/dist/` sẵn sàng deploy lên Web Server (IIS, Nginx, Apache, Caddy).

---

## 📌 QUY TẮC PHÁT TRIỂN & BẢO TRÌ
Chi tiết quy tắc bất di bất dịch, ghi chú thay đổi và hướng dẫn khôi phục khi cài lại Windows vui lòng xem tại [GEMINI.md](file:///d:/LAPTRINH/Agent_multi/GEMINI.md).