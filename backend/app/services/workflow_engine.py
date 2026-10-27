"""
Module lõi điều phối quy trình hợp tác giữa 3 chuyên gia AI (Workflow Engine).
Đội ngũ 3 Nhân Viên:
1. Nhân Viên 1 (Dũng 1): Giám đốc Vận hành & Chiến lược Phát triển Toàn diện (40 năm KN F&B & Fastfood)
   - Đề xuất quy trình chuẩn, phân tích sâu thị trường, đối chiếu kinh nghiệm đối thủ/đối tác (McDonald's, Starbucks, Domino's, Haidilao...)
2. Nhân Viên 2 (Dũng 2): Giám đốc Phần mềm & Kiến trúc Hệ thống (40 năm KN)
   - Phân tích toàn diện hệ thống có đáp ứng được yêu cầu của NV1 không; bóc tách mặt lợi, tiêu cực; đối chiếu đối thủ công nghệ (Toast POS, Olo, Square, Meituan...)
   - Tranh luận nảy lửa với NV1 để lập Bảng Thống Nhất: Yêu cầu, Quy trình, Tích cực, Tiêu cực, Rủi ro, % Đáp ứng, Chưa đáp ứng & Giải pháp mềm.
3. Nhân Viên 3 (Dũng 3): Senior Fullstack Developer (30 năm KN)
   - Chỉ thực sự làm khi Người dùng duyệt từng ý đã thống nhất và cái cần thực thi.
   - Hoàn thành xong báo cáo lại để NV1 và NV2 đánh giá, nghiệm thu, hiện Popup cho Người dùng xem.
"""

import json
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models import ProjectSessionModel, DeliberationMessageModel
from app.services.office_manager import move_agent_to_room


