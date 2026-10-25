"""
Router WebSocket phát sóng sự kiện thời gian thực cho Pixel Office (vị trí nhân vật, hành động, lời thoại).
"""

import json
from typing import List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(tags=["WebSocket Realtime"])


class ConnectionManager:
    """
    Quản lý các kết nối WebSocket đang hoạt động tới máy chủ.
    """
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        """
        Gửi dữ liệu sự kiện tới toàn bộ client đang mở màn hình văn phòng.
        """
        payload = json.dumps(message)
        for connection in self.active_connections:
            try:
                await connection.send_text(payload)
            except Exception:
                pass


manager = ConnectionManager()


@router.websocket("/ws/office")
async def websocket_office_endpoint(websocket: WebSocket):
    """
    Endpoint WebSocket kết nối liên tục với Canvas Office của Frontend.
    Nhận tin nhắn ping/pong hoặc lệnh di chuyển tức thời và broadcast lại cho mọi người dùng.
    """
    await manager.connect(websocket)
    # Gửi thông điệp chào mừng khi kết nối thành công
    await websocket.send_text(json.dumps({
        "event": "connected",
        "message": "Kết nối thành công tới máy chủ Virtual Pixel Office (4 Dũng)"
    }))
    try:
        while True:
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
                # Xử lý các loại sự kiện từ client và broadcast
                await manager.broadcast({
                    "event": "office_update",
                    "data": payload
                })
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({"error": "Dữ liệu không đúng định dạng JSON"}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