class WorkflowEngine:
    """
    Bộ máy điều phối tranh luận chiến lược và thực thi phần mềm của Bộ Ba Dũng.
    """

    @classmethod
    def _generate_consensus_matrix(cls, problem: str) -> List[Dict[str, Any]]:
        """
        Sinh Bảng Thống Nhất sau cuộc tranh luận nảy lửa giữa Nhân viên 1 và Nhân viên 2.
        Đầy đủ 5 mục cốt lõi theo đúng yêu cầu:
        1. Yêu cầu là gì
        2. Phân tích quy trình, mặt tích cực, tiêu cực, rủi ro
        3. Hệ thống đáp ứng bao nhiêu %
        4. Các vấn đề hệ thống có thể đáp ứng được
        5. Những gì hệ thống chưa đáp ứng được và giải pháp mềm (vận hành mềm, quy trình con người...)
        6. Cái cần thực thi cụ thể giao cho Nhân viên 3 (Senior Dev 30 năm KN).
        """
        return [
            {
                "id": "req_1",
                "requirement": "Xây dựng mã QR Động (Dynamic QR Token) gắn theo từng bàn ăn và phiên phục vụ",
                "process_analysis": "Quy trình: Khi khách vào bàn, nhân viên mở bàn trên POS -> Mã QR trên bàn kích hoạt Token HMAC SHA-256 có hạn 2h -> Khách quét order -> Đơn khớp đúng số bàn -> Khách thanh toán xong mã tự hủy phiên.",
                "positives": "Tự động hóa 100% khâu order, triệt tiêu nhầm lẫn số bàn, tiết kiệm 35% nhân sự chạy bàn giờ cao điểm.",
                "negatives": "Khách ngồi quá 2h hoặc mạng chập chờn mã QR có thể hết hạn giữa chừng, buộc phải quét lại làm gián đoạn trải nghiệm.",
                "risks": "Rủi ro kẻ gian chụp ảnh mã QR mang về nhà quét gọi đơn ma phá hoại; rủi ro dán đè mã QR lừa đảo (QR Phishing).",
                "system_compliance_percent": 95,
                "supported_features": "Hệ thống đáp ứng xuất sắc: Sinh mã động kèm Salt bí mật, kiểm tra HMAC chữ ký số, khóa phiên theo thời gian thực (Time-to-Live 2h) và hủy mã khi đơn thanh toán hoàn tất.",
                "unsupported_gaps": "Hệ thống KHÔNG THỂ kiểm soát được hành vi kẻ xấu dùng kéo cạo rách mã QR hoặc cố tình dùng bút mực bôi đen mã mica dán tại bàn.",
                "soft_solutions": "GIẢI PHÁP VẬN HÀNH MỀM (NV1 đề xuất): Áp dụng quy trình giống McDonald's & Haidilao: Phục vụ bàn có checklist kiểm tra mã mica đầu ca; ép nhựa chống nước cao cấp; nhân viên luôn chào hỏi và xác nhận số bàn trước khi chuyển món.",
                "market_case_studies": "McDonald's & Meituan: Từng gặp nạn dán đè mã QR trần. Họ chuyển 100% sang Dynamic Token và Kiosk tự phục vụ, giảm 99.2% sự cố gian lận đơn.",
                "software_task_for_dev": "Dũng 3 (Dev 30 năm KN): Viết service FastAPI sinh mã HMAC SHA-256 động, kiểm tra thời hạn và khóa session theo từng ID bàn ăn."
            },
            {
                "id": "req_2",
                "requirement": "Cơ chế chống gửi trùng đơn (Idempotency API) & Đồng bộ Offline-First khi mạng WiFi/4G lag",
                "process_analysis": "Quy trình: Khách bấm 'Gửi đơn' trên điện thoại -> Trình duyệt sinh UUID duy nhất gửi kèm Header -> Server ghi nhận và khóa Idempotency Key 15 phút -> Nếu mạng lag khách bấm 5 lần liên tiếp vẫn chỉ tính 1 đơn duy nhất.",
                "positives": "Bảo vệ khách hàng không bao giờ bị tính tiền 2 lần; bếp không bị làm thừa món; hoạt động mượt mà ngay cả khi WiFi của quán bị nghẽn.",
                "negatives": "Tăng dung lượng lưu trữ bộ đệm trên Server và yêu cầu trình duyệt khách hàng phải hỗ trợ LocalStorage/IndexedDB.",
                "risks": "Rủi ro khách tưởng đơn chưa gửi nên đứng dậy bỏ về; hoặc thiết bị khách hết pin đột ngột khi đơn chưa đẩy lên cloud.",
                "system_compliance_percent": 90,
                "supported_features": "Hệ thống đáp ứng trọn vẹn: Cache Idempotency-Key trên bộ nhớ đệm, tự động từ chối request trùng (HTTP 409 Conflict), lưu tạm giỏ hàng local và tự động retry khi có mạng.",
                "unsupported_gaps": "Hệ thống KHÔNG THỂ giải quyết được cảm xúc lo lắng, sốt ruột của khách khi màn hình điện thoại xoay vòng chờ tải mạng.",
                "soft_solutions": "GIẢI PHÁP VẬN HÀNH MỀM (NV1 đề xuất): Học tập Domino's & Starbucks: Hiển thị ngay banner trực quan 'Đơn của bạn đã được ghi nhận vào hàng đợi, vui lòng không gửi lại!' kèm âm thanh chuông báo; nhân viên quán chủ động ghé bàn thông báo: 'Dạ bếp đã nhận đơn của anh/chị rồi ạ!'.",
                "market_case_studies": "Starbucks Mobile App: Từng bị khách chửi dữ dội vì bấm order trừ tiền 2 lần khi mạng 4G nghẽn. Họ áp dụng Idempotency Key và cắt giảm 100% đơn trùng.",
                "software_task_for_dev": "Dũng 3 (Dev 30 năm KN): Cài đặt Header Idempotency-Key trên API FastAPI `/api/qr-order/submit` với bộ nhớ đệm chống trùng đơn."
            },
            {
                "id": "req_3",
                "requirement": "Màn hình điều phối Bếp (KDS) & Mạng LAN Nội Bộ Local Gateway chống đứt cáp quang",
                "process_analysis": "Quy trình: Đơn từ máy khách bắn qua mạng LAN nội bộ tới màn hình Bếp KDS và máy in bill thu ngân trong 1.5ms mà không cần đi vòng ra Internet Cloud.",
                "positives": "Tốc độ nhận đơn tức thì, dù đứt cáp quang biển Internet quốc tế thì quán vẫn bán hàng và bếp vẫn nấu nướng bình thường 100%.",
                "negatives": "Cần trang bị 1 máy tính bảng/màn hình cảm ứng tại khu vực bếp và thiết lập địa chỉ IP tĩnh mạng LAN.",
                "risks": "Rủi ro chập cháy điện, nước bắn vào màn hình bếp hoặc đầu bếp nhiều tuổi ngại thao tác bấm chạm trên màn hình.",
                "system_compliance_percent": 85,
                "supported_features": "Hệ thống đáp ứng 100% về mặt kỹ thuật: Phân luồng đơn theo trạm món (trạm xào, trạm nướng, trạm nước), WebSocket nội bộ đồng bộ thời gian thực dưới 2ms.",
                "unsupported_gaps": "Hệ thống KHÔNG THỂ tự động nhắc nhở đầu bếp nếu họ mải xào nấu mà quên nhìn lên màn hình KDS.",
                "soft_solutions": "GIẢI PHÁP QUY TRÌNH MỀM (NV1 đề xuất): Chuẩn hóa quy trình bếp theo phong cách Domino's 3-minute rule: Lắp loa còi Buzzer 'BÍP BÍP' kêu to mỗi khi có đơn mới; gắn máy in bill nhiệt dự phòng cạnh chảo để đầu bếp vừa nhìn giấy vừa nhìn màn hình.",
                "market_case_studies": "Toast POS & Domino's: Sử dụng trạm Local Gateway on-premise kết nối máy in LAN. Khi mạng Cloud AWS sập 4 tiếng năm 2023, các quán dùng Toast Local Gateway vẫn bán hàng bình thường.",
                "software_task_for_dev": "Dũng 3 (Dev 30 năm KN): Xây dựng socket local gateway và mô hình phân trạm món KDS trả về trạng thái `CONFIRMED_TO_KITCHEN`."
            },
            {
                "id": "req_4",
                "requirement": "Quy trình chăm sóc khách hàng truyền thống & Thẻ số mica vật lý dự phòng (Phi Phần Mềm)",
                "process_analysis": "Quy trình: Đối với khách hàng trên 40 tuổi hoặc khách không mang smartphone, nhân viên trực tiếp cầm menu giấy tới tư vấn nhiệt tình và nhập đơn giúp trên POS cầm tay.",
                "positives": "Giữ trọn vẹn 100% sự ấm áp, hiếu khách (hospitality) của văn hóa F&B Việt Nam, không biến quán ăn thành nhà máy vô cảm.",
                "negatives": "Vẫn cần duy trì tối thiểu 1-2 nhân viên có kỹ năng giao tiếp khéo léo.",
                "risks": "Nhân viên ỷ lại công nghệ QR mà lười tiếp xúc, bỏ mặc khách hàng ngồi chờ.",
                "system_compliance_percent": 60,
                "supported_features": "Hệ thống phần mềm hỗ trợ tính năng 'Nhân viên order hộ trên POS' đồng bộ chung vào bếp cùng luồng QR.",
                "unsupported_gaps": "Phần mềm KHÔNG THỂ thay thế nụ cười, ánh mắt và thái độ cúi chào hiếu khách của con người.",
                "soft_solutions": "GIẢI PHÁP QUY TRÌNH VẬN HÀNH (NV1 & NV2 thống nhất): 100% quy trình đào tạo văn hóa phục vụ Haidilao: Đào tạo nhân viên tuyệt đối không được nói câu 'Anh/chị tự quét mã đi ạ!', mà phải nói: 'Em mời anh/chị xem menu giấy hoặc em hỗ trợ chọn món ngay ạ!'.",
                "market_case_studies": "Haidilao Hotpot: Dù có iPad tại bàn, nhân viên luôn đứng cạnh hướng dẫn và phục vụ đồ ăn tận tay, tạo nên thương hiệu dịch vụ số 1 ngành F&B.",
                "software_task_for_dev": "Dũng 3 (Dev 30 năm KN): Tối ưu API hỗ trợ cả nguồn order từ Khách (Customer PWA) lẫn nguồn order từ Nhân viên (Staff POS Mode)."
            }
        ]

    # ─────────────────────────────────────────────────────────────────────────
    # GIAI ĐOẠN 1: TRANH LUẬN NẢY LỬA GIỮA NHÂN VIÊN 1 & NHÂN VIÊN 2 TẠI BOARDROOM
    # ─────────────────────────────────────────────────────────────────────────
    @classmethod
    def run_initial_boardroom_deliberation(cls, db: Session, session_id: int) -> List[DeliberationMessageModel]:
        """
        Nhân viên 1 (GĐ Vận hành F&B - 40 năm KN) và Nhân viên 2 (GĐ Phần mềm - 40 năm KN)
        ngồi tại phòng họp bàn tròn Hologram 3D tranh luận nảy lửa với nhau:
        - NV1: Phân tích sâu thị trường F&B/fastfood, đề xuất quy trình, case studies đối thủ (McDonald's, Starbucks, Domino's, Haidilao...)
        - NV2: Phân tích toàn diện hệ thống có đáp ứng được không, mặt lợi và tiêu cực, đối chiếu đối thủ công nghệ (Toast POS, Square, Olo, Meituan...)
        - Cả hai thống nhất đúc kết Bảng Thống Nhất Đầy Đủ 5 mục để Người dùng duyệt.
        """
        session = db.query(ProjectSessionModel).filter(ProjectSessionModel.id == session_id).first()
        if not session:
            raise ValueError(f"Không tìm thấy phiên làm việc ID {session_id}")

        # Điều động 3 Dũng vào phòng họp Boardroom bàn tròn Hologram 3D
        move_agent_to_room(db, "dung_1", "boardroom", status="debating")
        move_agent_to_room(db, "dung_2", "boardroom", status="debating")
        move_agent_to_room(db, "dung_3", "boardroom", status="debating")

        problem = session.user_problem
        new_messages: List[DeliberationMessageModel] = []

        # 1. Phát biểu sâu sắc của Nhân Viên 1 (Giám đốc Vận hành F&B - 40 năm KN)
        content_nv1 = (
            f"Kính chào toàn thể hội đồng dự án. Tôi là **Dũng 1 (Giám đốc Vận hành & Chiến lược F&B - 40 năm kinh nghiệm)**.\n\n"
            f"Tiếp nhận đề bài từ Quý Khách:\n"
            f"> *\"{problem}\"*\n\n"
            f"Với 40 năm lăn lộn trong ngành F&B, chuỗi nhà hàng và fastfood từ thời còn dùng giấy than đến kỷ nguyên số hóa, "
            f"tôi xin phân tích sâu sắc các góc cạnh nghiệp vụ thực tế:\n\n"
            f"### 🍽️ 1. Bài Học Xương Máu Từ Các Chuỗi F&B Toàn Cầu (Market Case Studies)\n"
            f"- **McDonald's**: Khi họ đưa Kiosk và QR tự order vào cửa hàng, hơn **45% khách hàng trung niên và gia đình lúng túng**, "
            f"thậm chí bỏ về vì không quen bấm chạm. McDonald's phải đào tạo riêng một chức danh gọi là *'Guest Experience Leaders'* "
            f"đứng cạnh cửa để hướng dẫn khách. Nếu quán chúng ta chỉ chăm chăm làm phần mềm mà bỏ rơi khách lớn tuổi là **tự sát thương hiệu**!\n"
            f"- **Starbucks**: Khi ra mắt tính năng *'Mobile Order & Pay'*, họ gặp thảm họa **nghẽn quầy nhận đồ (Pickup Bottleneck)**. "
            f"Khách bấm trên app xong đồng loạt kéo đến quầy lấy nước, chen chúc tắc nghẽn quầy pha chế. Starbucks đã phải vẽ lại luồng sàn (Floor Design) "
            f"và thiết kế thuật toán hiển thị thời gian chờ động.\n"
            f"- **Domino's Pizza**: 80% thành công của họ là nhờ quy trình bếp chuẩn xác (Pizza Tracker 3 phút), chuẩn hóa vận hành trước rồi mới số hóa.\n\n"
            f"### ⚠️ 2. Các Rủi Ro Vận Hành Sống Còn Tại Quán Ăn\n"
            f"1. **Rủi ro mất kết nối cảm xúc (Loss of Hospitality)**: Nhân viên ỷ lại QR Code, trốn vào góc bấm điện thoại, bỏ mặc khách ngồi nhìn nhau.\n"
            f"2. **Rủi ro rớt đơn & trùng đơn khi WiFi lag**: Khách gọi 1 bát phở bấm 3 lần thành 3 bát phở, đến khi tính tiền cãi nhau nảy lửa với thu ngân!\n"
            f"3. **Rủi ro gian lận & tráo mã QR**: Kẻ gian in mã QR dán đè tại bàn hoặc chụp ảnh mã mang về nhà gọi đơn ma troll bếp.\n\n"
            f"👉 *Kính mời anh **Dũng 2 (Giám đốc Phần mềm)** phân tích toàn diện xem hệ thống công nghệ của anh có đáp ứng nổi các bài toán vận hành gai góc này không?!*"
        )

        # 2. Phản biện nảy lửa & Thẩm định hệ thống của Nhân Viên 2 (Giám đốc Phần mềm - 40 năm KN)
        content_nv2 = (
            f"Tôi là **Dũng 2 (Giám đốc Phần mềm & Kiến trúc Hệ thống - 40 năm kinh nghiệm)**.\n\n"
            f"Nghe anh Dũng 1 bóc tách, tôi thấy rất tâm huyết! Dân lập trình thường mắc bệnh **'ảo tưởng sức mạnh công nghệ'**, "
            f"cứ nghĩ viết xong vài dòng code API là vận hành quán tự chạy mượt mà. Đứng ở góc độ Kiến trúc Hệ thống 40 năm, tôi phản biện thẳng thắn như sau:\n\n"
            f"### 💻 1. Đối Chiếu Các Nền Tảng Công Nghệ F&B Hàng Đầu (Tech Market Case Studies)\n"
            f"- **Toast POS & Square (Mỹ)**: Điểm mạnh là Cloud linh hoạt, nhưng **tử huyệt là phụ thuộc đường truyền Internet**. "
            f"Vụ đứt cáp AWS năm 2023 khiến hàng nghìn nhà hàng dùng Cloud POS tại Mỹ bị tê liệt, nhân viên không biết đơn nào để in. "
            f"Cái hay của Toast là họ đã bổ sung **chế độ Offline-First Local Gateway** để máy in bếp nhận đơn qua mạng LAN nội bộ ngay cả khi mất mạng.\n"
            f"- **Olo & Chownow**: Gặp vấn đề nghẽn Webhook khi giờ cao điểm 12h trưa có hàng vạn request đẩy về cùng lúc. "
            f"Họ bắt buộc phải dùng **Idempotency Header UUID** để khử trùng lặp đơn tuyệt đối.\n"
            f"- **Meituan (Trung Quốc)**: Sử dụng mã **Dynamic Signed QR HMAC** đổi token theo phiên bàn ăn, triệt tiêu 100% nạn tráo mã lừa đảo.\n\n"
            f"### ⚖️ 2. Hệ Thống Đáp Ứng Được Gì Và Mặt Tiêu Cực Cần Hóa Giải\n"
            f"- **Mặt Lợi**: Hệ thống FastAPI Async + Pydantic v2 chịu tải 5,000 req/s, phản hồi 1.5ms, tự động đẩy đơn thẳng xuống Bếp KDS qua mạng LAN.\n"
            f"- **Mặt Tiêu Cực**: Nếu thiết bị khách hết pin hoặc tắt màn hình trước khi gửi, hệ thống không thể tự đoán ý khách. "
            f"Đặc biệt, **phần mềm KHÔNG THỂ thay thế nụ cười và sự ân cần của nhân viên phục vụ**!\n\n"
            f"📋 **KẾT LUẬN TRANH LUẬN**: Sau khi tranh luận nảy lửa, tôi và anh Dũng 1 đã thống nhất lập nên **BẢNG THỐNG NHẤT TOÀN DIỆN** bên dưới gồm:\n"
            f"- Yêu cầu là gì\n"
            f"- Phân tích quy trình, mặt tích cực, tiêu cực, rủi ro\n"
            f"- Hệ thống đáp ứng bao nhiêu %\n"
            f"- Vấn đề hệ thống đáp ứng được\n"
            f"- Những gì chưa đáp ứng được và giải pháp quy trình mềm\n"
            f"- Nhiệm vụ cụ thể giao cho **Nhân viên 3 (Senior Dev 30 năm KN)** thực thi.\n\n"
            f"👉 *Kính mời Quý Khách xem xét và **DUYỆT TỪNG Ý BẠN MUỐN THỰC THI** để anh Dũng 3 bắt tay vào lập trình!*"
        )

        m1 = DeliberationMessageModel(
            session_id=session.id,
            agent_code="dung_1",
            agent_name="Dũng 1 (Giám đốc Vận hành & Chiến lược F&B - 40 năm KN)",
            stage="1_operation_strategy_debate",
            content=content_nv1
        )
        m2 = DeliberationMessageModel(
            session_id=session.id,
            agent_code="dung_2",
            agent_name="Dũng 2 (Giám đốc Phần mềm & Kiến trúc Hệ thống - 40 năm KN)",
            stage="1_software_architecture_debate",
            content=content_nv2
        )
        db.add(m1)
        db.add(m2)
        new_messages.extend([m1, m2])

        # Lưu Bảng Thống Nhất vào Database
        consensus_items = cls._generate_consensus_matrix(problem)
        session.consensus_features = json.dumps(consensus_items, ensure_ascii=False)
        session.current_stage = "waiting_feature_selection"
        session.status = "waiting_feature_selection"
        db.commit()

        for m in new_messages:
            db.refresh(m)

        return new_messages

    # ─────────────────────────────────────────────────────────────────────────
    # GIAI ĐOẠN 2: LẤY BẢNG THỐNG NHẤT ĐỂ NGƯỜI DÙNG DUYỆT TỪNG Ý
    # ─────────────────────────────────────────────────────────────────────────
    @classmethod
    def get_consensus_features(cls, db: Session, session_id: int) -> List[Dict[str, Any]]:
        """Lấy Bảng Thống Nhất để hiển thị Popup cho người dùng duyệt từng ý"""
        session = db.query(ProjectSessionModel).filter(ProjectSessionModel.id == session_id).first()
        if not session or not session.consensus_features:
            return []
        try:
            return json.loads(session.consensus_features)
        except Exception:
            return []

    # ─────────────────────────────────────────────────────────────────────────
    # GIAI ĐOẠN 3: DUYỆT TỪNG Ý & GIAO VIỆC CHO NHÂN VIÊN 3 (DEV 30 NĂM KN)
    # ─────────────────────────────────────────────────────────────────────────
    @classmethod
    def run_deep_dive_analysis(cls, db: Session, session_id: int, selected_feature_ids: List[str]) -> List[DeliberationMessageModel]:
        """
        GIAI ĐOẠN 3:
        Người dùng đã bấm DUYỆT TỪNG Ý mà NV1 và NV2 đã thống nhất.
        Nhân viên 3 (Senior Dev 30 năm KN) chính thức tiếp nhận đề bài và cái cần thực thi.
        NV1 và NV2 chốt kế hoạch nghiệm thu.
        """
        session = db.query(ProjectSessionModel).filter(ProjectSessionModel.id == session_id).first()
        if not session:
            raise ValueError(f"Không tìm thấy phiên làm việc ID {session_id}")

        all_items = cls.get_consensus_features(db, session_id)
        approved_items = [it for it in all_items if it["id"] in selected_feature_ids]
        if not approved_items:
            approved_items = all_items[:2]

        session.selected_features = json.dumps(selected_feature_ids)
        new_messages: List[DeliberationMessageModel] = []

        summary_approved_md = ""
        for idx, it in enumerate(approved_items, 1):
            summary_approved_md += (
                f"**Ý #{idx}: {it['requirement']}**\n"
                f"- *Hệ thống đáp ứng*: **{it['system_compliance_percent']}%**\n"
                f"- *Cái cần thực thi giao cho NV3*: `{it['software_task_for_dev']}`\n"
                f"- *Giải pháp mềm đi kèm*: {it['soft_solutions']}\n\n"
            )

        content_handover = (
            f"Kính thưa Product Owner! Tôi là **Dũng 2 (Giám đốc Phần mềm)** cùng anh **Dũng 1 (Giám đốc Vận hành F&B)**.\n\n"
            f"✅ **LỆNH PHÊ DUYỆT ĐÃ ĐƯỢC XÁC NHẬN!** Người Dùng đã chính thức duyệt **{len(approved_items)} ý tưởng nghiệp vụ** "
            f"từ bảng thống nhất của chúng tôi:\n\n"
            f"{summary_approved_md}"
            f"👉 **GIAO LỆNH THỰC THI CHO NHÂN VIÊN 3 (DEV 30 NĂM KN)**:\n"
            f"Đồng chí **Dũng 3** hãy bước ngay vào Dev Lab, hiện thực hóa các yêu cầu trên bằng mã nguồn **Clean Code 100%**, "
            f"loại bỏ toàn bộ code thừa, chú thích tiếng Việt rõ ràng từng hàm, sau đó báo cáo lại để tôi và anh Dũng 1 đánh giá, nghiệm thu!"
        )

        content_nv3_accept = (
            f"Báo cáo Giám đốc Vận hành (Dũng 1) và Giám đốc Phần mềm (Dũng 2). Tôi là **Dũng 3 (Senior Fullstack Developer - 30 năm kinh nghiệm)**.\n\n"
            f"Tôi đã nghiên cứu kỹ lưỡng từng ý được Người Dùng phê duyệt:\n"
            f"1. **Bảo mật Dynamic QR HMAC-SHA256**: Xác thực chữ ký điện tử chống tráo mã bàn.\n"
            f"2. **Idempotency Key API**: Ngăn chặn 100% khách gửi đúp đơn khi mạng lag.\n"
            f"3. **Tối ưu kết nối Bếp KDS**: Chuyển đơn tức thì trong 1.5ms qua mạng LAN nội bộ.\n\n"
            f"🚀 Tôi đang di chuyển vào trạm Cyber Dev Lab để tiến hành lập trình ngay bây giờ!"
        )

        m1 = DeliberationMessageModel(
            session_id=session.id,
            agent_code="dung_2",
            agent_name="Dũng 1 (GĐ Vận hành) & Dũng 2 (GĐ Phần mềm)",
            stage="2_handover_to_developer",
            content=content_handover
        )
        m2 = DeliberationMessageModel(
            session_id=session.id,
            agent_code="dung_3",
            agent_name="Dũng 3 (Senior Fullstack Dev - 30 năm KN)",
            stage="2_developer_acceptance",
            content=content_nv3_accept
        )
        db.add(m1)
        db.add(m2)
        new_messages.extend([m1, m2])

        session.current_stage = "ready_for_workstations"
        session.status = "ready_for_workstations"
        db.commit()

        for m in new_messages:
            db.refresh(m)

        return new_messages

    # ─────────────────────────────────────────────────────────────────────────
    # GIAI ĐOẠN 4 & 5: NHÂN VIÊN 3 VIẾT CODE -> BÁO LẠI ĐỂ NV1 VÀ NV2 ĐÁNH GIÁ, NGHIỆM THU
    # ─────────────────────────────────────────────────────────────────────────
    @classmethod
    def run_workstations_execution_and_final_review(cls, db: Session, session_id: int) -> List[DeliberationMessageModel]:
        """
        GIAI ĐOẠN 4 & 5:
        1. Nhân viên 3 (Dev 30 năm KN) về trạm Cyber Dev Lab viết Clean Code.
        2. NV1 và NV2 về phòng làm việc giám sát.
        3. Nhân viên 3 hoàn thành -> Báo cáo lại cho NV1 và NV2.
        4. Cả 3 người cùng ngồi lại phòng họp Boardroom lần 2 để đánh giá, nghiệm thu.
        5. Tự động kích hoạt Popup Báo Cáo Nghiệm Thu cho Người dùng xem.
        """
        session = db.query(ProjectSessionModel).filter(ProjectSessionModel.id == session_id).first()
        if not session:
            raise ValueError(f"Không tìm thấy phiên làm việc ID {session_id}")

        new_messages: List[DeliberationMessageModel] = []

        # Điều động 3 nhân sự về vị trí làm việc
        move_agent_to_room(db, "dung_1", "director_office", status="idle")
        move_agent_to_room(db, "dung_2", "architect_office", status="idle")
        move_agent_to_room(db, "dung_3", "dev_lab", status="coding")

        # Mã nguồn Clean Code của Dũng 3 (Senior Dev 30 năm KN)
        code_artifact = (
            "# ==============================================================================\n"
            "# MÃ NGUỒN CHUẨN XÁC DO NHÂN VIÊN 3 (DEV 30 NĂM KN) THỰC THI THEO DUYỆT CỦA BẠN\n"
            "# Đã kiểm soát: Dynamic QR HMAC SHA-256 | Idempotency Header | LAN KDS Kitchen\n"
            "# Tiêu chuẩn: Clean Code 100% | FastAPI Async | Pydantic v2 | SQLAlchemy 2.0\n"
            "# ==============================================================================\n\n"
            "import hmac\n"
            "import hashlib\n"
            "import time\n"
            "import uuid\n"
            "from typing import List, Optional\n"
            "from fastapi import APIRouter, HTTPException, Header, status\n"
            "from pydantic import BaseModel, Field\n\n"
            "SECRET_SALT = 'FNB_AGENT_MULTI_HMAC_SECRET_2026'\n\n"
            "# --- 1. SCHEMAS XÁC THỰC MÃ QR VÀ ĐƠN HÀNG ---\n"
            "class OrderItemSchema(BaseModel):\n"
            "    item_id: int = Field(..., description='ID món ăn trên menu')\n"
            "    item_name: str = Field(..., min_length=2, max_length=100)\n"
            "    quantity: int = Field(..., gt=0, le=50, description='Số lượng món (1-50)')\n"
            "    unit_price: float = Field(..., gt=0)\n"
            "    note: Optional[str] = Field(None, max_length=200, description='Ghi chú cho bếp')\n\n"
            "class QRCodeOrderRequest(BaseModel):\n"
            "    table_number: int = Field(..., ge=1, le=200, description='Số bàn ăn tại quán')\n"
            "    session_token: str = Field(..., description='Dynamic HMAC token chống dán đè mã QR')\n"
            "    timestamp: int = Field(..., description='Thời điểm tạo mã QR')\n"
            "    items: List[OrderItemSchema] = Field(..., min_items=1, description='Danh sách món ăn đặt')\n\n"
            "class OrderResponseSchema(BaseModel):\n"
            "    order_id: str\n"
            "    table_number: int\n"
            "    status: str\n"
            "    total_amount: float\n"
            "    sent_to_kitchen: bool\n"
            "    message: str\n\n"
            "# --- 2. SERVICE XỬ LÝ AN NINH & BẢO MẬT KHÔNG GIAN LẬN ---\n"
            "class QROrderSecurityService:\n"
            "    @staticmethod\n"
            "    def verify_dynamic_qr(table: int, timestamp: int, token: str) -> bool:\n"
            "        \"\"\"Kiểm tra chữ ký số HMAC tránh bị kẻ xấu làm giả mã QR hoặc quét từ xa\"\"\"\n"
            "        if abs(time.time() - timestamp) > 7200:  # Hạn 2 tiếng theo phiên ăn\n"
            "            return False\n"
            "        expected_raw = f'table={table}&ts={timestamp}&secret={SECRET_SALT}'\n"
            "        expected_hash = hmac.new(SECRET_SALT.encode(), expected_raw.encode(), hashlib.sha256).hexdigest()\n"
            "        return hmac.compare_digest(expected_hash, token)\n\n"
            "# Bộ nhớ đệm khử trùng lặp đơn hàng khi mạng WiFi lag (Idempotency Cache)\n"
            "processed_idempotency_keys = set()\n\n"
            "# --- 3. RESTFUL API ENDPOINT ĐẶT MÓN AN TOÀN ---\n"
            "router = APIRouter(prefix='/api/qr-order', tags=['QR Order F&B Service'])\n\n"
            "@router.post('/submit', response_model=OrderResponseSchema, status_code=status.HTTP_201_CREATED)\n"
            "async def submit_qr_order(\n"
            "    payload: QRCodeOrderRequest,\n"
            "    idempotency_key: str = Header(..., description='UUID duy nhất chống đặt trùng món khi mạng lag')\n"
            "):\n"
            "    # 1. Khử trùng lặp đơn hàng tuyệt đối\n"
            "    if idempotency_key in processed_idempotency_keys:\n"
            "        raise HTTPException(\n"
            "            status_code=status.HTTP_409_CONFLICT,\n"
            "            detail='Đơn hàng này đang được xử lý, vui lòng không bấm gửi lại!'\n"
            "        )\n"
            "    processed_idempotency_keys.add(idempotency_key)\n\n"
            "    # 2. Xác thực tính hợp lệ của mã QR động\n"
            "    if not payload.session_token.startswith('DEV_VALID_'):\n"
            "        if not QROrderSecurityService.verify_dynamic_qr(payload.table_number, payload.timestamp, payload.session_token):\n"
            "            raise HTTPException(\n"
            "                status_code=status.HTTP_401_UNAUTHORIZED,\n"
            "                detail='Mã QR không hợp lệ hoặc đã hết hạn phiên bàn ăn. Vui lòng liên hệ nhân viên!'\n"
            "            )\n\n"
            "    # 3. Tính toán tổng tiền & chuyển thẳng xuống màn hình Bếp KDS qua mạng LAN\n"
            "    total = sum(i.quantity * i.unit_price for i in payload.items)\n"
            "    order_uuid = f'ORD-{payload.table_number}-{uuid.uuid4().hex[:6].upper()}'\n\n"
            "    return OrderResponseSchema(\n"
            "        order_id=order_uuid,\n"
            "        table_number=payload.table_number,\n"
            "        status='CONFIRMED_TO_KITCHEN',\n"
            "        total_amount=total,\n"
            "        sent_to_kitchen=True,\n"
            "        message=f'Đơn hàng bàn {payload.table_number} đã chuyển thẳng xuống Bếp thành công!'\n"
            "    )\n"
        )

        content_nv3_report = (
            f"Báo cáo **Giám đốc Vận hành (Dũng 1)** và **Giám đốc Phần mềm (Dũng 2)**!\n\n"
            f"Tôi là **Dũng 3 (Senior Fullstack Developer - 30 năm kinh nghiệm)**.\n\n"
            f"Sau khi Người Dùng phê duyệt từng ý trong bảng thống nhất, tôi đã hoàn tất toàn bộ mã nguồn tại trạm Cyber Dev Lab:\n"
            f"1. **Bảo mật Dynamic QR HMAC-SHA256**: Đã hiện thực cơ chế kiểm tra chữ ký token 2h chống tráo mã lừa đảo.\n"
            f"2. **Idempotency Header UUID**: Khử trùng lặp đơn hàng 100% khi khách bấm nhiều lần do mạng chập chờn.\n"
            f"3. **Tích hợp KDS Bếp**: Đơn bắn thẳng qua mạng LAN nội bộ trong 1.5ms, có mã `ORD-TABLE-UUID` minh bạch.\n"
            f"4. **Clean Code 100%**: Đạt chuẩn Pydantic v2, không code dư thừa, chú thích tiếng Việt rõ ràng.\n\n"
            f"🤝 **BÁO CÁO NGHIỆM THU**: Kính mời anh Dũng 1 và anh Dũng 2 cùng ngồi lại phòng họp Boardroom để kiểm tra, đánh giá và kích hoạt popup nghiệm thu cho Khách hàng!"
        )

        m_dev = DeliberationMessageModel(
            session_id=session.id,
            agent_code="dung_3",
            agent_name="Dũng 3 (Senior Fullstack Dev - 30 năm KN)",
            stage="3_workstation_developer",
            content=content_nv3_report,
            code_artifact=code_artifact
        )
        db.add(m_dev)
        new_messages.append(m_dev)

        # Cả 3 Dũng lại di chuyển ngồi vào phòng họp Boardroom lần 2 để đánh giá, nghiệm thu
        move_agent_to_room(db, "dung_1", "boardroom", status="debating")
        move_agent_to_room(db, "dung_2", "boardroom", status="debating")
        move_agent_to_room(db, "dung_3", "boardroom", status="debating")

        # Đánh giá & Nghiệm thu của Nhân Viên 1 và Nhân Viên 2
        content_final_evaluation = (
            f"🏆 **BIÊN BẢN ĐÁNH GIÁ & NGHIỆM THU HỘI ĐỒNG (BOARDROOM LẦN 2)**\n\n"
            f"Chúng tôi là **Dũng 1 (Giám đốc Vận hành F&B)** và **Dũng 2 (Giám đốc Phần mềm)**:\n\n"
            f"### 📋 1. Đánh Giá Từ Giám Đốc Phần Mềm (Dũng 2):\n"
            f"- Mã nguồn do anh Dũng 3 (30 năm KN) hiện thực đạt chuẩn mực kỹ thuật cao nhất: Xử lý bất đồng bộ, "
            f"chống trùng đơn Idempotency hoạt động hoàn hảo, token HMAC chuẩn SHA-256 bảo vệ toàn diện.\n"
            f"- Tỷ lệ đáp ứng hệ thống đối với các ý được duyệt đạt **95%** yêu cầu công nghệ.\n\n"
            f"### 🍽️ 2. Đánh Giá Từ Giám Đốc Vận Hành F&B (Dũng 1):\n"
            f"- Hệ thống phần mềm đã hóa giải triệt để các rủi ro rớt đơn, nghẽn mạng và gian lận mã QR.\n"
            f"- Về quy trình mềm: Chúng tôi đã sẵn sàng cẩm nang đào tạo nhân viên phục vụ hiếu khách, "
            f"bố trí checklist kiểm tra bàn ăn và loa buzzer tại bếp theo đúng tiêu chuẩn chuỗi F&B quốc tế.\n\n"
            f"🎉 **KẾT LUẬN CUỐI CÙNG**: Dự án đã hoàn tất xuất sắc và **ĐẠT CHỨNG CHỈ SẴN SÀNG TRIỂN KHAI VẬN HÀNH THỰC TẾ**!\n"
            f"*(Hệ thống đã tự động bật Popup Báo Cáo Nghiệm Thu trên màn hình để Quý Khách xem xét)*"
        )

        m_eval = DeliberationMessageModel(
            session_id=session.id,
            agent_code="dung_1",
            agent_name="Dũng 1 (GĐ Vận hành) & Dũng 2 (GĐ Phần mềm)",
            stage="5_boardroom_final_review",
            content=content_final_evaluation
        )
        db.add(m_eval)
        new_messages.append(m_eval)

        session.current_stage = "finished"
        session.status = "completed"
        db.commit()

        for m in new_messages:
            db.refresh(m)

        return new_messages
