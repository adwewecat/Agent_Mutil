/**
 * Bộ dựng đồ họa Pixel Art 2.5D Isometric chuẩn phong cách The Pixel Office & Agent-Pixels
 * Tối ưu hóa không gian văn phòng thống nhất, không chồng chéo vật trang trí, Z-Depth sorting hoàn hảo
 */

import { Agent } from '../types';
import { ImageLoader } from './imageLoader';

// Interface cho các thực thể có thể vẽ và sắp xếp theo trục Z (chiều sâu Y)
export interface ZDrawable {
  zY: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export class SpriteRenderer {
  /**
   * 1. Dựng nền tổng thể và kiến trúc văn phòng (Sàn nhà, Tường 3D, Cửa sổ kính, Vách ngăn phòng)
   */
  public static drawOfficeStructure(ctx: CanvasRenderingContext2D, width: number, height: number, frame: number = 0) {
    // TỰ DESIGN KIẾN TRÚC VĂN PHÒNG A.I CYBERPUNK 16:9 (1376x768) DO HỆ THỐNG QUẢN LÝ 100%
    this.drawCustomCyberAIOfficeStructure(ctx, width, height, frame);
  }

  /**
   * Hệ thống đèn trần hình nón công nghiệp phong cách Fallout Shelter Vault
   */
  public static drawVaultIndustrialLighting(ctx: CanvasRenderingContext2D) {
    const lights = [
      { x: 135, y: 315, floorY: 425, color: 'rgba(56, 189, 248, 0.08)', radius: 75 }, // Dev Lab (Cyan Matrix)
      { x: 490, y: 315, floorY: 430, color: 'rgba(254, 240, 138, 0.10)', radius: 100 }, // Boardroom (Warm Golden)
      { x: 800, y: 315, floorY: 430, color: 'rgba(168, 85, 247, 0.08)', radius: 85 },  // Games Room (Arcade Purple)
      { x: 135, y: 80,  floorY: 185, color: 'rgba(56, 189, 248, 0.08)', radius: 75 },  // Architect Office (Drafting Lamp)
      { x: 470, y: 80,  floorY: 175, color: 'rgba(251, 191, 36, 0.09)', radius: 90 },  // Director Office (Luxury Amber)
    ];

    lights.forEach(light => {
      // Dây cáp treo đen
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(light.x - 1, light.y - 25, 2, 25);

      // Chao đèn kim loại công nghiệp (Industrial Metal Lamp Shade)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(light.x - 10, light.y);
      ctx.lineTo(light.x + 10, light.y);
      ctx.lineTo(light.x + 5, light.y - 7);
      ctx.lineTo(light.x - 5, light.y - 7);
      ctx.closePath();
      ctx.fill();

      // Bóng đèn phát sáng
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(light.x, light.y + 1, 3, 0, Math.PI * 2);
      ctx.fill();

      // Luồng sáng hình nón chiếu rọi xuống sàn (Conical Spotlight Beam)
      const grad = ctx.createLinearGradient(light.x, light.y, light.x, light.floorY);
      grad.addColorStop(0, light.color);
      grad.addColorStop(0.7, light.color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(light.x - 5, light.y + 3);
      ctx.lineTo(light.x + 5, light.y + 3);
      ctx.lineTo(light.x + light.radius, light.floorY);
      ctx.lineTo(light.x - light.radius, light.floorY);
      ctx.closePath();
      ctx.fill();
    });
  }

  /**
   * Khói bốc lên từ tách cà phê nóng (Coffee Steam Effect - Fallout Shelter style)
   */
  public static drawCoffeeSteam(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const time = Date.now() / 250;
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 2; i++) {
      const offsetX = Math.sin(time + i * 2) * 2;
      const offsetY = ((time * 4 + i * 8) % 14);
      ctx.beginPath();
      ctx.moveTo(x + i * 3, y - 1);
      ctx.quadraticCurveTo(x + i * 3 + offsetX, y - 5 - offsetY, x + i * 3, y - 10 - offsetY);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Vẽ hành lang gạch caro đen trắng (Checkerboard Hallway)
  /**
   * Sàn gạch văn phòng Isometric chuẩn hình thoi 2:1 phong cách Habbo / Retro Vector Pixel Art
   * Màu lam hoa cà / xanh tím nhạt xen kẽ chuẩn xác 100% hình ảnh tham khảo
   */
  public static drawIsometricOfficeTileFloor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    const tileW = 28; // Chiều rộng đường chéo ngang hình thoi
    const tileH = 14; // Chiều cao đường chéo dọc hình thoi (tỉ lệ 2:1 chuẩn Isometric)

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip(); // Giới hạn chính xác trong sàn văn phòng

    const startCol = -6;
    const endCol = Math.ceil(w / (tileW / 2)) + 6;
    const startRow = -6;
    const endRow = Math.ceil(h / tileH) + 6;

    for (let r = startRow; r < endRow; r++) {
      for (let c = startCol; c < endCol; c++) {
        const cx = x + c * (tileW / 2);
        const cy = y + r * tileH + (Math.abs(c) % 2 !== 0 ? tileH / 2 : 0);

        // Tông màu sàn gạch hiện đại sáng sạch cực kỳ dễ nhìn (Pin 817544138597868043)
        const isAlt = (Math.abs(c) + Math.abs(r)) % 2 === 0;
        ctx.fillStyle = isAlt ? '#ffffff' : '#f8fafc';

        ctx.beginPath();
        ctx.moveTo(cx, cy - tileH / 2);
        ctx.lineTo(cx + tileW / 2, cy);
        ctx.lineTo(cx, cy + tileH / 2);
        ctx.lineTo(cx - tileW / 2, cy);
        ctx.closePath();
        ctx.fill();

        // Đường chỉ ron gạch xám nhạt thanh thoát
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 0.65;
        ctx.stroke();

        // Điểm phản quang viền trên của gạch
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(cx - tileW / 2 + 1, cy);
        ctx.lineTo(cx, cy - tileH / 2 + 0.5);
        ctx.lineTo(cx + tileW / 2 - 1, cy);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  /**
   * Thảm sọc xanh ngọc bích phòng Giám đốc & Executive Lounge (Pinterest Pin B - Emerald Green Striped Rug)
   */
  public static drawEmeraldStripedRug(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.save();
    // Đổ bóng thảm xuống sàn gạch
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(x + 4, y + 4, w, h);

    // Nền thảm xanh
    ctx.fillStyle = '#15803d';
    ctx.fillRect(x, y, w, h);

    // Các sọc xanh lá sáng song song
    ctx.fillStyle = '#22c55e';
    for (let sx = x + 8; sx < x + w - 8; sx += 14) {
      ctx.fillRect(sx, y + 3, 7, h - 6);
    }
    // Viền thảm thêu
    ctx.strokeStyle = '#166534';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  }

  /**
   * Thảm xanh Navy hội nghị cao cấp (Executive Navy Carpet)
   */
  public static drawNavyConferenceRug(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(x + 4, y + 4, w, h);

    ctx.fillStyle = '#1e3a5f';
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);

    // Họa tiết dệt ô vuông thảm
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    const sz = 20;
    for (let px = x; px < x + w; px += sz) {
      ctx.beginPath();
      ctx.moveTo(px, y);
      ctx.lineTo(px, y + h);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Sàn gạch men trắng ceramic bóng bẩy khu bếp pantry
   */
  public static drawCeramicFloor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    const sz = 24;
    for (let px = x; px < x + w; px += sz) {
      ctx.beginPath();
      ctx.moveTo(px, y);
      ctx.lineTo(px, y + h);
      ctx.stroke();
    }
    for (let py = y; py < y + h; py += sz) {
      ctx.beginPath();
      ctx.moveTo(x, py);
      ctx.lineTo(x + w, py);
      ctx.stroke();
    }
  }


  /**
   * Vách ngăn lửng kính mờ 2.5D giữa các phòng chuẩn phong cách Office Cubicle (Pinterest Pin B)
   */
  public static drawRoomPartition(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.save();
    // 1. Khung vách ngăn lửng Cubicle màu xanh dương pastel thanh lịch (Pastel Blue Cubicle Partition - Pin 817544138597868043)
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);

    // Tấm vách kính mờ chạy viền trên
    ctx.fillStyle = 'rgba(191, 219, 254, 0.55)';
    ctx.fillRect(x + 1, y + 1, w - 2, 7);
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.6)';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(x + 1, y + 1, w - 2, 7);

    // Trụ góc kim loại sơn trắng nối góc vách ngăn
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x - 2, y - 2, 4, 12);
    ctx.fillRect(x + w - 2, y - 2, 4, 12);

    // 2. Poster đồ thị / biểu đồ kinh doanh đóng khung trắng trên vách (Pin 817544138597868043)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 18, y - 11, 16, 12);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(x + 18, y - 11, 16, 12);
    // Biểu đồ cột mini bên trong poster
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 20, y - 4, 2, 4);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(x + 23, y - 7, 2, 7);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x + 26, y - 5, 2, 5);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + 29, y - 8, 2, 8);

    // 3. Giấy ghi chú màu sắc dán trên vách kính (Vàng, Hồng, Xanh lá)
    ctx.fillStyle = '#fef08a'; // Vàng
    ctx.fillRect(x + 38, y - 6, 5, 5);
    ctx.fillStyle = '#f472b6'; // Hồng
    ctx.fillRect(x + 46, y - 6, 5, 5);
    ctx.fillStyle = '#86efac'; // Xanh lá
    ctx.fillRect(x + w - 26, y - 6, 5, 5);

    // 4. Cửa ra vào phòng rộng mở 48px với nẹp chỉ nhôm & thảm chuyển tiếp
    const doorW = 48;
    const doorX = x + w / 2 - doorW / 2;
    ctx.clearRect(doorX, y + h - 2, doorW, 4);
    ctx.fillStyle = '#e2e8f0'; // Nẹp ngưỡng cửa nhôm
    ctx.fillRect(doorX, y + h - 2, doorW, 3);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(doorX, y + h - 3, doorW, 1);
    ctx.restore();
  }

  /**
   * Biển LED tên phòng kiểu Pixel Art kiến trúc tinh tế, nhỏ gọn, tuyệt đối không che khuất đồ đạc hay người
   */
  public static drawRoomBadge(ctx: CanvasRenderingContext2D, roomId: string, x: number, y: number) {
    const titles: Record<string, { label: string; icon: string; color: string }> = {
      architect_office: { label: 'KIẾN TRÚC & PM (D2)', icon: '📐', color: '#a78bfa' },
      director_office: { label: 'GIÁM ĐỐC & VIP (D1)', icon: '👑', color: '#38bdf8' },
      kitchen_pantry: { label: 'HẬU CẦN & BỐT TARDIS', icon: '☕', color: '#38bdf8' },
      dev_lab: { label: 'DEV LAB WORKSTATION (D3)', icon: '💻', color: '#34d399' },
      boardroom: { label: 'THẢO LUẬN & MÁY IN', icon: '🖨️', color: '#60a5fa' },
      games_room: { label: 'QA & SECURITY LEAD (D4)', icon: '🛡️', color: '#f87171' },
    };

    const info = titles[roomId] || { label: 'VĂN PHÒNG', icon: '🏢', color: '#94a3b8' };
    const text = `${info.icon} ${info.label}`;
    const badgeW = text.length * 6.2 + 12;
    const badgeH = 14;

    ctx.save();
    // Khung biển nền kính mờ tối
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.beginPath();
    ctx.roundRect(x + 10, y + 4, badgeW, badgeH, 3);
    ctx.fill();

    // Viền phát sáng neon
    ctx.strokeStyle = info.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x + 10, y + 4, badgeW, badgeH, 3);
    ctx.stroke();

    // Text tên phòng thanh lịch
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 7.5px "JetBrains Mono", monospace';
    ctx.fillText(text, x + 15, y + 14);
    ctx.restore();
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 2. DANH MỤC NỘI THẤT CHUẨN XÁC, KHÔNG CHỒNG CHÉO (Z-SORTED FURNITURE)
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Tạo danh sách toàn bộ vật phẩm nội thất với toạ độ Z-Depth chuẩn xác
   * Đồng thời tự động quản lý trạng thái ghế trống khi nhân viên đang rời bàn
   */
  public static getFurnitureDrawables(agents: Agent[] = [], _frame: number = 0): ZDrawable[] {
    // VĂN PHÒNG CYBERPUNK HIGH-TECH 16:9 (1376x768) DO HỆ THỐNG TỰ QUẢN LÝ
    return this.getCustomCyberOfficeFurnitureDrawables(agents, _frame);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CÁC HÀM DỰNG NỘI THẤT CHI TIẾT PIXEL ART
  // ─────────────────────────────────────────────────────────────────────────



  /**
   * Bàn họp hội đồng lớn bằng gỗ óc chó (Executive Boat-Shaped Boardroom Suite)
   */
  public static drawConferenceTableSurface(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 210;
    const h = 76;

    ctx.save();
    // 1. Đổ bóng bàn họp xuống sàn
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.roundRect(x + 4, y + 6, w, h, 38);
    ctx.fill();

    // 2. Chân trụ kép bằng gỗ đậm bên dưới (Dual Pedestal Base)
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 45, y + 35, 24, 25);
    ctx.fillRect(x + w - 69, y + 35, 24, 25);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x + 43, y + 56, 28, 4);
    ctx.fillRect(x + w - 71, y + 56, 28, 4);

    // 3. Mặt bàn gỗ sồi mật ong bo tròn Oval hoàn hảo (Warm Honey Oak Oval Table - pin_meeting 591730838527550441)
    const tableGrad = ctx.createLinearGradient(x, y, x, y + h);
    tableGrad.addColorStop(0, '#f59e0b');
    tableGrad.addColorStop(0.35, '#d97706');
    tableGrad.addColorStop(1, '#b45309');

    ctx.fillStyle = tableGrad;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 38);
    ctx.fill();

    // Viền vát cạnh gỗ sồi cao cấp
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 38);
    ctx.stroke();

    // Vân gỗ phản quang nhẹ mặt bàn
    ctx.strokeStyle = 'rgba(254, 243, 199, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x + 4, y + 3, w - 8, h - 6, 35);
    ctx.stroke();

    // 4. Hộp quản lý cáp nhôm xước trung tâm (Center Cable Raceway)
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 60, y + 28, 90, 18);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 60, y + 28, 90, 18);
    ctx.fillStyle = '#22c55e'; // LED xanh nguồn
    ctx.fillRect(x + 70, y + 35, 4, 3);
    ctx.fillStyle = '#38bdf8'; // LED mạng
    ctx.fillRect(x + 80, y + 35, 4, 3);

    // 5. Laptops mỏng màu bạc mở màn hình sáng xanh dương cho các vị trí ngồi (pin_meeting 591730838527550441)
    const laptops = [
      { lx: x + 25, ly: y + 30, sc: '#0284c7' },     // Vị trí người thuyết trình D1
      { lx: x + 75, ly: y + 8, sc: '#0284c7' },      // Vị trí D2
      { lx: x + 130, ly: y + 8, sc: '#059669' },     // Vị trí D3
      { lx: x + 85, ly: y + 50, sc: '#dc2626' },     // Vị trí D4
    ];

    laptops.forEach(lp => {
      // Thân đế laptop bạc
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(lp.lx, lp.ly + 4, 18, 10);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(lp.lx, lp.ly + 4, 18, 10);

      // Màn hình mở dựng nghiêng phát sáng
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(lp.lx + 1, lp.ly - 7, 16, 11);
      ctx.fillStyle = lp.sc;
      ctx.fillRect(lp.lx + 2, lp.ly - 6, 14, 8);
      // Biểu đồ trên màn hình
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(lp.lx + 4, lp.ly - 4, 6, 1.5);
      ctx.fillRect(lp.lx + 4, lp.ly - 1, 9, 1.5);
    });

    // 6. Tài liệu cuộc họp trắng & Ly nước đá mát lạnh
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 105, y + 24, 12, 8);
    ctx.fillStyle = 'rgba(186, 230, 253, 0.7)';
    ctx.fillRect(x + 55, y + 12, 6, 8);
    ctx.fillRect(x + 160, y + 35, 6, 8);

    ctx.restore();
  }

  /**
   * Ghế xoay văn phòng công thái học bánh xe nỉ xanh Royal Blue (Pinterest Pin B - Ergonomic Rolling Office Chair)
   */
  public static drawOfficeSwivelChair(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    // 1. Chân sao 5 cánh có bánh xe xoay (5-Star Castor Wheel Base)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 9, y + 10, 18, 2);
    ctx.fillRect(x - 2, y + 8, 4, 4);
    // Bánh xe lăn
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 10, y + 11, 3, 3);
    ctx.fillRect(x + 7, y + 11, 3, 3);
    ctx.fillRect(x - 2, y + 12, 4, 2);

    // 2. Trục nâng thủy lực xi-lanh nhôm
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x - 1.5, y + 4, 3, 5);

    // 3. Đệm ngồi nỉ xanh Royal Blue êm ái (Plush Royal Blue Cushion)
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.roundRect(x - 10, y, 20, 8, 3);
    ctx.fill();
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(x - 8, y + 1, 16, 3);

    // 4. Tựa lưng ghế uốn cong công thái học (Ergonomic Backrest)
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.roundRect(x - 9, y - 12, 18, 12, 3);
    ctx.fill();
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(x - 7, y - 10, 14, 2);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 9, y - 12, 18, 12);

    ctx.restore();
  }

  /**
   * Ghế họp Cantilever Sled Chair chân quỳ mạ crom bọc nệm xám (pin_meeting 591730838527550441)
   */
  public static drawConferenceChair(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    // 1. Chân quỳ bằng ống thép uốn mạ crom (Sled Base)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 9, y + 14);
    ctx.lineTo(x + 9, y + 14);
    ctx.lineTo(x + 9, y + 6);
    ctx.lineTo(x + 7, y + 2);
    ctx.stroke();

    // 2. Đệm ngồi xám đậm êm ái
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.roundRect(x - 10, y + 1, 20, 7, 2);
    ctx.fill();

    // 3. Tựa lưng ghế bọc da xám sang trọng
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(x - 9, y - 13, 18, 14, 3);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 9, y - 13, 18, 14);

    ctx.restore();
  }

  /**
   * Bàn làm việc cubicle phụ chuẩn công sở 80 Elements (Pinterest Pin B - Secondary Cubicle Desk Spot)
   */
  public static drawSecondaryOfficeDesk(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 48;
    const h = 36;
    ctx.save();

    // 1. Vách ngăn kính mờ phân vùng Cubicle chuẩn phong cách Pinterest Pin B (ảnh tham khảo)
    ctx.fillStyle = 'rgba(186, 230, 253, 0.40)';
    ctx.fillRect(x - 4, y - 24, w + 10, 22);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 4, y - 24, w + 10, 22);
    // Trụ kim loại nối vách ngăn
    ctx.fillStyle = '#334155';
    ctx.fillRect(x - 5, y - 26, 3, 26);
    ctx.fillRect(x + w + 5, y - 26, 3, 26);

    // 3 Giấy nhớ Post-It màu vàng, xanh lá, hồng dán trên vách kính (y hệt tranh tham khảo)
    ctx.fillStyle = '#fef08a'; // Vàng
    ctx.fillRect(x + 2, y - 20, 6, 6);
    ctx.fillStyle = '#86efac'; // Xanh lá
    ctx.fillRect(x + 12, y - 18, 6, 6);
    ctx.fillStyle = '#f472b6'; // Hồng
    ctx.fillRect(x + 22, y - 21, 6, 6);

    // 2. Đổ bóng chân bàn xuống sàn
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(x + 2, y + 4, w, h);

    // Chân bàn thép sơn tĩnh điện
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 2, y + 6, 4, h);
    ctx.fillRect(x + w - 6, y + 6, 4, h);

    // Mặt bàn laminate trắng ngà chuẩn văn phòng
    const deskGrad = ctx.createLinearGradient(x, y, x, y + 14);
    deskGrad.addColorStop(0, '#f8fafc');
    deskGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = deskGrad;
    ctx.fillRect(x, y, w, 14);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, 14);

    // Màn hình CRT / LCD văn phòng viền xám bạc
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 14, y - 16, 20, 15);
    ctx.fillStyle = '#0284c7'; // Màn hình xanh
    ctx.fillRect(x + 15, y - 15, 18, 11);
    ctx.fillStyle = '#94a3b8'; // Chân đế
    ctx.fillRect(x + 21, y - 1, 6, 3);
    // Giấy nhớ vàng nhỏ góc màn hình
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x + 30, y - 17, 3, 3);

    // Bàn phím & chuột
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 12, y + 2, 16, 5);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 31, y + 3, 3, 4);

    // Điện thoại bàn văn phòng có tai nghe và dây xoắn (Office Desk Phone)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 36, y + 2, 8, 7);
    ctx.fillStyle = '#f8fafc'; // Phím số
    ctx.fillRect(x + 37, y + 4, 3, 4);
    ctx.fillStyle = '#ef4444'; // Đèn LED đỏ
    ctx.fillRect(x + 41, y + 3, 2, 2);

    // Khay tài liệu In/Out bên cạnh
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x + 3, y + 2, 7, 7);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 4, y + 3, 5, 2);

    // Chú mèo ngủ cuộn tròn trên bàn làm việc (như trong ảnh mẫu)
    this.drawSleepingCat(ctx, x + w - 4, y + 7);

    ctx.restore();
  }

  /**
   * Bàn làm việc Fullstack Dev chuẩn phong cách Cyberpunk & Tech Lab (Pinterest Pin 1 & Hardware Suite)
   */
  public static drawDevWorkstation(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 108;
    const h = 42;

    ctx.save();
    // Đổ bóng bàn xuống sàn
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(x + 4, y + 8, w, h);

    // Khung chân thép sơn tĩnh điện màu xám nòng súng (Heavy Gunmetal Frame)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 2, y + 6, 6, h);
    ctx.fillRect(x + w - 8, y + 6, 6, h);
    ctx.fillRect(x + 2, y + h - 4, w - 4, 4); // Thanh giằng chịu lực

    // Thùng máy PC Tower để bàn bên phải (High-End Full-Tower Case)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(x + w - 24, y + 16, 20, 26, 2);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();
    // 2 Ổ quang & khe DVD
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + w - 22, y + 18, 16, 4);
    ctx.fillRect(x + w - 22, y + 23, 16, 4);
    ctx.fillStyle = '#22c55e'; // LED ổ đĩa
    ctx.fillRect(x + w - 8, y + 25, 1.5, 1);
    // Cổng USB & Nút nguồn LED xanh
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + w - 21, y + 29, 2, 2);
    // Đèn HDD nhấp nháy đỏ
    if (Math.floor(Date.now() / 280) % 3 === 0) {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x + w - 17, y + 29, 2, 2);
    }
    // Lưới tản nhiệt tổ ong phía trước
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + w - 22, y + 33, 16, 7);

    // Mặt bàn làm việc laminate sáng màu chuẩn văn phòng hiện đại (Modern Off-White Office Desk Surface)
    const deskGrad = ctx.createLinearGradient(x, y, x, y + 16);
    deskGrad.addColorStop(0, '#f8fafc');
    deskGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = deskGrad;
    ctx.fillRect(x, y, w, 18);

    // Mép nẹp chỉ bàn nhựa ABS màu xám nhạt
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x + 2, y + 1, w - 4, 2);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, 18);

    // Hộc tủ 3 ngăn bên phải với tay nắm nhôm xước (3-Drawer Modern Pedestal)
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x + w - 32, y + 18, 10, h - 18);
    for (let d = 0; d < 3; d++) {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(x + w - 31, y + 20 + d * 7, 8, 6);
      ctx.fillStyle = '#64748b'; // Tay nắm nhôm
      ctx.fillRect(x + w - 28, y + 22 + d * 7, 3, 2);
    }

    // Khay đựng tài liệu In/Out 2 tầng trên mặt bàn (Document Tray - Pin B)
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x + 6, y + 2, 14, 10);
    ctx.fillStyle = '#ffffff'; // Giấy A4
    ctx.fillRect(x + 7, y + 4, 12, 3);
    ctx.fillRect(x + 7, y + 8, 12, 3);

    // Giá đỡ 2 màn hình bằng thép đen gắn bàn (Dual Articulated Monitor Mount)
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 50, y - 5, 8, 12);
    ctx.fillRect(x + 28, y - 8, 52, 3);

    // Dây cáp bọc lưới đen từ màn hình nối vào bàn (Cable Management)
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 48, y - 4);
    ctx.bezierCurveTo(x + 51, y + 3, x + 49, y + 8, x + 54, y + 15);
    ctx.stroke();

    // Màn hình 1 (Chính 32" Curved) - Terminal code ma trận xanh lá & con trỏ nhấp nháy
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect(x + 12, y - 26, 42, 28, 2);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Màn hình Obsidian Terminal
    ctx.fillStyle = '#05190f';
    ctx.fillRect(x + 14, y - 24, 38, 24);

    // Dòng code IDE có màu cú pháp (Syntax Highlighted Matrix Code)
    const tick = Math.floor(Date.now() / 200) % 4;
    const codeColors = ['#22c55e', '#38bdf8', '#fb923c', '#a855f7'];
    for (let r = 0; r < 4; r++) {
      ctx.fillStyle = codeColors[(r + tick) % codeColors.length];
      const lineW = ((r * 7 + tick * 3) % 18) + 12;
      ctx.fillRect(x + 16, y - 22 + r * 5, Math.min(32, lineW), 2);
    }
    // Con trỏ Terminal nhấp nháy xanh lá
    if (Math.floor(Date.now() / 320) % 2 === 0) {
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(x + 36, y - 7, 4, 3);
    }

    // Giấy nhớ Post-It màu vàng góc màn hình 1 (y hệt trong ảnh tham khảo)
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x + 46, y - 28, 7, 7);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(x + 47, y - 26, 5, 1);

    // Màn hình 2 (Dọc 24" Portrait) - Biểu đồ Microservices DAG & TPS Monitor
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect(x + 58, y - 28, 28, 30, 2);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    ctx.fillStyle = '#082f49';
    ctx.fillRect(x + 60, y - 26, 24, 26);

    // Sơ đồ Nodes & Metrics
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 64, y - 22, 5, 4);
    ctx.fillRect(x + 75, y - 22, 5, 4);
    ctx.fillRect(x + 69, y - 13, 6, 4);
    // Đồ thị nhịp tim (Heartbeat graph)
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 62, y - 5);
    ctx.lineTo(x + 67, y - 7);
    ctx.lineTo(x + 71, y - 3);
    ctx.lineTo(x + 76, y - 8);
    ctx.lineTo(x + 82, y - 5);
    ctx.stroke();

    // Giấy nhớ Post-It xanh cyan mép màn hình 2
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(x + 56, y - 18, 6, 6);

    // Bàn phím cơ có đèn nền RGB (RGB Mechanical Keyboard)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 22, y + 4, 28, 9);
    // Đèn LED gầm phím
    const rgbTick = (Date.now() / 600) % 1;
    ctx.fillStyle = rgbTick < 0.5 ? '#a855f7' : '#06b6d4';
    ctx.fillRect(x + 23, y + 11, 26, 1.5);

    // Dây cáp xoắn bàn phím cơ (Coiled Aviator Cable)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 36, y + 4);
    ctx.lineTo(x + 38, y + 1);
    ctx.lineTo(x + 44, y + 1);
    ctx.stroke();

    // Lót chuột cỡ lớn (Desk Pad)
    ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    ctx.fillRect(x + 18, y + 2, 48, 14);

    // Chuột không dây
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 54, y + 6, 5, 7);

    // Cốc cà phê đỏ có khói bốc lên sống động
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x + 74, y + 4, 7, 9);
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(x + 75, y + 5, 5, 2);
    this.drawCoffeeSteam(ctx, x + 77, y + 4);

    // Ống cắm bút văn phòng bằng kim loại có bút chì xanh đỏ
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 86, y + 4, 7, 9);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + 87, y + 1, 1.5, 4);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 90, y, 1.5, 5);

    ctx.restore();
  }

  /**
   * Bàn làm việc Kiến trúc sư & Project Manager (Architectural Drafting Station - Pinterest Pin 1 & Hardware)
   */
  public static drawArchitectDesk(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 96;
    const h = 40;

    ctx.save();
    // Đổ bóng chân bàn
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(x + 4, y + 8, w, h);

    // Khung thép sơn tĩnh điện màu đen
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 2, y + 6, 5, h);
    ctx.fillRect(x + w - 7, y + 6, 5, h);

    // Thùng máy Workstation màu bạc dưới gầm bàn
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + w - 22, y + 16, 16, 22);
    ctx.fillStyle = '#22c55e'; // LED xanh nguồn
    ctx.fillRect(x + w - 20, y + 18, 2, 2);

    // Mặt bàn làm việc laminate sáng màu chuẩn văn phòng Pinterest Pin B
    const deskGrad = ctx.createLinearGradient(x, y, x, y + 18);
    deskGrad.addColorStop(0, '#f8fafc');
    deskGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = deskGrad;
    ctx.fillRect(x, y, w, 18);

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, 18);

    // Màn hình kiến trúc lớn hiển thị CAD / System Blueprints
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect(x + 28, y - 24, 46, 26, 2);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Bản thiết kế hệ thống trên màn hình
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(x + 30, y - 22, 42, 22);

    // Khối kiến trúc & dây nối dữ liệu
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(x + 34, y - 18, 10, 6);
    ctx.fillRect(x + 48, y - 18, 10, 6);
    ctx.fillRect(x + 62, y - 18, 8, 6);
    ctx.fillRect(x + 42, y - 8, 18, 5);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 39, y - 12);
    ctx.lineTo(x + 51, y - 8);
    ctx.moveTo(x + 53, y - 12);
    ctx.lineTo(x + 51, y - 8);
    ctx.stroke();

    // Giấy nhớ Post-It vàng trên góc màn hình CAD
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x + 66, y - 26, 7, 7);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(x + 67, y - 24, 5, 1);

    // Bản vẽ Blueprint thực tế trải rộng trên bàn với thước đo T-Square
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(x + 6, y + 3, 26, 14);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x + 8, y + 5, 22, 10);
    // Đường gióng kích thước
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(x + 10, y + 7, 8, 1);
    ctx.fillRect(x + 10, y + 11, 14, 1);

    // Thước kẻ gỗ & bút chì kỹ thuật
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x + 5, y + 2, 2, 16);

    // Ống đựng bản vẽ giấy cuộn (Blueprint Tube)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + w - 16, y + 2, 12, 14);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + w - 14, y - 1, 4, 3);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x + w - 9, y - 3, 4, 5);

    ctx.restore();
  }

  /**
   * Bộ Lounge văn phòng hiện đại: Ghế bành đơn + Sofa 2 chỗ + Bàn trà kính (Chuẩn 100% Pinterest pin_office.jpg 817544138597868043)
   */
  public static drawModularBlueSofa(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.save();

    // 1. Thảm trải sàn xám nhạt tinh tế (Neutral Soft Grey Lounge Rug)
    const rugW = w + 20;
    const rugH = h + 24;
    const rugX = x - 12;
    const rugY = y - 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.beginPath();
    ctx.roundRect(rugX + 3, rugY + 3, rugW, rugH, 6);
    ctx.fill();

    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(rugX, rugY, rugW, rugH, 6);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 2. GHẾ BÀNH ĐƠN 1 CHỖ (Single Armchair - Pinterest pin_office.jpg bên trái)
    const ax = x - 6;
    const ay = y + 2;
    const aw = 30;

    // Đổ bóng ghế đơn
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.beginPath();
    ctx.ellipse(ax + aw / 2, ay + h + 2, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4 Chân kim loại tối màu
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(ax + 3, ay + h - 2, 2.5, 5);
    ctx.fillRect(ax + aw - 5.5, ay + h - 2, 2.5, 5);

    // Tựa lưng ghế bành vát chéo
    ctx.fillStyle = '#2d406a';
    ctx.beginPath();
    ctx.roundRect(ax + 2, ay, aw - 4, 16, [4, 4, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#395088';
    ctx.fillRect(ax + 4, ay + 2, aw - 8, 12);

    // Đệm ngồi ghế bành êm ái
    ctx.fillStyle = '#415c9a';
    ctx.beginPath();
    ctx.roundRect(ax, ay + 14, aw, h - 14, 3);
    ctx.fill();
    ctx.fillStyle = '#516ea8';
    ctx.fillRect(ax + 2, ay + 15, aw - 4, 2);

    // Tay vịn ghế bành 2 bên
    ctx.fillStyle = '#253556';
    ctx.fillRect(ax - 2, ay + 10, 4, h - 10);
    ctx.fillRect(ax + aw - 2, ay + 10, 4, h - 10);

    // 3. SOFA 2 CHỖ (Two-Seater Sofa - Pinterest pin_office.jpg bên phải)
    const sx = x + 38;
    const sy = y + 2;
    const sw = 76;

    // Đổ bóng sofa 2 chỗ
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.beginPath();
    ctx.ellipse(sx + sw / 2, sy + h + 2, 38, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chân sofa kim loại thanh mảnh
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(sx + 4, sy + h - 2, 2.5, 5);
    ctx.fillRect(sx + sw - 6.5, sy + h - 2, 2.5, 5);
    ctx.fillRect(sx + sw / 2 - 1.2, sy + h - 2, 2.5, 5);

    // Tựa lưng sofa 2 chỗ vát chéo
    ctx.fillStyle = '#2d406a';
    ctx.beginPath();
    ctx.roundRect(sx + 2, sy, sw - 4, 16, [4, 4, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#395088';
    ctx.fillRect(sx + 4, sy + 2, sw - 8, 12);

    // Đường rãnh may chia đôi tựa lưng
    ctx.strokeStyle = '#1e2b46';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx + sw / 2, sy + 2);
    ctx.lineTo(sx + sw / 2, sy + 14);
    ctx.stroke();

    // 2 Đệm ngồi nỉ Royal Navy êm ái
    ctx.fillStyle = '#415c9a';
    ctx.beginPath();
    ctx.roundRect(sx, sy + 14, sw, h - 14, 3);
    ctx.fill();
    ctx.fillStyle = '#516ea8';
    ctx.fillRect(sx + 2, sy + 15, sw - 4, 2);

    // Rãnh phân cách 2 đệm ngồi
    ctx.strokeStyle = '#1e2b46';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(sx + sw / 2, sy + 14);
    ctx.lineTo(sx + sw / 2, sy + h);
    ctx.stroke();

    // Tay vịn sofa 2 bên
    ctx.fillStyle = '#253556';
    ctx.fillRect(sx - 2, sy + 10, 4, h - 10);
    ctx.fillRect(sx + sw - 2, sy + 10, 4, h - 10);

    // Cuốn sổ tài liệu đặt trên đệm sofa (giống trong pin_office.jpg)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(sx + sw - 24, sy + 18, 9, 12);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(sx + sw - 23, sy + 19, 7, 10);

    ctx.restore();
  }

  /**
   * Bàn trà mặt kính xanh nhạt kèm chậu cây mọng nước và sách (Pinterest pin_office.jpg)
   */
  public static drawCoffeeTable(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 56;
    const h = 22;

    ctx.save();
    // Đổ bóng bàn trà
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.roundRect(x + 2, y + 4, w, h, 4);
    ctx.fill();

    // 4 Chân bàn kim loại đen thanh mảnh
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 4, y + 8, 2, h - 8);
    ctx.fillRect(x + w - 6, y + 8, 2, h - 8);
    ctx.fillRect(x + 4, y + h - 2, w - 8, 2);

    // Mặt bàn kính xanh nhạt pastel (Pastel Soft Cyan/Blue Glass)
    ctx.fillStyle = '#93c5fd';
    ctx.beginPath();
    ctx.roundRect(x, y, w, 11, 3);
    ctx.fill();
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Vệt bóng sáng mặt kính
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 6, y + 3);
    ctx.lineTo(x + 18, y + 3);
    ctx.stroke();

    // 1. Cuốn sách bìa xanh đậm trên mặt bàn (giống trong pin_office.jpg)
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(x + 8, y + 3, 11, 6);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x + 9, y + 4, 9, 4);

    // 2. Chậu cây mọng nước xanh tươi ở trung tâm (Potted Succulent - pin_office.jpg)
    const potX = x + w / 2;
    const potY = y + 4;
    // Chậu đất nung cam
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.roundRect(potX - 3.5, potY, 7, 5, 1);
    ctx.fill();
    // Lá cây mọng nước xanh lá
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(potX - 2, potY - 1, 2.5, 0, Math.PI * 2);
    ctx.arc(potX + 2, potY - 1, 2.5, 0, Math.PI * 2);
    ctx.arc(potX, potY - 3, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 3. Tách cà phê gốm trắng nhỏ bốc khói phía bên phải bàn
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x + w - 14, y + 3, 6, 5);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x + w - 13, y + 4, 4, 1.5);
    this.drawCoffeeSteam(ctx, x + w - 11, y + 2);

    ctx.restore();
  }

  /**
   * Kệ sách thép & gỗ công nghiệp chuẩn Tech Workshop (Pinterest Pin 1)
   */
  public static drawBookshelf(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 48;
    const h = 46;

    ctx.save();
    // Khung ống thép sơn đen
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x, y, 3, h);
    ctx.fillRect(x + w - 3, y, 3, h);

    // 3 Tầng đợt gỗ dày
    for (let tier = 0; tier < 3; tier++) {
      ctx.fillStyle = '#5c2d13';
      ctx.fillRect(x, y + 14 + tier * 15, w, 3);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x, y + 14 + tier * 15, w, 1);
    }

    // Tầng 1: Sách kỹ thuật kiến trúc & AI nhiều màu
    const bookColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
    for (let b = 0; b < 5; b++) {
      ctx.fillStyle = bookColors[b % bookColors.length];
      const bh = 10 + (b % 3);
      ctx.fillRect(x + 4 + b * 8, y + 14 - bh, 6, bh);
      // Gáy sách viền vàng
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(x + 4 + b * 8, y + 14 - bh + 2, 6, 1);
    }

    // Tầng 2: Tài liệu hộp & sổ dự án 40 năm kinh nghiệm
    for (let b = 0; b < 4; b++) {
      ctx.fillStyle = b % 2 === 0 ? '#334155' : '#475569';
      ctx.fillRect(x + 6 + b * 9, y + 29 - 11, 7, 11);
    }

    // Tầng 3: Hộp linh kiện điện tử / chậu sen đá nhỏ
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(x + 8, y + 44 - 8, 16, 8);
    // Chậu sen đá
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 30, y + 44 - 6, 8, 6);
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(x + 34, y + 44 - 8, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Tủ Server Rack 42U đèn LED nhấp nháy chuẩn Datacenter (Pinterest Pin 1)
   */
  public static drawServerRack(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 34;
    const h = 54;

    ctx.save();
    // Vỏ tủ thép đen phủ mờ
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 3);
    ctx.fill();

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Cửa kính tối quan sát bên trong
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

    // Màn hình LCD xanh giám sát thông số CPU / Network trên cùng
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(x + 5, y + 5, w - 10, 5);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 7, y + 6, 8, 2);

    // 5 Khay máy chủ Server Blades với quạt thông gió và dãy đèn LED
    const timeTick = Math.floor(Date.now() / 250);
    for (let blade = 0; blade < 5; blade++) {
      const by = y + 13 + blade * 7.5;
      // Khay kim loại
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x + 4, by, w - 8, 6);

      // Đèn LED trạng thái CPU (Xanh lá)
      ctx.fillStyle = (timeTick + blade) % 2 === 0 ? '#22c55e' : '#15803d';
      ctx.fillRect(x + 6, by + 2, 2.5, 2.5);

      // Đèn LED Network (Xanh cyan nhấp nháy nhanh)
      ctx.fillStyle = (timeTick + blade * 2) % 3 === 0 ? '#38bdf8' : '#0284c7';
      ctx.fillRect(x + 10, by + 2, 2.5, 2.5);

      // Đèn LED Disk I/O (Vàng cam)
      ctx.fillStyle = (timeTick + blade) % 4 === 0 ? '#f59e0b' : '#78350f';
      ctx.fillRect(x + 14, by + 2, 2.5, 2.5);

      // Khe tản nhiệt
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 19, by + 1.5, 8, 3);
    }

    ctx.restore();
  }



  /**
   * Bảng kính kiến trúc trong suốt gắn tường (Frosted Glass Architecture Board)
   */
  public static drawWhiteboard(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 110;
    const h = 36;

    ctx.save();
    // Mặt bảng kính mờ
    ctx.fillStyle = 'rgba(248, 250, 252, 0.92)';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 3);
    ctx.fill();

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 4 Chốt inox gắn tường ở 4 góc
    ctx.fillStyle = '#64748b';
    const standoffs = [
      [x + 3, y + 3], [x + w - 4, y + 3],
      [x + 3, y + h - 4], [x + w - 4, y + h - 4]
    ];
    standoffs.forEach(([sx, sy]) => {
      ctx.fillRect(sx, sy, 2, 2);
    });

    // Sơ đồ luồng hệ thống: Director -> Architect -> Dev -> QA
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(x + 8, y + 8, 18, 10);
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(x + 34, y + 8, 18, 10);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(x + 60, y + 8, 18, 10);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + 86, y + 8, 18, 10);

    // Mũi tên kết nối
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 26, y + 13); ctx.lineTo(x + 34, y + 13);
    ctx.moveTo(x + 52, y + 13); ctx.lineTo(x + 60, y + 13);
    ctx.moveTo(x + 78, y + 13); ctx.lineTo(x + 86, y + 13);
    ctx.stroke();

    // Giấy ghi chú Sticky Notes dán trên bảng (Vàng, Hồng, Xanh)
    ctx.fillStyle = '#fde047'; // Vàng
    ctx.fillRect(x + 12, y + 21, 8, 8);
    ctx.fillStyle = '#f472b6'; // Hồng
    ctx.fillRect(x + 38, y + 21, 8, 8);
    ctx.fillStyle = '#67e8f9'; // Cyan
    ctx.fillRect(x + 66, y + 21, 8, 8);

    // Khay bút lông bên dưới
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 25, y + h - 1, 60, 2);

    ctx.restore();
  }

  /**
   * Chú mèo trắng đốm cam đang cuộn tròn ngủ trên bàn làm việc (Chi tiết đáng yêu từ hình ảnh tham khảo)
   */
  public static drawSleepingCat(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    // Đổ bóng nhẹ
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(x + 1, y + 3, 7, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Thân mèo cuộn tròn màu trắng
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(x, y, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Đốm vàng cam trên lưng
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(x + 1, y - 1, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Đầu mèo đang gối ngủ
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(x - 4, y + 1, 3, 0, Math.PI * 2);
    ctx.fill();

    // 2 Tai mèo nhỏ hình tam giác
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(x - 6, y - 1);
    ctx.lineTo(x - 4, y - 4);
    ctx.lineTo(x - 3, y - 1);
    ctx.closePath();
    ctx.fill();

    // Mắt mèo nhắm tít (dấu gạch ngang thanh thản)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(x - 5.5, y + 1);
    ctx.lineTo(x - 3.5, y + 1);
    ctx.stroke();

    // Đuôi mèo uốn cong quanh thân
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(x + 4, y + 1, 3.5, -Math.PI / 4, Math.PI / 2);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Tủ sideboard gắn tường màu xanh dương với cửa kính trượt và khay tài liệu (Tường trên bên phải)
   */
  public static drawBlueWallSideboard(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 72;
    const h = 26;
    ctx.save();
    // Đổ bóng
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(x + 2, y + 4, w, h);

    // Thân tủ màu xanh dương
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);

    // Mặt tủ trên bằng gỗ sáng
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x, y, w, 3);

    // 3 Cửa kính trượt mờ màu xanh
    for (let c = 0; c < 3; c++) {
      ctx.fillStyle = 'rgba(186, 230, 253, 0.6)';
      ctx.fillRect(x + 3 + c * 23, y + 5, 20, h - 8);
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(x + 3 + c * 23, y + 5, 20, h - 8);

      // Tay nắm trượt
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(x + 20 + c * 23, y + 12, 1.5, 4);
    }

    // Xấp giấy và khay tài liệu gỗ trên nóc tủ
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 6, y - 5, 12, 5); // Xấp giấy A4
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x + 6, y - 3, 12, 1);

    // Khay gỗ đựng hồ sơ
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x + 24, y - 4, 16, 4);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x + 26, y - 6, 12, 2);
    ctx.restore();
  }

  /**
   * Ghế xoay văn phòng có cặp da công tác màu nâu đặt trên mặt ghế (Chi tiết từ góc phải trên ảnh)
   */
  public static drawBriefcaseOnChair(ctx: CanvasRenderingContext2D, x: number, y: number) {
    this.drawOfficeSwivelChair(ctx, x, y);

    // Chiếc cặp da nâu (Leather Briefcase) đặt ngay ngắn trên mặt ghế
    ctx.save();
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(x - 6, y - 2, 12, 7, 1.5);
    ctx.fill();

    // Nắp cặp và khóa đồng
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x - 6, y - 2, 12, 3);
    ctx.fillStyle = '#eab308'; // Khóa vàng
    ctx.fillRect(x - 1, y, 2, 1.5);

    // Quai xách cặp
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y - 3, 2.5, Math.PI, 0);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Tranh hoa tươi viền gỗ treo tường góc phải (Framed Floral Art)
   */
  public static drawFramedFloralArt(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.fillStyle = '#b45309';
    ctx.fillRect(x, y, 16, 20);
    ctx.fillStyle = '#fefce8';
    ctx.fillRect(x + 2, y + 2, 12, 16);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(x + 6, y + 12, 4, 5);
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(x + 8, y + 8, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(x + 6, y + 6, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /**
   * Poster quả địa cầu & biểu đồ thông tin công nghệ (Globe Infographics Poster)
   */
  public static drawGlobePoster(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, 20, 26);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x, y, 20, 26);

    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(x + 10, y + 9, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(x + 8, y + 7, 4, 3);
    ctx.fillRect(x + 10, y + 10, 3, 2);

    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + 3, y + 18, 14, 1.5);
    ctx.fillRect(x + 3, y + 21, 10, 1.5);
    ctx.restore();
  }

  /**
   * Đồng hồ tròn treo tường viền xanh lá (Green Round Wall Clock)
   */
  public static drawRoundGreenClock(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 2.5, y - 3.5);
    ctx.moveTo(x, y);
    ctx.lineTo(x + 3.5, y - 2.5);
    ctx.stroke();

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /**
   * Hộp hồ sơ tài liệu văn phòng bằng bìa carton vàng và xanh (Office Archive Boxes)
   */
  public static drawArchiveBoxes(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    // Hộp 1: Vàng cam
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x, y, 13, 11);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(x, y, 13, 11);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(x - 1, y - 2, 15, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 3, y + 3, 7, 3);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 5, y + 7, 3, 2);

    // Hộp 2: Xanh lá cây
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(x + 16, y + 2, 12, 9);
    ctx.strokeStyle = '#15803d';
    ctx.strokeRect(x + 16, y + 2, 12, 9);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(x + 15, y, 14, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 18, y + 4, 6, 3);
    ctx.restore();
  }

  /**
   * Quầy bếp Pantry mặt đá đen & Máy pha cà phê Espresso chuyên nghiệp
   */
  public static drawKitchenCounter(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 84;
    const h = 38;

    ctx.save();
    // Thùng quầy bếp gỗ sồi sơn xám
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, y + 5, w, h - 5);

    // Mặt bàn đá Granite đen bóng (Black Granite Countertop)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 2, y, w + 4, 6);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 1, y + 1, w + 2, 2);

    // Bồn rửa chén inox & vòi nước cổ ngỗng (Gooseneck Chrome Faucet)
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + 8, y + 8, 22, 18);
    ctx.fillStyle = '#0284c7'; // Nước trong bồn
    ctx.fillRect(x + 10, y + 10, 18, 14);

    // Vòi nước inox
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x + 17, y + 2, 4, 7);
    ctx.fillRect(x + 15, y + 2, 6, 2);

    // Máy pha Espresso 2 cần chuyên nghiệp phong cách quán Cafe Retro
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x + 42, y - 10, 36, 16);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x + 44, y - 8, 32, 12);

    // 2 Đồng hồ áp suất & tay cầm cần pha
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(x + 48, y - 4, 3, 3);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(x + 66, y - 4, 3, 3);
    // Vòi xả cà phê
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 52, y + 2, 4, 4);
    ctx.fillRect(x + 62, y + 2, 4, 4);

    // Khói cà phê nóng bốc lên từ máy pha
    this.drawCoffeeSteam(ctx, x + 54, y - 10);
    this.drawCoffeeSteam(ctx, x + 64, y - 10);

    ctx.restore();
  }

  /**
   * Tủ kính sách đứng khung xanh Royal Blue có chậu hoa trên nóc (Pinterest Pin B - Signature Blue Glass Cabinet)
   */
  public static drawGlassFilingCabinet(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 36;
    const h = 58;

    ctx.save();
    // 1. Đổ bóng chân tủ xuống sàn gạch
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(x + 2, y + 4, w, h);

    // 2. Chậu hoa nung có hoa đỏ rực rỡ đặt trên nóc tủ (Pinterest Pin B - Flower Pot on Cabinet)
    const potX = x + w / 2;
    const potY = y - 3;
    // Chậu đất nung
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(potX - 5, potY - 4, 10, 4);
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(potX - 6, potY - 6, 12, 2);
    // Lá xanh
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(potX - 3, potY - 8, 3, 0, Math.PI * 2);
    ctx.arc(potX + 3, potY - 8, 3, 0, Math.PI * 2);
    ctx.fill();
    // Hoa đỏ nở rộ
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(potX, potY - 11, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a'; // Nhụy vàng
    ctx.fillRect(potX - 1, potY - 12, 2, 2);

    // 3. Khung tủ kim loại màu xanh Royal Blue rực rỡ (Pinterest Pin B)
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 2);
    ctx.fill();

    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 4. Bốn tầng đợt kệ bên trong chứa đầy các file còng, tài liệu nhiều màu
    const shelfH = 13;
    for (let s = 0; s < 4; s++) {
      const sy = y + 3 + s * shelfH;
      // Thanh đợt nhôm
      ctx.fillStyle = '#1e40af';
      ctx.fillRect(x + 2, sy + shelfH - 2, w - 4, 2);

      if (s === 0) {
        // Tầng 1: File tài liệu Đỏ, Vàng, Xanh dương
        const binders = ['#ef4444', '#f59e0b', '#0284c7', '#38bdf8'];
        binders.forEach((col, idx) => {
          ctx.fillStyle = col;
          ctx.fillRect(x + 4 + idx * 7, sy + 1, 6, shelfH - 3);
          ctx.fillStyle = '#ffffff'; // Nhãn trắng gáy
          ctx.fillRect(x + 5 + idx * 7, sy + 3, 4, 3);
        });
      } else if (s === 1) {
        // Tầng 2: File tài liệu Xanh lá, Tím, Cam
        const binders = ['#10b981', '#a855f7', '#f97316', '#06b6d4'];
        binders.forEach((col, idx) => {
          ctx.fillStyle = col;
          ctx.fillRect(x + 4 + idx * 7, sy + 1, 6, shelfH - 3);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x + 5 + idx * 7, sy + 3, 4, 3);
        });
      } else if (s === 2) {
        // Tầng 3: Sách bìa cứng & hộp dự án
        const binders = ['#3b82f6', '#ec4899', '#eab308', '#6366f1'];
        binders.forEach((col, idx) => {
          ctx.fillStyle = col;
          ctx.fillRect(x + 4 + idx * 7, sy + 1, 6, shelfH - 3);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x + 5 + idx * 7, sy + 3, 4, 3);
        });
      } else {
        // Tầng 4: Xấp giấy A4 trắng & hộp hồ sơ lưu trữ
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(x + 5, sy + 3, 12, shelfH - 5);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(x + 19, sy + 2, 12, shelfH - 4);
      }
    }

    // 5. Cánh cửa kính trong suốt phản chiếu vát chéo
    ctx.fillStyle = 'rgba(186, 230, 253, 0.28)';
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

    // Vệt phản chiếu ánh sáng trên mặt kính
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 5);
    ctx.lineTo(x + 24, y + 32);
    ctx.stroke();

    // 2 Tay nắm thanh nhôm dài
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x + w / 2 - 2, y + 16, 1.5, 16);
    ctx.fillRect(x + w / 2 + 1, y + 16, 1.5, 16);

    ctx.restore();
  }

  /**
   * Máy Photocopy / Máy in laser đa khay văn phòng (Pinterest Pin B Hardware Suite)
   */
  public static drawOfficeCopier(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 38;
    const h = 48;

    ctx.save();
    // Đổ bóng máy xuống sàn
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(x + 2, y + 6, w, h);

    // Thân máy in kim loại trắng sứ & xám hiện đại
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(x, y + 14, w, h - 14, 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 2 Khay đựng giấy A4/A3 kéo ra có tay nắm nhôm
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x + 4, y + 28, w - 8, 8);
    ctx.fillRect(x + 4, y + 38, w - 8, 8);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x + 14, y + 31, 10, 2);
    ctx.fillRect(x + 14, y + 41, 10, 2);

    // Mặt kính quét Scanner & Nắp nạp tài liệu tự động (ADF Top Feeder)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 2, y + 2, w - 4, 12);
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 4, y, w - 8, 6); // Khay nạp trên cùng

    // Màn hình cảm ứng điều khiển nghiêng có đèn LED
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + w - 14, y + 10, 12, 10);
    ctx.fillStyle = '#06b6d4'; // Màn hình sáng xanh
    ctx.fillRect(x + w - 13, y + 11, 10, 8);

    // Đèn LED trạng thái máy (Xanh lá Online / Đỏ Data)
    const isReady = Math.floor(Date.now() / 400) % 2 === 0;
    ctx.fillStyle = isReady ? '#22c55e' : '#15803d';
    ctx.fillRect(x + 6, y + 18, 3, 3);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 11, y + 18, 3, 3);

    // Khay đỡ giấy in ra bên hông kèm tập tài liệu trắng vừa in
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x - 8, y + 22, 9, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 7, y + 19, 7, 3);

    // Thùng rác tái chế giấy màu xanh dương đặt bên cạnh (Pinterest Pin B - Blue Recycle Bin)
    const binX = x + w + 4;
    const binY = y + 26;
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(binX, binY);
    ctx.lineTo(binX + 13, binY);
    ctx.lineTo(binX + 11, binY + 18);
    ctx.lineTo(binX + 2, binY + 18);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0369a1';
    ctx.stroke();

    // Biểu tượng tam giác tái chế trắng
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(binX + 6.5, binY + 5);
    ctx.lineTo(binX + 9.5, binY + 11);
    ctx.lineTo(binX + 3.5, binY + 11);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Cây cảnh hình cầu Topiary trong chậu gốm nung (Pinterest Pin B - Manicured Ball Topiary)
   */
  public static drawTopiaryPlant(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const time = Date.now() / 900;
    const sway = Math.sin(time + x * 0.1) * 0.8;

    ctx.save();
    // 1. Bóng đổ chậu xuống sàn
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x, y + 18, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Chậu gốm nung Terracotta vát tròn
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.moveTo(x - 8, y + 6);
    ctx.lineTo(x + 8, y + 6);
    ctx.lineTo(x + 6, y + 18);
    ctx.lineTo(x - 6, y + 18);
    ctx.closePath();
    ctx.fill();

    // Vành chậu và điểm sáng
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(x - 9, y + 4, 18, 3);
    ctx.fillStyle = '#ffedd5';
    ctx.fillRect(x - 7, y + 5, 4, 1);

    // Đất màu nâu xốp
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(x - 7, y + 5, 14, 2);

    // 3. Thân cây gỗ thẳng đứng
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, y + 6);
    ctx.lineTo(x + sway, y - 6);
    ctx.stroke();

    // 4. Vương miện lá hình cầu tròn cắt tỉa hoàn hảo (Manicured Spherical Crown)
    const ballX = x + sway;
    const ballY = y - 14;
    const radius = 13;

    // Lớp bóng tối
    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.arc(ballX + 1, ballY + 1, radius, 0, Math.PI * 2);
    ctx.fill();

    // Khối tán lá xanh tươi
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(ballX, ballY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Lớp lá xanh sáng hướng sáng
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(ballX - 2, ballY - 3, radius * 0.75, 0, Math.PI * 2);
    ctx.fill();

    // Đốm nắng phản chiếu trên vòm lá
    ctx.fillStyle = '#86efac';
    ctx.beginPath();
    ctx.arc(ballX - 4, ballY - 5, radius * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Cây Bonsai Nhật Bản trên đôn gỗ (Pinterest Pin B - Japanese Zen Bonsai Plinth)
   */
  public static drawBonsaiTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();

    // 1. Đôn trưng bày bằng gỗ trắc đen (Carved Rosewood Plinth)
    ctx.fillStyle = '#261306';
    ctx.fillRect(x - 14, y + 10, 28, 4);
    ctx.fillRect(x - 12, y + 14, 4, 6);
    ctx.fillRect(x + 8, y + 14, 4, 6);
    ctx.fillRect(x - 14, y + 19, 28, 2);

    // 2. Chậu gốm Bonsai dẹt hình oval tráng men xanh lục
    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    ctx.roundRect(x - 12, y + 5, 24, 6, 2);
    ctx.fill();
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Đất rêu phong xanh đậm
    ctx.fillStyle = '#14532d';
    ctx.fillRect(x - 10, y + 4, 20, 2);

    // 3. Thân gỗ gồ ghề uốn lượn phong cách Zen (Gnarled Twisted Trunk)
    ctx.strokeStyle = '#543519';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 2, y + 5);
    ctx.quadraticCurveTo(x - 7, y - 2, x - 3, y - 8);
    ctx.quadraticCurveTo(x + 2, y - 14, x + 6, y - 18);
    ctx.stroke();

    // Nhánh phụ vươn sang trái
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 4, y - 6);
    ctx.lineTo(x - 12, y - 9);
    ctx.stroke();

    // 4. Các cụm tán lá mây đa tầng (Cloud Foliage Pads)
    const pads = [
      { px: x - 13, py: y - 10, rw: 9, rh: 4 },
      { px: x + 1, py: y - 15, rw: 11, rh: 4.5 },
      { px: x + 7, py: y - 21, rw: 10, rh: 4 },
    ];

    pads.forEach(p => {
      // Tầng lá tối
      ctx.fillStyle = '#0f3d1f';
      ctx.beginPath();
      ctx.ellipse(p.px, p.py + 1, p.rw, p.rh, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tầng lá xanh lục
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.ellipse(p.px, p.py, p.rw, p.rh, 0, 0, Math.PI * 2);
      ctx.fill();

      // Đốm kim lá xanh mạ vàng
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.ellipse(p.px - 1, p.py - 1, p.rw * 0.6, p.rh * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  /**
   * Kệ cây leo Ivy trên tường (Pinterest Pin A - Cozy Wall Ivy Shelf)
   */
  public static drawWallIvyShelf(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const time = Date.now() / 800;
    const flutter = Math.sin(time + x * 0.2) * 1.2;

    ctx.save();
    // 1. Kệ gỗ treo tường có giá đỡ đồng
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x - 14, y, 28, 3);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(x - 14, y, 28, 1);

    // 2 Ke đỡ bằng kim loại vàng đồng
    ctx.fillStyle = '#d97706';
    ctx.fillRect(x - 10, y + 3, 2, 6);
    ctx.fillRect(x + 8, y + 3, 2, 6);

    // 2. Chậu gốm sứ trắng tinh trên kệ
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x - 6, y - 8, 12, 8);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x - 7, y - 9, 14, 2);

    // 3. Tán lá cây xum xuê trên miệng chậu
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(x, y - 8, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(x - 2, y - 10, 5, 0, Math.PI * 2);
    ctx.fill();

    // 4. Các dây leo Ivy rủ xuống tường dài sống động (Cascading Trailing Vines)
    const vines = [
      { vx: x - 4, len: 18, wave: flutter },
      { vx: x, len: 24, wave: -flutter * 0.8 },
      { vx: x + 4, len: 14, wave: flutter * 1.1 },
    ];

    vines.forEach(v => {
      ctx.strokeStyle = '#166534';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(v.vx, y);
      ctx.quadraticCurveTo(v.vx + v.wave, y + v.len * 0.5, v.vx + v.wave * 1.2, y + v.len);
      ctx.stroke();

      // Các lá thường xuân hình trái tim dọc theo dây leo
      for (let ly = y + 4; ly < y + v.len; ly += 5) {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(v.vx + v.wave * 0.6 + ((ly % 2 === 0) ? 2 : -2), ly, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#86efac';
        ctx.fillRect(v.vx + v.wave * 0.6 + ((ly % 2 === 0) ? 2 : -2), ly, 1, 1);
      }
    });

    ctx.restore();
  }

  /**
   * Cây nước nóng lạnh hiện đại
   */
  public static drawWaterDispenser(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    // Bình nước úp ngược tròn trong suốt
    ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.beginPath();
    ctx.arc(x + 9, y + 7, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Bọt khí trong bình
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 8, y + 5, 2, 2);

    // Thân máy
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x + 2, y + 14, 14, 32);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 2, y + 14, 14, 32);

    // 2 Vòi gạt: Nóng (Đỏ), Lạnh (Xanh)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + 4, y + 24, 3, 4);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 11, y + 24, 3, 4);

    ctx.restore();
  }

  /**
   * Ghế dài nghỉ ngơi phòng bida
   */
  public static drawLoungeBench(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#581c87';
    ctx.fillRect(x, y, 80, 22);
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(x + 2, y + 2, 76, 5);
  }

  /**
   * Chậu cây xanh nhiệt đới Monstera / Ficus 4D chân thực
   */
  public static drawPottedPlant(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const time = Date.now() / 700;
    const sway = Math.sin(time + x * 0.1) * 1.5;

    ctx.save();
    // 1. Bóng đổ mềm dưới sàn
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x, y + 20, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Chậu gốm nung vát cạnh 3D (Ceramic Flared Pot)
    ctx.fillStyle = '#9a3412';
    ctx.beginPath();
    ctx.moveTo(x - 9, y + 8);
    ctx.lineTo(x + 9, y + 8);
    ctx.lineTo(x + 6, y + 20);
    ctx.lineTo(x - 6, y + 20);
    ctx.closePath();
    ctx.fill();

    // Vành chậu và điểm sáng
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(x - 10, y + 6, 20, 3);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 8, y + 7, 5, 1);

    // Đất trồng màu đen xốp
    ctx.fillStyle = '#29160a';
    ctx.fillRect(x - 8, y + 6, 16, 2);

    // 3. Thân cây gỗ uốn lượn tự nhiên
    ctx.strokeStyle = '#543519';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + 7);
    ctx.quadraticCurveTo(x + sway, y - 2, x + sway * 1.2, y - 10);
    ctx.stroke();

    // 4. Các cuống lá và phiến lá Monstera 4D đa tầng
    const leaves = [
      { dx: -12 + sway, dy: -6, rx: 11, ry: 7, rot: -0.5, c1: '#14532d', c2: '#16a34a' },
      { dx: 14 + sway, dy: -8, rx: 12, ry: 8, rot: 0.45, c1: '#14532d', c2: '#15803d' },
      { dx: -6 + sway * 1.3, dy: -16, rx: 13, ry: 9, rot: -0.2, c1: '#15803d', c2: '#22c55e' },
      { dx: 8 + sway * 1.4, dy: -18, rx: 12, ry: 8, rot: 0.25, c1: '#16a34a', c2: '#4ade80' },
      { dx: 0 + sway * 1.5, dy: -24, rx: 10, ry: 7, rot: 0.05, c1: '#22c55e', c2: '#86efac' },
    ];

    leaves.forEach(leaf => {
      ctx.save();
      ctx.translate(x + leaf.dx, y + leaf.dy);
      ctx.rotate(leaf.rot);

      // Thân lá
      ctx.fillStyle = leaf.c1;
      ctx.beginPath();
      ctx.ellipse(0, 0, leaf.rx, leaf.ry, 0, 0, Math.PI * 2);
      ctx.fill();

      // Mảng sáng trên phiến lá
      ctx.fillStyle = leaf.c2;
      ctx.beginPath();
      ctx.ellipse(-1, -1, leaf.rx * 0.7, leaf.ry * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      // Gân lá Monstera
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-leaf.rx * 0.7, 0);
      ctx.lineTo(leaf.rx * 0.7, 0);
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  }

  /**
   * Tranh treo tường
   */
  public static drawWallArt(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string) {
    ctx.fillStyle = '#eab308'; // Khung vàng
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = c;
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  }



  /**
   * Thùng rác inox
   */
  public static drawTrashBin(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x, y, 12, 15);
    ctx.fillStyle = '#475569';
    ctx.fillRect(x, y, 12, 3);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 3. VẼ 4 DŨNG CHUẨN XÁC, ANIMATION ĐẸP, ĐÚNG TƯ THẾ LÀM VIỆC
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Vẽ Nhân vật 4 Dũng: Hỗ trợ cả 2 Nam 2 Nữ Anime chuyên nghiệp (Chuẩn Pinterest) và Fallback
   */
  public static drawAgent(ctx: CanvasRenderingContext2D, agent: Agent, frame: number, _spriteImg?: HTMLImageElement) {
    const isCyberOffice = !!(ImageLoader.getOffice('cyberpunk_office') || ImageLoader.getOffice('cyberpunk_office_clean'));
    if (isCyberOffice) {
      this.drawRealisticCyberAgent(ctx, agent, frame);
      return;
    }

    const x = agent.pos_x;
    const y = agent.pos_y;
    const isMoving = agent.status === 'moving';

    ctx.save();

    // Xác định tư thế phù hợp với ngữ cảnh
    let pose = 'front_happy';
    if (isMoving) {
      pose = 'profile_walk';
    } else if (agent.current_room === 'boardroom' || agent.status === 'debating') {
      if (agent.code === 'dung_1') {
        pose = 'presenting_forward'; // Dũng 1 đứng thuyết trình mở 2 tay
      } else if (agent.code === 'dung_2') {
        pose = 'thinking_seated'; // Dũng 2 ngồi chống cằm trầm ngâm phản biện
      } else {
        pose = 'three_quarter_idle';
      }
    } else if (agent.code === 'dung_2' && agent.current_room === 'architect_office') {
      pose = 'thinking_stand'; // Dũng 2 đứng chống cằm suy nghĩ tại bàn kiến trúc
    } else if (agent.code === 'dung_3' && agent.current_room === 'dev_lab') {
      pose = 'three_quarter_idle'; // Dũng 3 tập trung code
    } else if (agent.current_room === 'kitchen_pantry' || agent.status === 'resting') {
      pose = 'front_happy';
    }

    const sprite = ImageLoader.getChibi(agent.code, pose);
    const facingLeft = isMoving && (agent.target_x < agent.pos_x);
    let headTopY = y - 48;

    if (sprite) {
      // 1. Tỉ lệ nhân vật Chibi chuẩn đẹp trên Canvas 3D (h: 38px, w: tỷ lệ gốc ăn khớp ghế ngồi)
      const charH = 38;
      const charW = Math.round(charH * (sprite.naturalWidth / sprite.naturalHeight));
      const bob = isMoving ? Math.abs(Math.sin(frame * 0.25)) * 2 : Math.sin(frame * 0.08) * 0.8;
      const drawX = x - charW / 2;
      const drawY = y - charH + 12 - bob;
      headTopY = drawY - 4;

      // Đổ bóng chân mềm mại trên sàn
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(x, y + 8, charW * 0.35, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Vẽ sprite (hỗ trợ lật ngang khi đi sang trái)
      ctx.save();
      if (facingLeft) {
        ctx.translate(x, 0);
        ctx.scale(-1, 1);
        ctx.translate(-x, 0);
      }
      ctx.drawImage(sprite, drawX, drawY, charW, charH);
      ctx.restore();
    } else {
      // Fallback nếu chưa tải xong ảnh hoặc lỗi
      if (isMoving) {
        this.drawWalkingAgent(ctx, x, y, frame, agent, facingLeft);
      } else if (agent.current_room === 'boardroom' || agent.status === 'debating') {
        if (agent.code === 'dung_1') {
          this.drawChibiPresenterBoardroom(ctx, x, y, frame, agent);
        } else if (agent.code === 'dung_2') {
          this.drawChibiDebaterBoardroom(ctx, x, y, frame, agent);
        } else {
          this.drawSittingBoardroomAgent(ctx, x, y, frame, agent, false);
        }
      } else if (agent.code === 'dung_1' && agent.current_room === 'director_office') {
        this.drawSittingSofaDirector(ctx, x, y, frame, agent);
      } else if (agent.code === 'dung_3' && agent.current_room === 'dev_lab') {
        this.drawSittingDevAgent(ctx, x, y, frame, agent);
      } else if (agent.code === 'dung_2' && agent.current_room === 'architect_office') {
        this.drawSittingArchitectAgent(ctx, x, y, frame, agent);
      } else if (agent.current_room === 'kitchen_pantry' || agent.status === 'resting') {
        this.drawStandingPantryAgent(ctx, x, y, frame, agent);
      } else {
        this.drawIdleStandingAgent(ctx, x, y, frame, agent);
      }
      headTopY = isMoving ? y - 35 - Math.abs(Math.sin(frame * 0.25)) * 2 : y - 32;
    }

    // ─────────────────────────────────────────────────────────────────────
    // BẢNG TÊN & BONG BÓNG SUY NGHĨ FALLOUT SHELTER
    // ─────────────────────────────────────────────────────────────────────
    // Bảng tên Pixel nổi trên đầu
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(x - 22, headTopY - 14, 44, 13);
    ctx.strokeStyle = agent.avatar_color;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x - 22, headTopY - 14, 44, 13);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 7.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(agent.name, x, headTopY - 5);

    // Bong bóng trạng thái động phong cách Fallout Shelter Vault Action Bubbles
    this.drawFalloutThoughtBubble(ctx, x, headTopY - 18, agent, frame);

    ctx.restore();
  }

  /**
   * Dũng 3 ngồi ghế xoay công thái học, xoay người 3/4 về phía bàn máy tính gõ bàn phím cơ RGB
   */
  public static drawSittingDevAgent(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, _agent: Agent) {
    ctx.save();
    // 1. Chân sao 5 bánh xe lăn trên sàn parquet
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 9, y + 8, 18, 2);
    ctx.fillRect(x - 2, y + 6, 4, 3);
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 10, y + 9, 3, 3);
    ctx.fillRect(x + 7, y + 9, 3, 3);
    ctx.fillRect(x - 2, y + 10, 4, 2);

    // 2. Trục nâng thủy lực xi-lanh mạ crom
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x - 1.5, y + 2, 3, 5);

    // 3. Đệm ngồi nỉ Royal Blue uốn lượn ôm mông
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.roundRect(x - 10, y - 4, 20, 8, 3);
    ctx.fill();
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(x - 8, y - 3, 16, 2);

    // 4. Lưng ghế lưới công thái học có đệm đỡ thắt lưng (Lumbar Support)
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.roundRect(x - 9, y - 16, 18, 12, 3);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 9, y - 16, 18, 12);
    // Đệm đỡ thắt lưng
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(x - 7, y - 11, 14, 3);

    // 5. Tay vịn ghế 2 bên (Armrests)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 12, y - 10, 3, 8);
    ctx.fillRect(x + 9, y - 10, 3, 8);
    ctx.fillRect(x - 13, y - 11, 5, 2);
    ctx.fillRect(x + 8, y - 11, 5, 2);

    // 6. Cơ thể Dũng 3 ngồi trên ghế:
    // Chân gập 90 độ, đùi luồn vào gầm bàn
    ctx.fillStyle = '#1e3a8a'; // Quần jeans xanh đậm
    ctx.fillRect(x - 8, y - 4, 16, 6);
    ctx.fillStyle = '#0f172a'; // Giày sneaker đen dưới gầm bàn
    ctx.fillRect(x - 6, y + 3, 4, 4);
    ctx.fillRect(x + 2, y + 3, 4, 4);

    // Thân áo thun đen công nghệ (Black Tech T-shirt)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 7, y - 14, 14, 11);
    // Logo Dev Cyan trên lưng áo
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x - 2, y - 10, 4, 2);

    // Cánh tay đưa về phía trước gõ bàn phím
    const typeCycle = Math.sin(frame * 0.7);
    const leftArmY = typeCycle > 0 ? -1 : 0;
    const rightArmY = typeCycle <= 0 ? -1 : 0;

    // Cánh tay trái & cẳng tay vươn ra gõ phím
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 10, y - 13, 3, 6);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 9, y - 8 + leftArmY, 4, 5);
    ctx.fillRect(x - 8, y - 5 + leftArmY, 5, 3);

    // Cánh tay phải & cẳng tay vươn ra gõ phím
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 7, y - 13, 3, 6);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x + 5, y - 8 + rightArmY, 4, 5);
    ctx.fillRect(x + 3, y - 5 + rightArmY, 5, 3);

    // Ánh sáng RGB bàn phím phản chiếu lên cổ tay
    ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.fillRect(x - 7, y - 5 + leftArmY, 3, 1.5);
    ctx.fillRect(x + 4, y - 5 + rightArmY, 3, 1.5);

    // Cổ & Khuôn mặt Chibi Anime nghiêng nhìn vào màn hình (Pinterest Pin Anime)
    this.drawChibiHead(ctx, x, y, _agent, frame, 'facing');

    ctx.restore();
  }

  /**
   * Dũng 2 ngồi ghế xoay trước bàn vẽ CAD & Blueprint, tay cầm thước T và chuột thiết kế
   */
  public static drawSittingArchitectAgent(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, _agent: Agent) {
    ctx.save();
    // 1. Chân sao 5 cánh & bánh xe
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 9, y + 8, 18, 2);
    ctx.fillRect(x - 2, y + 6, 4, 3);
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 10, y + 9, 3, 3);
    ctx.fillRect(x + 7, y + 9, 3, 3);

    // 2. Trục nâng & đệm ngồi
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x - 1.5, y + 2, 3, 5);
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.roundRect(x - 10, y - 4, 20, 8, 3);
    ctx.fill();

    // 3. Tựa lưng da cao cấp đỡ lưng
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.roundRect(x - 9, y - 16, 18, 12, 3);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 9, y - 16, 18, 12);

    // 4. Cơ thể Dũng 2:
    ctx.fillStyle = '#334155'; // Quần tây xám
    ctx.fillRect(x - 7, y - 4, 14, 6);
    ctx.fillStyle = '#451a03'; // Giày da nâu dưới gầm bàn
    ctx.fillRect(x - 5, y + 3, 4, 4);
    ctx.fillRect(x + 1, y + 3, 4, 4);

    // Com-lê xám lịch lãm 40 năm KN
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 7, y - 14, 14, 11);
    ctx.fillStyle = '#f8fafc'; // Sơ mi trắng
    ctx.fillRect(x - 3, y - 14, 6, 4);
    ctx.fillStyle = '#1e40af'; // Cà vạt navy
    ctx.fillRect(x - 1, y - 12, 2, 7);

    // Cánh tay trái cầm thước T trên bản vẽ blueprint
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 10, y - 13, 3, 6);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 9, y - 8, 4, 4);
    ctx.fillRect(x - 10, y - 5, 4, 3);
    // Thước kẻ cam
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x - 14, y - 6, 10, 2);

    // Cánh tay phải rê chuột CAD
    const mouseMove = Math.sin(frame * 0.2) > 0.7 ? 1 : 0;
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 7, y - 13, 3, 6);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x + 5, y - 8, 4, 4);
    ctx.fillRect(x + 4, y - 5, 4, 3);
    // Chuột quang cyan
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 5 + mouseMove, y - 4, 3, 4);

    // Cổ & Khuôn mặt Chibi Anime Dũng 2 (Pinterest Pin Anime)
    this.drawChibiHead(ctx, x, y, _agent, frame, 'thinking');

    ctx.restore();
  }

  /**
   * Dũng 4 ngồi ghế xoay trạm QA & Security, tay gõ phím chạy ma trận Stress Test 5,000 TPS
   */
  public static drawSittingQAAgent(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, _agent: Agent) {
    ctx.save();
    // 1. Chân sao & bánh xe
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 9, y + 8, 18, 2);
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 10, y + 9, 3, 3);
    ctx.fillRect(x + 7, y + 9, 3, 3);

    // 2. Trục nâng & đệm ngồi
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x - 1.5, y + 2, 3, 5);
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.roundRect(x - 10, y - 4, 20, 8, 3);
    ctx.fill();

    // 3. Tựa lưng ghế
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.roundRect(x - 9, y - 16, 18, 12, 3);
    ctx.fill();

    // 4. Cơ thể Dũng 4:
    ctx.fillStyle = '#334155'; // Quần tây xám
    ctx.fillRect(x - 7, y - 4, 14, 6);
    ctx.fillStyle = '#1e293b'; // Giày đen
    ctx.fillRect(x - 5, y + 3, 4, 4);
    ctx.fillRect(x + 1, y + 3, 4, 4);

    // Áo len xanh lá cổ tim
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(x - 7, y - 14, 14, 11);
    ctx.fillStyle = '#f8fafc'; // Cổ sơ mi trắng
    ctx.fillRect(x - 2, y - 14, 4, 2);
    // Thẻ QA vàng trên ngực
    ctx.fillStyle = '#eab308';
    ctx.fillRect(x - 1.5, y - 10, 3, 3);

    // Hai cánh tay gõ phím nhanh
    const typeFast = Math.sin(frame * 0.9) > 0 ? -1 : 1;
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(x - 10, y - 13, 3, 6);
    ctx.fillRect(x + 7, y - 13, 3, 6);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 8, y - 6 + typeFast, 4, 3);
    ctx.fillRect(x + 4, y - 6 - typeFast, 4, 3);

    // Cổ & Khuôn mặt Chibi Anime Dũng 4 (Pinterest Pin Anime)
    this.drawChibiHead(ctx, x, y, _agent, frame, 'facing');

    ctx.restore();
  }

  /**
   * Dũng 1 đứng thuyết trình tại đầu bàn họp Oval (Pinterest Pin C - 591730838527550441 & Pin Anime 1013309984899659354):
   * - Đứng oai phong ở vị trí đầu bàn (x: 695, y: 380)
   * - Một tay tì nhẹ mép bàn cạnh laptop, một tay vung ra chỉ đạo / thuyết trình
   * - Laptop bạc mở sẵn bài thuyết trình rực sáng, ly nước thủy tinh, bút trình chiếu
   */
  public static drawChibiPresenterBoardroom(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number,
    agent: Agent
  ) {
    ctx.save();

    // 1. Đổ bóng chân đứng vững chãi trên sàn
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(x, y + 10, 12, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Chân & Giày tây đen bóng
    ctx.fillStyle = '#1e293b'; // Quần tây navy sẫm
    ctx.fillRect(x - 6, y + 1, 4, 9);
    ctx.fillRect(x + 2, y + 1, 4, 9);
    ctx.fillStyle = '#090d16'; // Giày Oxford đen bóng
    ctx.fillRect(x - 7, y + 8, 5.5, 3.5);
    ctx.fillRect(x + 2, y + 8, 5.5, 3.5);

    // 3. Thân áo Vest Navy Giám đốc
    ctx.fillStyle = '#1d4ed8'; // Vest xanh Navy sang trọng
    ctx.fillRect(x - 7.5, y - 11, 15, 12);
    // Vạt áo sơ mi trắng & Cà vạt đỏ quyền lực
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x - 3, y - 11, 6, 5);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x - 1.2, y - 9, 2.4, 8);
    // Khuy áo vàng
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(x - 1, y - 2, 2, 2);

    // 4. Tay trái tì lên mép bàn họp cạnh laptop
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(x + 6, y - 9, 4, 6);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x + 7.5, y - 4, 4, 4);

    // 5. Tay phải giơ cao vung ra thuyết trình chiến lược (Presenter Gesturing Arm)
    const gestureAngle = Math.sin(frame * 0.1) * 3;
    ctx.save();
    ctx.translate(x - 7, y - 8);
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(-3, -2 + gestureAngle * 0.3, 4, 7);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-6, -6 + gestureAngle * 0.5, 4, 5);
    // Ngón tay trỏ chỉ về phía slide
    ctx.fillRect(-7, -8 + gestureAngle * 0.5, 2.5, 4);
    ctx.restore();

    // 6. Laptop bạc mở sẵn của Dũng 1 trên mép bàn họp
    const laptopX = x + 12;
    const laptopY = y - 6;
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(laptopX, laptopY + 4, 14, 2);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(laptopX + 1, laptopY - 7, 12, 11);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(laptopX + 2, laptopY - 6, 10, 9);
    // Biểu đồ cột mini trên màn hình thuyết trình
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(laptopX + 3, laptopY - 1, 2, 3);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(laptopX + 6, laptopY - 3, 2, 5);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(laptopX + 9, laptopY - 4, 2, 6);

    // 7. Khuôn mặt Chibi Anime Dũng 1
    this.drawChibiHead(ctx, x, y, agent, frame, 'presenting');

    ctx.restore();
  }

  /**
   * Dũng 2 ngồi họp tại bàn Boardroom phản biện & kiến trúc (Pinterest Pin C & Anime thinking pose 1013309984899659354):
   * - Ngồi ghế họp Cantilever nỉ xám chân mạ crom phía sau bàn oval (x: 765, y: 348)
   * - Dáng ngồi tư thế chống cằm trầm ngâm suy nghĩ (Thinking Hand-on-Chin pose chuẩn Anime pin 1013309984899659354)
   * - Tay còn lại đặt trên laptop gõ phản biện rủi ro hệ thống
   */
  public static drawChibiDebaterBoardroom(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number,
    agent: Agent
  ) {
    ctx.save();

    // 1. Tựa lưng ghế Cantilever phía sau
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(x - 11, y - 24, 22, 22, 3);
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 2. Thân người Dũng 2 ngồi sau bàn họp:
    ctx.fillStyle = '#475569'; // Com-lê xám kiến trúc sư
    ctx.fillRect(x - 7.5, y - 12, 15, 14);
    ctx.fillStyle = '#f8fafc'; // Cổ sơ mi trắng
    ctx.fillRect(x - 3, y - 12, 6, 4);
    ctx.fillStyle = '#1e40af'; // Cà vạt navy
    ctx.fillRect(x - 1.2, y - 10, 2.4, 7);

    // 3. Tay phải đặt lên bàn thao tác laptop
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 5, y - 9, 4, 6);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x + 4, y - 4, 5, 4);

    // 4. Tay trái CHỐNG CẰM SUY NGHĨ (Anime Thinking Hand-on-Chin Pose)
    // Cùi chỏ tì lên mặt bàn, cẳng tay gập lên đỡ cằm
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 9, y - 8, 4, 7);
    ctx.fillStyle = '#fed7aa';
    // Bàn tay Chibi khum lại đỡ cằm dưới khuôn mặt
    ctx.beginPath();
    ctx.arc(x - 5, y - 11, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 5. Laptop bạc mở trước mặt Dũng 2
    const lapX = x + 4;
    const lapY = y - 5;
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(lapX, lapY + 3, 14, 2);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(lapX + 1, lapY - 7, 12, 10);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(lapX + 2, lapY - 6, 10, 8);
    // Dòng code kiến trúc xanh lơ
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(lapX + 3, lapY - 4, 7, 1.5);
    ctx.fillRect(lapX + 3, lapY - 1.5, 5, 1.5);

    // 6. Khuôn mặt Chibi Anime Dũng 2
    this.drawChibiHead(ctx, x, y, agent, frame, 'thinking');

    ctx.restore();
  }

  /**
   * Ngồi họp thảo luận chiến lược tại bàn Boardroom (cho các agent khác hoặc dự phòng)
   */
  public static drawSittingBoardroomAgent(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number,
    agent: Agent,
    isLeftSpeaker: boolean
  ) {
    if (isLeftSpeaker) {
      this.drawChibiPresenterBoardroom(ctx, x, y, frame, agent);
    } else {
      this.drawChibiDebaterBoardroom(ctx, x, y, frame, agent);
    }
  }

  /**
   * Vẽ khuôn mặt Chibi Anime 100% chuẩn Pinterest (pin_1013309984899659354):
   * - Tỉ lệ Chibi mắt to long lanh, má bánh bao ửng hồng (Rosy Blush)
   * - Mắt 2 điểm sáng catchlight lấp lánh (Dual Specular Highlights)
   * - Kiểu tóc Anime đặc trưng, biểu cảm nháy mắt, nói chuyện sinh động
   */
  public static drawChibiHead(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    agent: Agent,
    frame: number,
    pose: 'facing' | 'look_right' | 'look_left' | 'presenting' | 'thinking' = 'facing'
  ) {
    ctx.save();

    // 1. Cổ & Cằm bánh bao Chibi
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 2.5, y - 13, 5, 4);

    // Khuôn mặt Chibi bo tròn mềm mại
    ctx.fillStyle = '#ffedd5';
    ctx.beginPath();
    ctx.roundRect(x - 8.5, y - 24, 17, 14, 6);
    ctx.fill();

    // Má hồng Chibi siêu dễ thương (Rosy Blush Ovals)
    ctx.fillStyle = 'rgba(251, 113, 133, 0.45)';
    ctx.beginPath();
    ctx.ellipse(x - 5.5, y - 14.5, 2.8, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 5.5, y - 14.5, 2.8, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Mắt Anime long lanh (Sparkling Anime Eyes)
    // Tính toán chớp mắt tự nhiên
    const isBlinking = Math.floor(frame / 60) % 8 === 0 && (frame % 60) < 5;

    let eyeLX = x - 5;
    let eyeRX = x + 2.5;
    if (pose === 'look_right' || pose === 'presenting') {
      eyeLX = x - 3.5;
      eyeRX = x + 3.5;
    } else if (pose === 'look_left' || pose === 'thinking') {
      eyeLX = x - 4.5;
      eyeRX = x + 2.5;
    }

    if (isBlinking) {
      // Mắt cười híp cong ^ ^
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(eyeLX + 1.5, y - 18, 2, Math.PI * 0.9, Math.PI * 0.1, true);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(eyeRX + 1.5, y - 18, 2, Math.PI * 0.9, Math.PI * 0.1, true);
      ctx.stroke();
    } else {
      // Viền mi trên đậm chất Anime
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(eyeLX, y - 20, 3.5, 1.2);
      ctx.fillRect(eyeRX, y - 20, 3.5, 1.2);

      // Tròng mắt Anime to tròn có màu chủ đạo
      const irisColor = agent.code === 'dung_1' ? '#1e3a8a' : agent.code === 'dung_2' ? '#334155' : agent.code === 'dung_3' ? '#0369a1' : '#15803d';
      ctx.fillStyle = irisColor;
      ctx.beginPath();
      ctx.ellipse(eyeLX + 1.6, y - 17.5, 1.8, 2.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(eyeRX + 1.6, y - 17.5, 1.8, 2.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Đồng tử đen sâu thẳm
      ctx.fillStyle = '#020617';
      ctx.fillRect(eyeLX + 1, y - 18.5, 1.5, 2);
      ctx.fillRect(eyeRX + 1, y - 18.5, 1.5, 2);

      // ĐIỂM SÁNG 1 (Primary Catchlight): Đốm sáng trắng to tròn góc trên trái
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eyeLX + 1, y - 18.5, 1.2, 0, Math.PI * 2);
      ctx.arc(eyeRX + 1, y - 18.5, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // ĐIỂM SÁNG 2 (Secondary Catchlight): Đốm sáng nhỏ phản chiếu góc dưới phải chuẩn Anime
      ctx.beginPath();
      ctx.arc(eyeLX + 2.4, y - 16.5, 0.6, 0, Math.PI * 2);
      ctx.arc(eyeRX + 2.4, y - 16.5, 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Lông mày Anime tinh tế
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (pose === 'thinking') {
      ctx.moveTo(eyeLX - 0.5, y - 21.5);
      ctx.lineTo(eyeLX + 3.5, y - 22.5);
      ctx.moveTo(eyeRX, y - 22.5);
      ctx.lineTo(eyeRX + 4, y - 22);
    } else {
      ctx.moveTo(eyeLX, y - 22);
      ctx.lineTo(eyeLX + 3.5, y - 22);
      ctx.moveTo(eyeRX, y - 22);
      ctx.lineTo(eyeRX + 3.5, y - 22);
    }
    ctx.stroke();

    // 4. Miệng Chibi biểu cảm
    const isTalking = pose === 'presenting' || (agent.status === 'debating' && Math.floor(frame / 6) % 2 === 0);
    if (isTalking) {
      // Miệng cười mở to phát biểu có lưỡi hồng
      ctx.fillStyle = '#881337';
      ctx.beginPath();
      ctx.ellipse(x, y - 13.5, 2.2, 2, 0, 0, Math.PI);
      ctx.fill();
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.arc(x, y - 12.8, 1.2, 0, Math.PI);
      ctx.fill();
    } else if (pose === 'thinking') {
      // Miệng nhỏ trầm ngâm
      ctx.fillStyle = '#9f1239';
      ctx.fillRect(x - 1, y - 13.5, 2, 1);
    } else {
      // Miệng cười mỉm nhẹ nhàng
      ctx.strokeStyle = '#9f1239';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y - 14.5, 2, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
    }

    // 5. Tóc Anime & Phụ kiện riêng biệt theo từng nhân vật
    if (agent.code === 'dung_1') {
      // DŨNG 1: Tóc đen Anime vuốt sang bên + Cọng tóc Ahoge ngộ nghĩnh trên đỉnh đầu
      ctx.fillStyle = '#090d16';
      // Mái tóc phủ trán chia lọn Anime
      ctx.beginPath();
      ctx.moveTo(x - 9, y - 21);
      ctx.lineTo(x - 9.5, y - 27);
      ctx.lineTo(x, y - 29);
      ctx.lineTo(x + 9.5, y - 27);
      ctx.lineTo(x + 9, y - 21);
      ctx.lineTo(x + 6, y - 22);
      ctx.lineTo(x + 3, y - 19.5); // Lọn tóc mái nhọn
      ctx.lineTo(x + 1, y - 23);
      ctx.lineTo(x - 2, y - 19);   // Lọn tóc mái giữa
      ctx.lineTo(x - 4, y - 22.5);
      ctx.lineTo(x - 7, y - 20);
      ctx.closePath();
      ctx.fill();

      // Cọng tóc Ahoge uốn lượn đung đưa trên đỉnh đầu (Anime Cowlick)
      const ahogeSway = Math.sin(frame * 0.15) * 1.5;
      ctx.strokeStyle = '#090d16';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y - 28.5);
      ctx.quadraticCurveTo(x + 2 + ahogeSway, y - 34, x + 5 + ahogeSway, y - 32);
      ctx.stroke();

    } else if (agent.code === 'dung_2') {
      // DŨNG 2: Mái tóc Anime muối tiêu rẽ ngôi lịch lãm + Kính tròn trí thức mạ vàng
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(x - 9, y - 21);
      ctx.lineTo(x - 9.5, y - 27);
      ctx.lineTo(x - 2, y - 29);
      ctx.lineTo(x + 9.5, y - 26);
      ctx.lineTo(x + 9, y - 20);
      ctx.lineTo(x + 5, y - 22);
      ctx.lineTo(x + 1, y - 20);
      ctx.lineTo(x - 3, y - 23);
      ctx.lineTo(x - 7, y - 20.5);
      ctx.closePath();
      ctx.fill();
      // Highlight tóc bạc ánh kim
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(x - 6, y - 27, 4, 1.5);
      ctx.fillRect(x + 2, y - 26, 4, 1.5);

      // Kính tròn gọng vàng tri thức (Wire-rim Golden Glasses)
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(eyeLX + 1.5, y - 17.5, 3.2, 0, Math.PI * 2);
      ctx.arc(eyeRX + 1.5, y - 17.5, 3.2, 0, Math.PI * 2);
      ctx.stroke();
      // Cầu nối kính
      ctx.beginPath();
      ctx.moveTo(eyeLX + 4.5, y - 17.5);
      ctx.lineTo(eyeRX - 1.5, y - 17.5);
      ctx.stroke();

    } else if (agent.code === 'dung_3') {
      // DŨNG 3: Mái tóc Anime gai nhọn (Spiky Anime Hair) + Tai nghe Gaming Cyan
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.moveTo(x - 9, y - 20);
      ctx.lineTo(x - 11, y - 25);
      ctx.lineTo(x - 7, y - 26);
      ctx.lineTo(x - 5, y - 30); // Đỉnh gai 1
      ctx.lineTo(x - 1, y - 26.5);
      ctx.lineTo(x + 2, y - 31);  // Đỉnh gai 2
      ctx.lineTo(x + 5, y - 26.5);
      ctx.lineTo(x + 9, y - 28);  // Đỉnh gai 3
      ctx.lineTo(x + 9, y - 20);
      ctx.lineTo(x + 6, y - 22);
      ctx.lineTo(x + 2, y - 19.5);
      ctx.lineTo(x - 1, y - 22);
      ctx.lineTo(x - 5, y - 19.5);
      ctx.closePath();
      ctx.fill();

      // Tai nghe Gaming over-ear màu Cyan viền bạc
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(x - 10.5, y - 21, 3.5, 7, 2);
      ctx.roundRect(x + 7, y - 21, 3.5, 7, 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(x - 9.5, y - 19, 1.5, 3);
      ctx.fillRect(x + 8, y - 19, 1.5, 3);
      // Vành kim loại vắt qua đỉnh đầu
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(x, y - 24, 7.5, Math.PI, 0);
      ctx.stroke();

    } else {
      // DŨNG 4: Mũ len Beanie đỏ rực rỡ + Lọn tóc Anime đen nhánh lộ ra ngoài
      // Lọn tóc mái
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x - 7, y - 21, 4, 3);
      ctx.fillRect(x + 3, y - 21, 4, 3);

      // Thân mũ beanie đỏ phong cách Streetwear
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.roundRect(x - 9.5, y - 30, 19, 9, [7, 7, 2, 2]);
      ctx.fill();
      // Vành mũ gập lên màu đỏ tươi
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.roundRect(x - 10, y - 24, 20, 4, 2);
      ctx.fill();
      // Quả bông nhỏ trên chóp mũ
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(x, y - 30.5, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Dũng 1 ngồi lún sâu vào đệm sofa nỉ Royal Blue, tay cầm tách cà phê nóng có khói bốc lên
   */
  public static drawSittingSofaDirector(ctx: CanvasRenderingContext2D, x: number, y: number, _frame: number, _agent: Agent) {
    ctx.save();
    // 1. Chân gập 90 độ buông xuống thảm sọc xanh
    ctx.fillStyle = '#334155'; // Quần tây xám đậm
    ctx.fillRect(x - 6, y + 4, 4, 7);
    ctx.fillRect(x + 2, y + 4, 4, 7);
    // Giày da bóng màu đen đặt trên thảm
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 7, y + 10, 5, 3);
    ctx.fillRect(x + 2, y + 10, 5, 3);

    // 2. Đùi đặt nằm ngang trên mặt đệm sofa (Thighs on Sofa Cushion)
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 7, y - 2, 14, 7);

    // 3. Thân áo vest Giám đốc tựa lưng vào thành sofa
    ctx.fillStyle = '#1e3a8a'; // Vest navy
    ctx.fillRect(x - 8, y - 14, 16, 13);
    ctx.fillStyle = '#f8fafc'; // Sơ mi trắng
    ctx.fillRect(x - 3, y - 14, 6, 4);
    ctx.fillStyle = '#dc2626'; // Cà vạt đỏ quyền lực
    ctx.fillRect(x - 1, y - 11, 2, 7);

    // 4. Tay trái gác thoải mái lên thành tựa sofa
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(x - 11, y - 13, 4, 6);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 12, y - 8, 4, 3);

    // 5. Tay phải cầm tách cà phê sứ trắng bốc khói
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(x + 7, y - 13, 4, 6);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x + 7, y - 7, 4, 3); // Bàn tay cầm tách
    // Tách cà phê gốm trắng
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x + 9, y - 9, 6, 5);
    ctx.fillStyle = '#451a03'; // Nước cà phê
    ctx.fillRect(x + 10, y - 8, 4, 1.5);
    // Khói cà phê bốc lên nhẹ nhàng
    this.drawCoffeeSteam(ctx, x + 12, y - 10);

    // 6. Khuôn mặt Chibi Anime Giám đốc thư thái (Pinterest Pin Anime)
    this.drawChibiHead(ctx, x, y, _agent, _frame, 'facing');

    ctx.restore();
  }

  /**
   * Đứng giải lao tại khu vực Pantry, 2 tay nâng tách cà phê thưởng thức
   */
  public static drawStandingPantryAgent(ctx: CanvasRenderingContext2D, x: number, y: number, _frame: number, agent: Agent) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x, y + 10, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2 Chân đứng thẳng
    ctx.fillStyle = agent.code === 'dung_3' ? '#1e3a8a' : '#334155';
    ctx.fillRect(x - 6, y + 2, 4, 8);
    ctx.fillRect(x + 2, y + 2, 4, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 7, y + 8, 5, 3);
    ctx.fillRect(x + 2, y + 8, 5, 3);

    // Thân áo
    this.drawAgentTorso(ctx, x, y, agent);

    // 2 Tay cầm tách cà phê trước ngực
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 4, y - 6, 3, 4);
    ctx.fillRect(x + 1, y - 6, 3, 4);
    // Tách cà phê gốm trắng
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x - 3, y - 8, 6, 5);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x - 2, y - 7, 4, 1.5);
    this.drawCoffeeSteam(ctx, x, y - 9);

    // Khuôn mặt & tóc
    this.drawAgentHead(ctx, x, y, agent);

    ctx.restore();
  }

  /**
   * Đi bộ với chu kỳ 4 khung hình, hai chân & tay đánh nhịp nhàng, lật hướng trái/phải
   */
  public static drawWalkingAgent(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number,
    agent: Agent,
    facingLeft: boolean
  ) {
    ctx.save();

    const walkBob = Math.abs(Math.sin(frame * 0.25)) * 2;
    const charY = y - walkBob;

    const shadowScale = 1 - walkBob * 0.08;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x, y + 10, 11 * shadowScale, 4 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    if (facingLeft) {
      ctx.translate(x, 0);
      ctx.scale(-1, 1);
      ctx.translate(-x, 0);
    }

    const cycle = Math.floor((frame / 8) % 4);
    const legSwing = cycle === 0 ? -3 : cycle === 2 ? 3 : 0;

    // Chân & Giày
    ctx.fillStyle = agent.code === 'dung_3' ? '#1e3a8a' : '#334155';
    ctx.fillRect(x - 6, charY + 3 - legSwing, 4, 6 + legSwing);
    ctx.fillRect(x + 2, charY + 3 + legSwing, 4, 6 - legSwing);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 7, charY + 8 - legSwing, 5, 3);
    ctx.fillRect(x + 2, charY + 8 + legSwing, 5, 3);

    // Thân áo
    this.drawAgentTorso(ctx, x, charY, agent);

    // 2 Tay vung theo nhịp bước
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 10, charY - 6 + legSwing, 3, 6);
    ctx.fillRect(x + 7, charY - 6 - legSwing, 3, 6);

    // Khuôn mặt & Tóc
    this.drawAgentHead(ctx, x, charY, agent);

    ctx.restore();
  }

  /**
   * Đứng nghỉ ngơi (Idle)
   */
  public static drawIdleStandingAgent(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, agent: Agent) {
    ctx.save();
    const breath = Math.sin(frame * 0.06) * 0.5;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x, y + 10, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2 Chân thẳng
    ctx.fillStyle = agent.code === 'dung_3' ? '#1e3a8a' : '#334155';
    ctx.fillRect(x - 6, y + 2, 4, 8);
    ctx.fillRect(x + 2, y + 2, 4, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 7, y + 8, 5, 3);
    ctx.fillRect(x + 2, y + 8, 5, 3);

    // Thân áo
    this.drawAgentTorso(ctx, x, y - breath, agent);

    // 2 Tay buông nhẹ
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 10, y - 6, 3, 7);
    ctx.fillRect(x + 7, y - 6, 3, 7);

    // Khuôn mặt & Tóc
    this.drawAgentHead(ctx, x, y - breath, agent);

    ctx.restore();
  }

  /**
   * Vẽ thân áo đặc trưng cho từng Dũng
   */
  public static drawAgentTorso(ctx: CanvasRenderingContext2D, x: number, y: number, agent: Agent) {
    if (agent.code === 'dung_1') {
      ctx.fillStyle = '#1e3a8a'; // Vest navy Giám đốc
      ctx.fillRect(x - 7, y - 9, 14, 11);
      ctx.fillStyle = '#f8fafc'; // Sơ mi trắng chữ V
      ctx.fillRect(x - 3, y - 9, 6, 4);
      ctx.fillStyle = '#dc2626'; // Cà vạt đỏ
      ctx.fillRect(x - 1, y - 7, 2, 7);
    } else if (agent.code === 'dung_2') {
      ctx.fillStyle = '#475569'; // Com-lê xám
      ctx.fillRect(x - 7, y - 9, 14, 11);
      ctx.fillStyle = '#f8fafc'; // Sơ mi trắng
      ctx.fillRect(x - 3, y - 9, 6, 4);
      ctx.fillStyle = '#1e40af'; // Cà vạt navy
      ctx.fillRect(x - 1, y - 7, 2, 7);
    } else if (agent.code === 'dung_3') {
      ctx.fillStyle = '#0f172a'; // Áo thun tech đen
      ctx.fillRect(x - 7, y - 9, 14, 11);
      ctx.fillStyle = '#38bdf8'; // Logo cyan
      ctx.fillRect(x - 2, y - 4, 4, 2);
    } else {
      ctx.fillStyle = '#16a34a'; // Áo len xanh lá QA
      ctx.fillRect(x - 7, y - 9, 14, 11);
      ctx.fillStyle = '#f8fafc'; // Cổ sơ mi
      ctx.fillRect(x - 2, y - 9, 4, 2);
      ctx.fillStyle = '#eab308'; // Thẻ QA vàng
      ctx.fillRect(x - 1.5, y - 5, 3, 3);
    }
  }

  /**
   * Vẽ khuôn mặt Chibi Anime đồng bộ cho 4 Dũng theo chuẩn Pinterest (pin_1013309984899659354)
   */
  public static drawAgentHead(ctx: CanvasRenderingContext2D, x: number, y: number, agent: Agent) {
    this.drawChibiHead(ctx, x, y, agent, 0, 'facing');
  }

  /**
   * Bong bóng hành động / suy nghĩ chuẩn phong cách Fallout Shelter Vault Action Bubbles
   */
  public static drawFalloutThoughtBubble(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    agent: Agent,
    frame: number
  ) {
    // Độ nhấp nhô nhẹ nhàng (Floating Bob)
    const bob = Math.sin(frame * 0.09) * 2;
    const bubbleY = y + bob;

    let text = '';
    let icon = '';
    let borderColor = '#38bdf8';
    let bgColor = 'rgba(15, 23, 42, 0.92)';
    let textColor = '#f8fafc';

    if (agent.status === 'debating') {
      if (agent.code === 'dung_1') {
        text = 'Thị trường & Vận hành';
        icon = '🗣️';
        borderColor = '#f59e0b';
        textColor = '#fef08a';
      } else if (agent.code === 'dung_2') {
        text = 'Kiến trúc & Rủi ro PM';
        icon = '⚡';
        borderColor = '#c084fc';
        textColor = '#f3e8ff';
      } else if (agent.code === 'dung_3') {
        text = 'Khả thi PWA & Code';
        icon = '💻';
        borderColor = '#10b981';
        textColor = '#6ee7b7';
      } else {
        text = 'Cảnh báo Hack & Test';
        icon = '🛡️';
        borderColor = '#f43f5e';
        textColor = '#fca5a5';
      }
    } else if (agent.status === 'coding') {
      text = 'Clean Code API';
      icon = '⚡';
      borderColor = '#10b981';
      textColor = '#6ee7b7';
    } else if (agent.status === 'testing') {
      text = 'Stress Test 5K TPS';
      icon = '🎯';
      borderColor = '#ef4444';
      textColor = '#fca5a5';
    } else if (agent.status === 'resting') {
      text = 'Cà phê giải lao';
      icon = '☕';
      borderColor = '#f59e0b';
      textColor = '#fef08a';
    } else if (agent.status === 'moving') {
      text = 'Di chuyển...';
      icon = '🚶';
      borderColor = '#64748b';
      textColor = '#cbd5e1';
    } else {
      // Khi đang ngồi làm việc tại bàn làm việc của mình
      if (agent.code === 'dung_1' && agent.current_room === 'director_office') {
        text = 'Chỉ đạo & Chiến lược';
        icon = '👔';
        borderColor = '#38bdf8';
        textColor = '#bae6fd';
      } else if (agent.code === 'dung_2' && agent.current_room === 'architect_office') {
        text = 'Thiết kế CAD & PM';
        icon = '📐';
        borderColor = '#c084fc';
        textColor = '#f3e8ff';
      } else {
        return;
      }
    }

    const isDebating = agent.status === 'debating';
    const displayText = `${icon} ${text}`;
    const extraPad = isDebating ? 24 : 0;
    const w = Math.min(160, displayText.length * 5.6 + 18 + extraPad);
    const h = 16;

    // Hộp bong bóng thoại bo góc mềm mại
    ctx.save();
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, bubbleY - h - 14, w, h, 4);
    ctx.fill();

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = isDebating ? 1.5 : 1;
    if (isDebating) {
      ctx.shadowColor = borderColor;
      ctx.shadowBlur = 8;
    }
    ctx.beginPath();
    ctx.roundRect(x - w / 2, bubbleY - h - 14, w, h, 4);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Mũi tên chỉ xuống nhẹ
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.moveTo(x - 3, bubbleY - 14);
    ctx.lineTo(x + 3, bubbleY - 14);
    ctx.lineTo(x, bubbleY - 11);
    ctx.closePath();
    ctx.fill();

    // Icon & Text sắc nét
    ctx.fillStyle = textColor;
    ctx.font = 'bold 7.5px "JetBrains Mono", monospace';
    ctx.textAlign = isDebating ? 'left' : 'center';
    const textX = isDebating ? x - w / 2 + 6 : x;
    ctx.fillText(displayText, textX, bubbleY - 18);

    // HOẠT ẢNH SÓNG ÂM THOẠI ĐỘNG (ANIMATED VOICE WAVE BARS) KHI ĐANG TRANH LUẬN
    if (isDebating) {
      const barX = x + w / 2 - 16;
      const barY = bubbleY - h / 2 - 14;
      const offset = agent.code === 'dung_1' ? 0 : agent.code === 'dung_2' ? 1.2 : agent.code === 'dung_3' ? 2.4 : 3.6;
      const h1 = 2 + Math.abs(Math.sin(frame * 0.25 + offset)) * 6;
      const h2 = 2 + Math.abs(Math.sin(frame * 0.32 + offset + 1.2)) * 8;
      const h3 = 2 + Math.abs(Math.sin(frame * 0.28 + offset + 2.4)) * 6;

      ctx.fillStyle = borderColor;
      ctx.fillRect(barX, barY - h1 / 2, 1.8, h1);
      ctx.fillRect(barX + 3.2, barY - h2 / 2, 1.8, h2);
      ctx.fillRect(barX + 6.4, barY - h3 / 2, 1.8, h3);
    }

    ctx.restore();
  }

  /**
   * 4. Lớp phủ Camera an ninh (CCTV REC Overlay) chuẩn Agent-Pixels
   */
  public static drawCameraOverlay(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    cameraName: string,
    showScanlines: boolean
  ) {
    // Scanlines Retro CRT
    if (showScanlines) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      for (let y = 0; y < height; y += 3) {
        ctx.fillRect(0, y, width, 1.5);
      }
    }

    // Khung 4 góc ngắm Camera an ninh (CCTV Viewfinder Corners)
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2.5;
    const cornerSize = 16;
    const pad = 12;

    // Góc trên trái
    ctx.beginPath();
    ctx.moveTo(pad, pad + cornerSize);
    ctx.lineTo(pad, pad);
    ctx.lineTo(pad + cornerSize, pad);
    ctx.stroke();

    // Góc trên phải
    ctx.beginPath();
    ctx.moveTo(width - pad - cornerSize, pad);
    ctx.lineTo(width - pad, pad);
    ctx.lineTo(width - pad, pad + cornerSize);
    ctx.stroke();

    // Góc dưới trái
    ctx.beginPath();
    ctx.moveTo(pad, height - pad - cornerSize);
    ctx.lineTo(pad, height - pad);
    ctx.lineTo(pad + cornerSize, height - pad);
    ctx.stroke();

    // Góc dưới phải
    ctx.beginPath();
    ctx.moveTo(width - pad - cornerSize, height - pad);
    ctx.lineTo(width - pad, height - pad);
    ctx.lineTo(width - pad, height - pad - cornerSize);
    ctx.stroke();

    // Huy hiệu REC nhấp nháy đỏ
    const isBlink = Math.floor(Date.now() / 600) % 2 === 0;
    if (isBlink) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(pad + 12, pad + 12, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('REC', pad + 24, pad + 16);

    // Tên Camera an ninh hiện tại
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(pad + 65, pad + 3, cameraName.length * 7 + 16, 20);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1;
    ctx.strokeRect(pad + 65, pad + 3, cameraName.length * 7 + 16, 20);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText(`CAM: ${cameraName.toUpperCase()}`, pad + 72, pad + 17);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // CÁC MODULE HIỆU ỨNG TƯƠNG LAI & ANIMATION A.I. CHO THÁP CÔNG NGHỆ 4 TẦNG
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * 1. Rooftop 3D Holographic AI Quantum Core (Lõi AI Lượng Tử Nóc Tòa Tháp)
   */
  public static drawRooftopAIQuantumCore(ctx: CanvasRenderingContext2D, frame: number) {
    const cx = 397;
    const cy = 120;
    const time = frame * 0.03;

    ctx.save();

    // Sóng xung năng lượng (Pulsing Energy Shockwaves)
    const waveCount = 3;
    for (let w = 0; w < waveCount; w++) {
      const phase = ((frame * 0.015 + w / waveCount) % 1);
      const r = 25 + phase * 95;
      const alpha = (1 - phase) * 0.45;
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Vành đai quỹ đạo Hologram 1 (Tilt 35°)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(time * 0.6);
    ctx.scale(1, 0.42);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.stroke();

    // Hạt photon quay trên vành đai 1
    const p1x = Math.cos(time * 2) * 48;
    const p1y = Math.sin(time * 2) * 48;
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(p1x, p1y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Vành đai quỹ đạo Hologram 2 (Tilt -35°, quay ngược chiều)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-time * 0.8);
    ctx.scale(1, 0.42);
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 58, 0, Math.PI * 2);
    ctx.stroke();

    // Hạt photon tím quay trên vành đai 2
    const p2x = Math.cos(-time * 2.2) * 58;
    const p2y = Math.sin(-time * 2.2) * 58;
    ctx.fillStyle = '#c084fc';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(p2x, p2y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Khối bát diện 3D Lượng Tử (Rotating 3D Quantum Octahedron Wireframe)
    const size = 20;
    const rot = time * 1.2;
    const topV = { x: 0, y: -size * 1.3 };
    const botV = { x: 0, y: size * 1.3 };
    const midV: { x: number; y: number }[] = [];
    for (let i = 0; i < 4; i++) {
      const angle = rot + (i * Math.PI) / 2;
      midV.push({
        x: Math.cos(angle) * size * 1.4,
        y: Math.sin(angle) * size * 0.6,
      });
    }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.9)';
    ctx.lineWidth = 1.6;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 15;

    // Cạnh nối đỉnh trên và đáy
    for (let i = 0; i < 4; i++) {
      const m = midV[i];
      const nextM = midV[(i + 1) % 4];
      ctx.beginPath();
      ctx.moveTo(topV.x, topV.y);
      ctx.lineTo(m.x, m.y);
      ctx.lineTo(botV.x, botV.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(nextM.x, nextM.y);
      ctx.stroke();
    }

    // Tâm phát sáng Neon Core
    const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 18);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.9)');
    coreGrad.addColorStop(0.7, 'rgba(168, 85, 247, 0.4)');
    coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Banner HUD Công nghệ tương lai trên đỉnh tháp
    const title = '✦ AI 4 DŨNG • QUANTUM NEXUS ✦';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    const tw = ctx.measureText(title).width + 24;
    ctx.fillStyle = 'rgba(10, 14, 23, 0.85)';
    ctx.beginPath();
    ctx.roundRect(cx - tw / 2, 38, tw, 22, 6);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(cx - tw / 2, 38, tw, 22, 6);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.fillText(title, cx, 53);

    ctx.restore();
  }

  /**
   * 2. Buồng Thang Máy Capsule Kính Tương Lai (Futuristic Glass Capsule Elevator)
   */
  public static drawCapsuleElevator(ctx: CanvasRenderingContext2D, frame: number) {
    const shaftX = 482; // Bên phải trục lõi kính trung tâm
    const topY = 360;
    const botY = 945;

    ctx.save();

    // Ray trượt laser trục thang máy
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(shaftX - 10, topY);
    ctx.lineTo(shaftX - 10, botY + 20);
    ctx.moveTo(shaftX + 10, topY);
    ctx.lineTo(shaftX + 10, botY + 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Tọa độ chuyển động êm của buồng thang máy capsule
    const cycle = (Math.sin(frame * 0.012) + 1) / 2;
    const cabinY = topY + 20 + cycle * (botY - topY - 50);

    // Xác định tầng hiện tại hiển thị LED
    let floorLabel = 'F1';
    if (cabinY < 450) floorLabel = 'F4';
    else if (cabinY < 640) floorLabel = 'F3';
    else if (cabinY < 830) floorLabel = 'F2';

    // Thân buồng capsule kính
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.beginPath();
    ctx.roundRect(shaftX - 11, cabinY - 18, 22, 36, 10);
    ctx.fill();

    // Viền kính phát sáng
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(shaftX - 11, cabinY - 18, 22, 36, 10);
    ctx.stroke();

    // Cửa kính trong suốt & ánh sáng nội thất ấm áp
    ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
    ctx.fillRect(shaftX - 7, cabinY - 11, 14, 22);

    // Đèn LED chỉ thị tầng
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 6;
    ctx.font = 'bold 7px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(floorLabel, shaftX, cabinY + 2);

    // Tia sáng dẫn hướng dưới đáy thang máy
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(shaftX, cabinY + 18);
    ctx.lineTo(shaftX, cabinY + 28);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * 3. Hologram và Màn hình công nghệ cao tại 4 Tầng
   */
  public static drawHolographicFloorElements(ctx: CanvasRenderingContext2D, frame: number) {
    ctx.save();

    // ── TẦNG 4: Quả địa cầu chiến lược Hologram bên cạnh Dũng 1 ──
    const gX = 310;
    const gY = 370;
    ctx.save();
    ctx.translate(gX, gY);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.stroke();
    // Vĩ tuyến xoay
    const gRot = frame * 0.04;
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.abs(Math.sin(gRot)) * 14, 14, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Vòng phát sáng
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ── TẦNG 3: Hologram Microservices DAG trên bàn tròn Dũng 2 ──
    const t3X = 395;
    const t3Y = 540;
    ctx.save();
    ctx.translate(t3X, t3Y);
    // Vòng tròn quét Hologram
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 11, 0, 0, Math.PI * 2);
    ctx.stroke();
    // 3 Node dịch vụ lơ lửng
    const nodeA = frame * 0.03;
    for (let i = 0; i < 3; i++) {
      const a = nodeA + (i * Math.PI * 2) / 3;
      const nx = Math.cos(a) * 22;
      const ny = Math.sin(a) * 9 - 6;
      ctx.fillStyle = i === 0 ? '#38bdf8' : i === 1 ? '#c084fc' : '#34d399';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(nx, ny, 2.8, 0, Math.PI * 2);
      ctx.fill();
      // Nối về tâm
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(nx, ny);
      ctx.stroke();
    }
    ctx.restore();

    // ── TẦNG 2: Matrix Code Rain tại Dev Lab Dũng 3 ──
    const mX = 295;
    const mY = 705;
    ctx.save();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.85)';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 6;
    ctx.font = 'bold 6.5px "JetBrains Mono", monospace';
    const glyphs = ['1', '0', 'λ', '{', '}', ';', '=>', 'OK'];
    for (let c = 0; c < 4; c++) {
      const colX = mX + c * 10;
      const offset = Math.floor((frame * 0.15 + c * 3) % glyphs.length);
      for (let r = 0; r < 3; r++) {
        const glyph = glyphs[(offset + r) % glyphs.length];
        const alpha = 0.3 + (r / 2) * 0.65;
        ctx.fillStyle = `rgba(52, 211, 153, ${alpha})`;
        ctx.fillText(glyph, colX, mY + r * 9);
      }
    }
    ctx.restore();

    // ── TẦNG 1: Radar quét an ninh 360° tại trạm QA Dũng 4 ──
    const rX = 320;
    const rY = 925;
    ctx.save();
    ctx.translate(rX, rY);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.55)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.stroke();
    // Tia quét radar
    const radarAngle = frame * 0.05;
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.85)';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(radarAngle) * 16, Math.sin(radarAngle) * 16);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  /**
   * 4. Luồng Tia Sáng Dữ Liệu Photon Nối Giữa Các Tầng (Neural Data Streams)
   */
  public static drawNeuralDataStreams(ctx: CanvasRenderingContext2D, frame: number) {
    ctx.save();
    const coreX = 395;
    const startY = 385;
    const endY = 940;

    // Đường truyền dữ liệu trục trung tâm
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(coreX, startY);
    ctx.lineTo(coreX, endY);
    ctx.stroke();

    // Hạt photon xung dữ liệu chạy dọc trục (Data pulse photons)
    const pulseCount = 4;
    for (let p = 0; p < pulseCount; p++) {
      const prog = ((frame * 0.02 + p / pulseCount) % 1);
      const py = startY + prog * (endY - startY);
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(coreX, py, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Đuôi sáng hạt photon (light trail)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(coreX, py);
      ctx.lineTo(coreX, py - 12);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * 5. Hạt nano công nghệ lơ lửng trong không khí (Ambient Cyber Nano-Particles)
   */
  public static drawCyberParticles(ctx: CanvasRenderingContext2D, frame: number) {
    ctx.save();
    const count = 30;
    for (let i = 0; i < count; i++) {
      const seed = i * 137.5;
      const x = 180 + ((seed * 7.3 + frame * 0.3) % 1100);
      const y = 80 + ((seed * 11.7 + frame * 0.2) % 650);
      const alpha = 0.2 + 0.45 * Math.sin(frame * 0.03 + i);
      const size = 1 + (i % 3) * 0.7;

      ctx.fillStyle = i % 2 === 0 ? `rgba(56, 189, 248, ${alpha})` : `rgba(168, 85, 247, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * 6. Đại lộ xe cao tốc Cyberpunk ngoài cửa sổ kính (Outside Window Highway Traffic)
   * KHẮC PHỤC TRIỆT ĐỂ: Cắt mặt nạ kính (Window Clip), xe chạy đúng độ dốc mặt đường, KHÔNG BAO GIỜ XUYÊN TƯỜNG!
   */
  public static drawCyberWindowHighwayTraffic(ctx: CanvasRenderingContext2D, frame: number) {
    ctx.save();

    // ─────────────────────────────────────────────────────────────────────────
    // CẮT KHUNG KÍNH CỬA SỔ NGOÀI TRỜI: x: 650..1376, y: 35..560
    // TUYỆT ĐỐI KHÔNG BAO GIỜ XUYÊN QUA TƯỜNG HAY BÀN LÀM VIỆC BÊN TRONG!
    // ─────────────────────────────────────────────────────────────────────────
    ctx.beginPath();
    ctx.rect(650, 35, 726, 530);
    ctx.clip();

    // Viaduct dốc xuống theo góc nghiêng của đường thật trong ảnh:
    // Tại x = 655: y ≈ 310
    // Tại x = 1370: y ≈ 570 (độ dốc roadSlope = 0.36)
    const roadSlope = 0.36;
    const roadAngle = Math.atan2(roadSlope, 1);
    const highwayStartX = 655;
    const highwayWidth = 715;

    // Làn 1: Xe chạy xuôi dốc sang phải (vận tốc dương)
    const carsRight = [
      { speed: 2.6, offset: 0, color: '#38bdf8', len: 18, h: 5 },
      { speed: 3.2, offset: 180, color: '#facc15', len: 20, h: 6 },
      { speed: 2.3, offset: 360, color: '#ec4899', len: 16, h: 5 },
      { speed: 2.9, offset: 540, color: '#38bdf8', len: 19, h: 6 },
    ];

    carsRight.forEach(car => {
      const progress = (frame * car.speed + car.offset) % highwayWidth;
      const cx = highwayStartX + progress;
      const cy = 308 + progress * roadSlope;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(roadAngle);

      // Tia đèn pha chiếu rọi về phía trước theo hướng dốc đường
      const beamGrad = ctx.createLinearGradient(car.len, 0, car.len + 32, 0);
      beamGrad.addColorStop(0, 'rgba(224, 242, 254, 0.5)');
      beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(car.len, 1);
      ctx.lineTo(car.len + 32, -2);
      ctx.lineTo(car.len + 32, car.h + 2);
      ctx.lineTo(car.len, car.h - 1);
      ctx.closePath();
      ctx.fill();

      // Thân xe Cyber pod
      ctx.fillStyle = car.color;
      ctx.fillRect(0, 0, car.len, car.h);

      // Đèn hậu đỏ phát sáng kéo vệt
      ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
      ctx.fillRect(-3, 1, 3, car.h - 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.fillRect(-12, 1, 9, car.h - 2);

      ctx.restore();
    });

    // Làn 2: Xe chạy ngược dốc sang trái (làn dưới)
    const carsLeft = [
      { speed: 3.0, offset: 90, color: '#a855f7', len: 18, h: 5 },
      { speed: 2.4, offset: 270, color: '#10b981', len: 20, h: 6 },
      { speed: 3.3, offset: 460, color: '#38bdf8', len: 17, h: 5 },
    ];

    carsLeft.forEach(car => {
      const progress = (frame * car.speed + car.offset) % highwayWidth;
      const cx = highwayStartX + highwayWidth - progress;
      const cy = 322 + (highwayWidth - progress) * roadSlope;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(roadAngle);

      // Tia đèn pha chiếu về bên trái
      const beamGrad = ctx.createLinearGradient(0, 0, -32, 0);
      beamGrad.addColorStop(0, 'rgba(224, 242, 254, 0.5)');
      beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(0, 1);
      ctx.lineTo(-32, -2);
      ctx.lineTo(-32, car.h + 2);
      ctx.lineTo(0, car.h - 1);
      ctx.closePath();
      ctx.fill();

      // Thân xe
      ctx.fillStyle = car.color;
      ctx.fillRect(0, 0, car.len, car.h);

      // Đèn hậu đỏ bên phải
      ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
      ctx.fillRect(car.len, 1, 3, car.h - 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.fillRect(car.len + 3, 1, 9, car.h - 2);

      ctx.restore();
    });

    // Vòng cung cầu vượt bên phải (x: 930..1360, y: 415..465)
    const loopCars = [
      { tOffset: 0, color: '#38bdf8' },
      { tOffset: 0.35, color: '#facc15' },
      { tOffset: 0.70, color: '#ec4899' },
    ];

    loopCars.forEach(lc => {
      const t = ((frame * 0.006 + lc.tOffset) % 1);
      const lx = 930 + t * 430;
      const ly = 422 + Math.sin(t * Math.PI) * 26;

      ctx.fillStyle = lc.color;
      ctx.fillRect(lx, ly, 13, 5);

      ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.fillRect(lx - 4, ly + 1, 4, 3);
    });

    ctx.restore();
  }

  /**
   * 7. Xe bay tự hành tuần tra trên bầu trời Cyberpunk (Autonomous Flying Cars / Spinners)
   * Cắt mặt nạ vùng trời bên ngoài cửa sổ kính
   */
  public static drawAutonomousFlyingCars(ctx: CanvasRenderingContext2D, frame: number) {
    ctx.save();
    // Giới hạn tuyệt đối trong khoảng trời ngoài cửa sổ kính
    ctx.beginPath();
    ctx.rect(650, 35, 726, 250);
    ctx.clip();

    const skyStartX = 660;
    const skySpan = 690;

    const spinners = [
      { yBase: 90,  speed: 1.5, offset: 40,  dir: 1,  scale: 0.85, color: '#38bdf8' },
      { yBase: 135, speed: 2.1, offset: 260, dir: -1, scale: 0.95, color: '#818cf8' },
      { yBase: 175, speed: 1.8, offset: 480, dir: 1,  scale: 1.10, color: '#38bdf8' },
      { yBase: 115, speed: 1.3, offset: 640, dir: -1, scale: 0.90, color: '#c084fc' },
    ];

    spinners.forEach((sp, idx) => {
      const progress = (frame * sp.speed + sp.offset) % skySpan;
      const sx = sp.dir === 1 ? (skyStartX + progress) : (skyStartX + skySpan - progress);
      const sy = sp.yBase + Math.sin(frame * 0.06 + idx * 1.5) * 2.5;

      const w = 26 * sp.scale;
      const h = 8 * sp.scale;

      ctx.save();
      ctx.translate(sx, sy);
      if (sp.dir === -1) ctx.scale(-1, 1);

      // Luồng phản lực chống trọng lực xanh cyan
      const thrustGrad = ctx.createRadialGradient(w * 0.5, h, 1, w * 0.5, h + 8 * sp.scale, 8 * sp.scale);
      thrustGrad.addColorStop(0, 'rgba(56, 189, 248, 0.7)');
      thrustGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = thrustGrad;
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h + 4, w * 0.45, 5 * sp.scale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Thân tàu bay
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, 3);
      ctx.fill();
      ctx.strokeStyle = sp.color;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Kính buồng lái
      ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.fillRect(w * 0.35, 1, w * 0.4, h * 0.5);

      // Đèn hoa tiêu FAA
      const isStrobeOn = (frame + idx * 12) % 35 < 8;
      if (isStrobeOn) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(2, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(w - 2, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    ctx.restore();
  }

  /**
   * 8. Người đi bộ ngoài trời trên cầu kính
   */
  public static drawWindowPedestrians(ctx: CanvasRenderingContext2D, frame: number) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(650, 35, 726, 530);
    ctx.clip();

    const walkStartX = 660;
    const walkSpan = 520;
    const walkY = 292;

    const peds = [
      { speed: 0.55, offset: 0, dir: 1, color: 'rgba(255, 255, 255, 0.45)' },
      { speed: 0.45, offset: 160, dir: -1, color: 'rgba(56, 189, 248, 0.45)' },
      { speed: 0.62, offset: 340, dir: 1, color: 'rgba(250, 204, 21, 0.45)' },
    ];

    peds.forEach((p, idx) => {
      const progress = (frame * p.speed + p.offset) % walkSpan;
      const px = p.dir === 1 ? (walkStartX + progress) : (walkStartX + walkSpan - progress);
      const bob = Math.abs(Math.sin(frame * 0.15 + idx)) * 1.5;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, walkY - 8 - bob, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(px - 1.5, walkY - 6 - bob, 3, 6);
    });

    ctx.restore();
  }

  /**
   * 11. Vẽ nhân vật 2 Nam 2 Nữ chuẩn tỉ lệ thật theo yêu cầu Pinterest:
   * - Nam: pin_998321442479763235 (Com-lê 3 mảnh lịch lãm, giày da, tóc đen)
   * - Nữ: pin_1099582065812564429 (Vest đen công sở, chân váy bút chì, giày cao gót, tóc nâu sang trọng)
   * - Tỉ lệ chuẩn xác với ghế xoay và bàn làm việc (ngồi làm việc đàng hoàng trên ghế, gõ phím, họp)
   */
  public static drawRealisticCyberAgent(ctx: CanvasRenderingContext2D, agent: Agent, frame: number) {
    const x = agent.pos_x;
    const y = agent.pos_y;
    const isMoving = agent.status === 'moving';
    const isFemale = agent.code === 'dung_2';
    const facingLeft = isMoving && (agent.target_x < agent.pos_x);
    const isSelected = agent.code === (window as any).__selectedAgentCode;

    let sprite: HTMLImageElement | null = null;
    let charH = 140;
    let flipHoriz = false;

    if (isMoving) {
      // 1. TRẠNG THÁI ĐI BỘ: Di chuyển qua lại trong văn phòng
      sprite = isFemale ? ImageLoader.getCharacter('female_walk') : ImageLoader.getCharacter('male_walk');
      const depthScale = Math.min(1.0, Math.max(0.68, (y - 250) / 450));
      charH = Math.round((isFemale ? 150 : 158) * depthScale);
      flipHoriz = facingLeft;
    } else {
      // 2. TRẠNG THÁI NGỒI LÀM VIỆC & HỌP TRÊN GHẾ CÔNG THÁI HỌC
      const isMeeting = agent.current_room === 'boardroom' || agent.status === 'debating';

      if (isMeeting) {
        // TẠI BÀN HỌP TRÒN TRUNG TÂM: Tất cả đều quay mặt VÀO TRUNG TÂM BÀN HỌP VÀ HOLOGRAM 3D
        if (agent.code === 'dung_1') {
          // Dũng 1: Nam Giám Đốc ngồi ghế VIP phía trên bàn tròn, nhìn xuống Hologram và toàn phòng
          sprite = ImageLoader.getCharacter('male_sitting_chair');
          charH = 115;
          flipHoriz = false;
        } else if (agent.code === 'dung_2') {
          // Dũng 2: Nữ Kiến Trúc Sư ngồi ghế bên trái bàn tròn, quay mặt sang phải vào Hologram
          sprite = ImageLoader.getCharacter('female_sitting_chair');
          charH = 125;
          flipHoriz = true;
        } else if (agent.code === 'dung_3') {
          // Dũng 3: Nam Fullstack Dev ngồi ghế dưới bàn tròn, quay lưng lại người xem và hướng lên Hologram
          sprite = ImageLoader.getCharacter('male_typing_chair');
          charH = 138;
          flipHoriz = false;
        }
      } else {
        // TẠI BÀN LÀM VIỆC RIÊNG BIỆT: Ngồi đúng ghế, gõ phím hướng vào máy tính và màn hình bên trái
        if (agent.code === 'dung_1') {
          // Dũng 1: Nam Giám Đốc tại ghế VIP điều hành tối cao phía trên bàn tròn
          sprite = ImageLoader.getCharacter('male_sitting_chair');
          charH = 115;
          flipHoriz = false;
        } else if (agent.code === 'dung_2') {
          // Dũng 2: Nữ Kiến Trúc Sư tại Desk 2 ngồi gõ phím hướng vào máy tính bên trái
          sprite = ImageLoader.getCharacter('female_typing_chair');
          charH = 118;
          flipHoriz = false; // Sprite mới đã hướng sang trái
        } else if (agent.code === 'dung_3') {
          // Dũng 3: Nam Fullstack Dev tại Desk 1 ngồi gõ phím hướng vào máy tính bên trái
          sprite = ImageLoader.getCharacter('male_typing_chair');
          charH = 138;
          flipHoriz = false;
        }
      }
    }

    if (sprite) {
      const charW = Math.round(charH * (sprite.naturalWidth / sprite.naturalHeight));
      const bob = isMoving
        ? Math.abs(Math.sin(frame * 0.22)) * 3
        : (agent.status === 'coding' || agent.status === 'testing' ? Math.sin(frame * 0.3) * 0.6 : 0);
      const drawX = x - charW / 2;
      const drawY = y - charH - bob;

      // Hiệu ứng vòng tròn phát sáng Neon khi nhân vật được người dùng click chọn
      if (isSelected) {
        ctx.save();
        const pulse = Math.sin(frame * 0.12) * 3;
        ctx.strokeStyle = isFemale ? '#ec4899' : '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = isFemale ? '#ec4899' : '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.ellipse(x, y + 2, charW * 0.5 + pulse, 10 + pulse * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Mũi tên chỉ định hướng trên đầu nhân vật đang chọn
        ctx.fillStyle = isFemale ? '#ec4899' : '#38bdf8';
        ctx.beginPath();
        const arrowY = drawY - 26 + Math.sin(frame * 0.15) * 3;
        ctx.moveTo(x, arrowY + 6);
        ctx.lineTo(x - 5, arrowY);
        ctx.lineTo(x + 5, arrowY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Đổ bóng chân / bánh xe trên sàn
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.beginPath();
      ctx.ellipse(x, y + 2, charW * 0.38, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Vẽ nhân vật với flip ngang nếu cần
      ctx.save();
      if (flipHoriz) {
        ctx.translate(x, 0);
        ctx.scale(-1, 1);
        ctx.translate(-x, 0);
      }
      ctx.drawImage(sprite, drawX, drawY, charW, charH);
      ctx.restore();

      // Bảng tên và trạng thái trên đầu nhân vật
      const badgeY = drawY - 8;
      const roleText = agent.role.split('&')[0].trim();
      const genderTag = isFemale ? '👩 NỮ' : '👨 NAM';
      const badgeText = `${genderTag} • ${agent.name} (${roleText})`;

      ctx.save();
      ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
      const tw = ctx.measureText(badgeText).width;
      const bw = tw + 14;

      ctx.fillStyle = isSelected ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = isSelected
        ? (isFemale ? '#ec4899' : '#38bdf8')
        : (isFemale ? 'rgba(236, 72, 153, 0.6)' : 'rgba(56, 189, 248, 0.6)');
      ctx.lineWidth = isSelected ? 1.5 : 1;
      ctx.roundRect(x - bw / 2, badgeY - 14, bw, 15, 3);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isFemale ? '#f472b6' : '#38bdf8';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, x, badgeY - 3);
      ctx.restore();
    }
  }

  /**
   * 9. Bàn tròn trung tâm: Chiếu Hologram 3D xoay vòng đỉnh cao (Center Round Table Hologram)
   * Tọa độ chuẩn xác trùng khớp tâm lõi thành phố 3D trong Cyberpunk Office (cx: 948, cy: 499)
   */
  public static drawCenterRoundTableHologram(ctx: CanvasRenderingContext2D, cx: number, cy: number, frame: number) {
    ctx.save();

    // ─────────────────────────────────────────────────────────────────────────
    // 1. VÒNG TRÒN PHÁT SÓNG EMITTER MỞ RỘNG CHÍNH GIỮA MẶT BÀN (Pulsing Emitter Rings)
    // ─────────────────────────────────────────────────────────────────────────
    for (let r = 0; r < 3; r++) {
      const pulseProgress = ((frame * 0.45 + r * 20) % 60) / 60;
      const rx = 40 + pulseProgress * 65;
      const ry = rx * 0.46;
      const alpha = (1 - pulseProgress) * 0.65;

      ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
      ctx.lineWidth = 1.4;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. HÌNH NÓN ÁNH SÁNG MÁY CHIẾU HOLOGRAM CHIẾU THẲNG ĐỨNG TỪ TÂM BÀN
    // ─────────────────────────────────────────────────────────────────────────
    const coreY = cy - 22;
    const coneGrad = ctx.createLinearGradient(cx, cy, cx, coreY - 35);
    coneGrad.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
    coneGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.15)');
    coneGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = coneGrad;
    ctx.beginPath();
    ctx.moveTo(cx - 45, cy);
    ctx.lineTo(cx + 45, cy);
    ctx.lineTo(cx + 25, coreY - 30);
    ctx.lineTo(cx - 25, coreY - 30);
    ctx.closePath();
    ctx.fill();

    // ─────────────────────────────────────────────────────────────────────────
    // 3. QUẢ CẦU LƯỢNG TỬ & 3 VÒNG QUỸ ĐẠO HOLOGRAM XOAY TRÒN 3D (3D Orbit Rings)
    // ─────────────────────────────────────────────────────────────────────────
    const rot = frame * 0.025;

    // Vành 1: Xoay nghiêng góc 25 độ màu Cyan
    ctx.save();
    ctx.translate(cx, coreY);
    ctx.rotate(0.35);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(0, 0, 48, 18, rot, 0, Math.PI * 2);
    ctx.stroke();
    // Nốt hạt photon chạy trên vành 1
    const p1X = Math.cos(rot) * 48;
    const p1Y = Math.sin(rot) * 18;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(p1X, p1Y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Vành 2: Xoay nghiêng góc -35 độ màu Tím Neon
    ctx.save();
    ctx.translate(cx, coreY);
    ctx.rotate(-0.45);
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(0, 0, 48, 18, -rot * 0.9, 0, Math.PI * 2);
    ctx.stroke();
    // Nốt photon chạy trên vành 2
    const p2X = Math.cos(-rot * 0.9) * 48;
    const p2Y = Math.sin(-rot * 0.9) * 18;
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(p2X, p2Y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Lõi bát diện 3D Wireframe phát sáng ở chính giữa quả cầu
    ctx.save();
    ctx.translate(cx, coreY);
    const coreRot = rot * 1.5;
    const rSize = 14;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;

    const topPt = { x: 0, y: -rSize };
    const botPt = { x: 0, y: rSize };
    const pt1 = { x: Math.cos(coreRot) * rSize, y: Math.sin(coreRot) * (rSize * 0.45) };
    const pt2 = { x: Math.cos(coreRot + Math.PI / 2) * rSize, y: Math.sin(coreRot + Math.PI / 2) * (rSize * 0.45) };
    const pt3 = { x: Math.cos(coreRot + Math.PI) * rSize, y: Math.sin(coreRot + Math.PI) * (rSize * 0.45) };
    const pt4 = { x: Math.cos(coreRot + Math.PI * 1.5) * rSize, y: Math.sin(coreRot + Math.PI * 1.5) * (rSize * 0.45) };

    const pts = [pt1, pt2, pt3, pt4];
    for (let i = 0; i < 4; i++) {
      const nextPt = pts[(i + 1) % 4];
      ctx.beginPath();
      ctx.moveTo(topPt.x, topPt.y);
      ctx.lineTo(pts[i].x, pts[i].y);
      ctx.lineTo(botPt.x, botPt.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pts[i].x, pts[i].y);
      ctx.lineTo(nextPt.x, nextPt.y);
      ctx.stroke();
    }
    ctx.restore();

    // ─────────────────────────────────────────────────────────────────────────
    // 4. TIA QUÉT LASER HOLOGRAM QUÉT DỌC & BANNER TRẠNG THÁI
    // ─────────────────────────────────────────────────────────────────────────
    const scanProgress = (frame * 1.2) % 60;
    const scanY = coreY - 28 + scanProgress;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 40, scanY);
    ctx.lineTo(cx + 40, scanY);
    ctx.stroke();

    // Nhãn HUD nhỏ trên đỉnh quả cầu
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(cx - 52, coreY - 46, 104, 15, 3);
    ctx.fill();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 7px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('◈ AI 4 DŨNG • HOLO CORE ◈', cx, coreY - 36);

    ctx.restore();
  }

  /**
   * 10. Đèn và nhãn trạng thái tinh tế tại 3 trạm làm việc (không che khuất bàn ghế)
   */
  public static drawWorkstationHolographicHUDs(ctx: CanvasRenderingContext2D, frame: number) {
    ctx.save();

    const stations = [
      { x: 300, y: 350, label: 'DEV LAB • 200 OK', color: '#10b981' },
      { x: 450, y: 250, label: 'ARCH DAG • 1.2ms', color: '#a855f7' },
      { x: 580, y: 165, label: 'QA SEC • 5k TPS', color: '#ef4444' },
    ];

    stations.forEach((st, idx) => {
      const isBlink = (frame + idx * 7) % 24 < 12;
      ctx.fillStyle = isBlink ? st.color : 'rgba(100, 116, 139, 0.4)';
      ctx.beginPath();
      ctx.arc(st.x - 25, st.y, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = 'bold 6.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(st.label, st.x - 18, st.y + 2.5);
    });

  }

  // ═════════════════════════════════════════════════════════════════════════
  // KIẾN TRÚC & NỘI THẤT VĂN PHÒNG A.I CYBERPUNK 16:9 TỰ QUẢN LÝ 100%
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Tự dựng toàn bộ kiến trúc văn phòng A.I tương lai 16:9 (1376x768):
   * Tường hậu titan, 4 cửa sổ kính lớn Skyline ngắm xe bay, sàn gạch công nghệ cao,
   * thảm trải sàn viền neon LED, vách ngăn kính mờ, đèn spotlight công nghiệp.
   */
  public static drawCustomCyberAIOfficeStructure(ctx: CanvasRenderingContext2D, width: number, height: number, frame: number) {
    // 1. Nền tối sâu thẳm
    ctx.fillStyle = '#060913';
    ctx.fillRect(0, 0, width, height);

    // 2. Tường hậu titan phía sau (Back Wall) từ y = 0 đến 125
    const wallGrad = ctx.createLinearGradient(0, 0, 0, 125);
    wallGrad.addColorStop(0, '#0a0f1d');
    wallGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(20, 15, width - 40, 110);

    // Gờ phào trần nhà nhôm xước viền LED Cyan
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(20, 15, width - 40, 8);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(20, 22, width - 40, 1.5);

    // 4 Cửa sổ kính lớn Skyline (Panoramic Windows): wx = [80, 400, 720, 1040], w = 250, h = 80, y = 28
    const windowPositions = [80, 400, 720, 1040];
    const winW = 250;
    const winH = 80;

    windowPositions.forEach((wx, idx) => {
      // Bầu trời đêm thành phố Cyberpunk
      const skyGrad = ctx.createLinearGradient(wx, 28, wx, 108);
      skyGrad.addColorStop(0, '#030712');
      skyGrad.addColorStop(0.5, '#1e1b4b');
      skyGrad.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(wx, 28, winW, winH);

      // Skyline các tòa nhà chọc trời Cyberpunk ngoài cửa sổ
      const bldCount = 6;
      for (let b = 0; b < bldCount; b++) {
        const bx = wx + b * 42 + 2;
        const bw = 36;
        const bh = 30 + ((b * 17 + idx * 23) % 40);
        const by = 108 - bh;

        ctx.fillStyle = b % 2 === 0 ? '#090d16' : '#0f172a';
        ctx.fillRect(bx, by, bw, bh);

        // Các ô cửa sổ nhà cao tầng phát sáng nhấp nháy
        for (let wy = by + 4; wy < 104; wy += 8) {
          for (let wcol = bx + 4; wcol < bx + bw - 4; wcol += 8) {
            const isLit = (wcol * 7 + wy * 13 + idx * 3) % 4 !== 0;
            if (isLit) {
              const isWarm = (wcol + wy) % 3 === 0;
              ctx.fillStyle = isWarm ? 'rgba(254, 240, 138, 0.75)' : 'rgba(56, 189, 248, 0.75)';
              ctx.fillRect(wcol, wy, 4, 4);
            }
          }
        }
      }

      // Đại lộ xe bay (Animated Flying Cars) lướt ngang qua
      // Làn 1: Bay sang phải (y = 48)
      const car1X = wx + ((frame * 2.2 + idx * 120) % (winW + 60)) - 30;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(car1X, 48, 18, 5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(car1X + 16, 49, 2, 3);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.fillRect(car1X - 25, 49, 25, 3);

      // Làn 2: Bay sang trái (y = 72)
      const car2X = wx + winW - ((frame * 1.8 + idx * 90) % (winW + 60)) + 30;
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(car2X - 18, 72, 18, 5);
      ctx.fillStyle = '#ef4444'; // Đèn đuôi đỏ
      ctx.fillRect(car2X, 73, 2, 3);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.fillRect(car2X + 2, 73, 25, 3);

      // Khung kính cường lực viền kim loại nòng súng
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(wx, 28, winW, winH);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(wx, 28, winW, winH);

      // Luồng sáng Cyber Volumetric Rays chiếu nghiêng rọi xuống sàn
      const rayAlpha = 0.05 + Math.sin(frame * 0.03 + idx) * 0.02;
      const rayGrad = ctx.createLinearGradient(wx + winW / 2, 108, wx + winW / 2 + 50, 240);
      rayGrad.addColorStop(0, `rgba(56, 189, 248, ${rayAlpha * 1.5})`);
      rayGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(wx + 20, 108);
      ctx.lineTo(wx + winW - 20, 108);
      ctx.lineTo(wx + winW + 50, 240);
      ctx.lineTo(wx + 40, 240);
      ctx.closePath();
      ctx.fill();
    });

    // Chân tường 3D (Baseboard) viền LED Purple chạy ngang phòng ở y = 120
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(20, 120, width - 40, 5);
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(20, 124, width - 40, 1.5);

    // 3. Toàn bộ sàn nhà công nghệ cao Isometric (y = 125 đến 748)
    this.drawIsometricCyberFloor(ctx, 20, 125, width - 40, height - 145);

    // 4. Các vùng thảm chức năng có viền LED phát sáng (Floor Zoning)
    // Khu Giám Đốc (Executive Director Suite)
    this.drawCyberRug(ctx, 40, 135, 430, 285, '#0369a1', '#fbbf24', 'PHÒNG GIÁM ĐỐC CHIẾN LƯỢC • DŨNG 1');
    // Khu Dãy Bàn Tech Pod (Dev, Arch, QA)
    this.drawCyberRug(ctx, 40, 435, 630, 295, '#0f172a', '#06b6d4', 'TRẠM CÔNG NGHỆ CAO • DEV & ARCH & QA');
    // Khu Bàn Tròn Họp Hologram 3D (Central Deliberation Boardroom)
    this.drawCyberRoundMeetingRug(ctx, 1000, 340, 260, 155, frame);
    // Khu Sảnh Cafe & Ngắm Xe Bay (Skyline Lounge)
    this.drawCyberRug(ctx, 690, 585, 640, 155, '#1e1b4b', '#f59e0b', 'SẢNH CAFE & XE BAY • SKYLINE LOUNGE');

    // 5. Vách ngăn kính mờ (Frosted Cyber Partitions)
    this.drawCyberGlassPartition(ctx, 475, 135, 12, 285);
    this.drawCyberGlassPartition(ctx, 675, 135, 12, 595);
    this.drawCyberGlassPartition(ctx, 690, 570, 640, 8);

    // 6. Đèn trần hình nón công nghiệp rọi xuống các bàn làm việc
    this.drawVaultIndustrialLighting(ctx);

    // 7. Bụi Cyber Neon Ambient
    this.drawCyberParticles(ctx, frame);
  }

  /**
   * Sàn gạch công nghệ cao màu tối xám sang trọng phản chiếu ánh neon
   */
  public static drawIsometricCyberFloor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    const tileW = 48;
    const tileH = 24;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(x, y, w, h);

    const startCol = -4;
    const endCol = Math.ceil(w / (tileW / 2)) + 4;
    const startRow = -4;
    const endRow = Math.ceil(h / tileH) + 4;

    for (let r = startRow; r < endRow; r++) {
      for (let c = startCol; c < endCol; c++) {
        const cx = x + c * (tileW / 2);
        const cy = y + r * tileH + (Math.abs(c) % 2 !== 0 ? tileH / 2 : 0);

        const isAlt = (Math.abs(c) + Math.abs(r)) % 2 === 0;
        ctx.fillStyle = isAlt ? '#0c1222' : '#0e1628';

        ctx.beginPath();
        ctx.moveTo(cx, cy - tileH / 2);
        ctx.lineTo(cx + tileW / 2, cy);
        ctx.lineTo(cx, cy + tileH / 2);
        ctx.lineTo(cx - tileW / 2, cy);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  /**
   * Thảm chức năng công nghệ cao viền LED neon phát sáng
   */
  public static drawCyberRug(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, bgColor: string, ledColor: string, title: string) {
    ctx.save();
    // Nền thảm
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.fill();

    // Viền LED phát sáng
    ctx.strokeStyle = ledColor;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = ledColor;
    ctx.shadowBlur = 8;
    ctx.stroke();

    // Biển tên phân khu nhỏ tinh tế góc trên
    ctx.font = 'bold 8px "JetBrains Mono", monospace';
    const badgeW = ctx.measureText(title).width + 18;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(x + 10, y + 8, badgeW, 18, 4);
    ctx.fill();
    ctx.strokeStyle = ledColor;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = ledColor;
    ctx.fillText(title, x + 19, y + 20);

    ctx.restore();
  }

  /**
   * Thảm tròn Navy trung tâm cho Bàn Họp Hologram 3D
   */
  public static drawCyberRoundMeetingRug(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, frame: number) {
    ctx.save();
    // Nền thảm tròn Navy
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Vòng LED neon Cyan phát sáng xung quanh thảm
    const pulse = Math.sin(frame * 0.08) * 3;
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 12 + pulse;
    ctx.stroke();

    // Vòng quỹ đạo ánh sáng phụ bên trong
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx - 18, ry - 12, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Vách ngăn kính mờ viền thép (Cyber Glass Partition)
   */
  public static drawCyberGlassPartition(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.save();
    ctx.fillStyle = 'rgba(30, 41, 59, 0.55)';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 4);
    ctx.fill();

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Danh mục toàn bộ vật phẩm nội thất chuẩn xác với Z-Depth sorting hoàn hảo 100%
   */
  public static getCustomCyberOfficeFurnitureDrawables(agents: Agent[] = [], frame: number = 0): ZDrawable[] {
    const drawables: ZDrawable[] = [];

    // ───────────────────────────────────────────────────────────────────────
    // 1. KHU PHÒNG GIÁM ĐỐC CHIẾN LƯỢC (Dũng 1)
    // ───────────────────────────────────────────────────────────────────────
    // Tủ tài liệu đứng kính mờ
    drawables.push({
      zY: 175,
      draw: ctx => this.drawGlassFilingCabinet(ctx, 60, 145),
    });
    // Chậu cây Monstera nhiệt đới
    drawables.push({
      zY: 185,
      draw: ctx => this.drawPottedPlant(ctx, 420, 155),
    });
    // Ghế da điều hành Giám Đốc (trống khi Dũng 1 rời bàn)
    const dung1AtDesk = agents.some(a => a.code === 'dung_1' && a.current_room === 'director_office' && a.status !== 'moving');
    if (!dung1AtDesk) {
      drawables.push({
        zY: 255,
        draw: ctx => this.drawExecutiveLeatherChair(ctx, 230, 260),
      });
    }
    // Bàn làm việc Giám Đốc (zY = 275 > agent.zY = 260: Mặt bàn & laptop che phủ chân và ngồi tự nhiên sau bàn)
    drawables.push({
      zY: 275,
      draw: ctx => this.drawExecutiveDirectorDesk(ctx, 130, 230),
    });

    // ───────────────────────────────────────────────────────────────────────
    // 2. KHU DÃY BÀN TECH POD (Dũng 3, Dũng 2, Dũng 4)
    // ───────────────────────────────────────────────────────────────────────
    // Trạm 1: Cyber Dev Lab (Dũng 3 - Fullstack Dev tại 185, 620)
    const dung3AtDesk = agents.some(a => a.code === 'dung_3' && a.current_room === 'dev_lab' && a.status !== 'moving');
    if (!dung3AtDesk) {
      drawables.push({
        zY: 615,
        draw: ctx => this.drawErgonomicMeshChair(ctx, 185, 620),
      });
    }
    drawables.push({
      zY: 625,
      draw: ctx => this.drawDevLabStation(ctx, 75, 550, frame),
    });

    // Trạm 2: Kiến Trúc & PM (Dũng 2 - Software Architect tại 385, 620)
    const dung2AtDesk = agents.some(a => a.code === 'dung_2' && a.current_room === 'architect_office' && a.status !== 'moving');
    if (!dung2AtDesk) {
      drawables.push({
        zY: 615,
        draw: ctx => this.drawErgonomicMeshChair(ctx, 385, 620),
      });
    }
    drawables.push({
      zY: 625,
      draw: ctx => this.drawArchitectPMStation(ctx, 275, 550, frame),
    });

    // Trạm 3: Bàn bida & giải trí thư giãn (585, 620)
    drawables.push({
      zY: 615,
      draw: ctx => this.drawErgonomicMeshChair(ctx, 585, 620),
    });
    drawables.push({
      zY: 625,
      draw: ctx => this.drawQASecurityStation(ctx, 475, 550, frame),
    });

    // ───────────────────────────────────────────────────────────────────────
    // 3. KHU BÀN TRÒN HỌP DỰ ÁN HOLOGRAM 3D TRUNG TÂM (cx: 1000, cy: 340)
    // Loại bỏ toàn bộ ghế cố định thừa bên phải để tránh chồng chéo theo yêu cầu
    // Khi họp thì cả 4 Dũng sẽ tự bước tới ngồi quanh bàn (sprite đã tích hợp sẵn ghế ngồi)
    // ───────────────────────────────────────────────────────────────────────
    // Mặt Bàn Tròn Họp Hologram 3D (zY = 340) với quả cầu xoay tròn chính giữa tâm bàn
    drawables.push({
      zY: 340,
      draw: ctx => this.drawCustomRoundConferenceTable(ctx, 1000, 340, frame),
    });

    // ───────────────────────────────────────────────────────────────────────
    // 4. KHU SẢNH THƯ GIÃN CAFE & NGẮM XE BAY (Đã dọn sạch ghế sofa thừa để thoáng đãng)
    // ───────────────────────────────────────────────────────────────────────
    drawables.push({
      zY: 630,
      draw: ctx => this.drawPantryCoffeeStation(ctx, 720, 605),
    });
    drawables.push({
      zY: 625,
      draw: ctx => this.drawWaterCooler(ctx, 885, 600),
    });

    return drawables;
  }

  /**
   * Bàn Giám Đốc mặt kính đen viền kim loại vàng titan
   */
  public static drawExecutiveDirectorDesk(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 200;
    const h = 58;
    ctx.save();
    // Đổ bóng bàn
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.roundRect(x + 4, y + 8, w, h, 6);
    ctx.fill();

    // Chân bàn thép mạ crom chữ U
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 10, y + 16, 8, 42);
    ctx.fillRect(x + w - 18, y + 16, 8, 42);

    // Mặt bàn kính đen bóng viền kim loại vàng titan
    ctx.fillStyle = '#0a0f1d';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.fill();

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Tấm lót bàn da đen (Desk Mat) đặt ngay phía trước Dũng 1 (tâm tại x + 100 = 230)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(x + 55, y + 8, 90, 42, 3);
    ctx.fill();

    // Laptop siêu mỏng mở slide ngay trước mặt Dũng 1
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + 85, y + 12, 30, 20);
    ctx.fillStyle = '#38bdf8'; // Màn hình hiển thị slide xanh
    ctx.fillRect(x + 86, y + 13, 28, 15);

    // Bàn phím laptop & chuột
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 87, y + 34, 26, 10);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(x + 124, y + 30, 6, 8);

    // Điện thoại điều hành
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 20, y + 16, 20, 22);
    ctx.fillStyle = '#22c55e'; // LED xanh
    ctx.fillRect(x + 34, y + 18, 3, 3);

    // Tách cà phê nóng bốc khói
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(x + 168, y + 26, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(x + 168, y + 26, 3.5, 0, Math.PI * 2);
    ctx.fill();
    this.drawCoffeeSteam(ctx, x + 168, y + 22);

    ctx.restore();
  }

  /**
   * Bàn Cyber Dev Lab (Dũng 3): 2 màn hình cong Matrix Code xanh lá cuộn động
   */
  public static drawDevLabStation(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
    const w = 175;
    const h = 52;
    ctx.save();

    // Đổ bóng bàn
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.roundRect(x + 4, y + 6, w, h, 6);
    ctx.fill();

    // Khung chân thép nòng súng
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 6, y + 16, 6, 36);
    ctx.fillRect(x + w - 12, y + 16, 6, 36);

    // Mặt bàn titan xám than
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Thùng máy PC Tower để bàn bên phải
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(x + w - 30, y + 8, 24, 36, 2);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Quạt LED RGB nhấp nháy
    const rgbHue = (frame * 3) % 360;
    ctx.fillStyle = `hsl(${rgbHue}, 80%, 55%)`;
    ctx.beginPath();
    ctx.arc(x + w - 18, y + 22, 6, 0, Math.PI * 2);
    ctx.fill();

    // 2 MÀN HÌNH CONG HIỂN THỊ MATRIX CODE XANH LÁ
    // Màn hình 1 (bên trái)
    ctx.fillStyle = '#052e16';
    ctx.fillRect(x + 12, y - 22, 48, 26);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 12, y - 22, 48, 26);
    // Matrix Code cuộn động
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 5px monospace';
    for (let line = 0; line < 3; line++) {
      const codeStr = `01${(frame + line * 17) % 89} const API;`;
      ctx.fillText(codeStr, x + 15, y - 16 + line * 7);
    }

    // Màn hình 2 (ở giữa)
    ctx.fillStyle = '#052e16';
    ctx.fillRect(x + 66, y - 22, 54, 26);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 66, y - 22, 54, 26);
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 5px monospace';
    for (let line = 0; line < 3; line++) {
      const codeStr = `✓ 200 OK [${((frame * 2 + line * 31) % 99)}ms]`;
      ctx.fillText(codeStr, x + 69, y - 16 + line * 7);
    }

    // Bàn phím cơ RGB phát sáng
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 40, y + 14, 52, 14);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(x + 40, y + 14, 52, 14);
    // Chuột
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 100, y + 17, 6, 9);

    // Tách cà phê Dev
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + 24, y + 24, 4, 0, Math.PI * 2);
    ctx.fill();
    this.drawCoffeeSteam(ctx, x + 24, y + 20);

    ctx.restore();
  }

  /**
   * Bàn Kiến Trúc & PM (Dũng 2): Màn hình HUD DAG Microservices tím neon
   */
  public static drawArchitectPMStation(ctx: CanvasRenderingContext2D, x: number, y: number, _frame: number) {
    const w = 175;
    const h = 52;
    ctx.save();

    // Đổ bóng bàn
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.roundRect(x + 4, y + 6, w, h, 6);
    ctx.fill();

    // Chân bàn thép
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 6, y + 16, 6, 36);
    ctx.fillRect(x + w - 12, y + 16, 6, 36);

    // Mặt bàn titan
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.fill();
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Màn hình lớn HUD Microservices DAG
    ctx.fillStyle = '#2e1065';
    ctx.fillRect(x + 25, y - 22, 70, 26);
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 25, y - 22, 70, 26);

    // Sơ đồ DAG node nhấp nháy
    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('DAG: Gateway ➔ MS', x + 28, y - 15);
    ctx.fillText('Latency: 1.2ms [p99]', x + 28, y - 7);

    // Tablet thiết kế bên phải
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 115, y - 16, 32, 20);
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(x + 115, y - 16, 32, 20);

    // Bàn phím & chuột
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 45, y + 14, 52, 14);
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(x + 45, y + 14, 52, 14);
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(x + 105, y + 17, 6, 9);

    ctx.restore();
  }

  /**
   * Bàn Kiểm Thử An Ninh & QA (Dũng 4): Màn hình radar quét lỗ hổng & 5k TPS
   */
  public static drawQASecurityStation(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
    const w = 175;
    const h = 52;
    ctx.save();

    // Đổ bóng bàn
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.roundRect(x + 4, y + 6, w, h, 6);
    ctx.fill();

    // Chân bàn thép
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 6, y + 16, 6, 36);
    ctx.fillRect(x + w - 12, y + 16, 6, 36);

    // Mặt bàn titan
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Màn hình Radar an ninh bảo mật
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(x + 25, y - 22, 70, 26);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 25, y - 22, 70, 26);

    // Quét Radar quay tròn
    const radarAngle = frame * 0.08;
    ctx.save();
    ctx.translate(x + 50, y - 9);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(radarAngle) * 8, Math.sin(radarAngle) * 8);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('STRESS: 5,000 TPS', x + 63, y - 13);
    ctx.fillText('0 VULN DETECTED', x + 63, y - 6);

    // Màn hình phụ bên phải
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 110, y - 18, 36, 22);
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(x + 110, y - 18, 36, 22);

    // Bàn phím & chuột
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 45, y + 14, 52, 14);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(x + 45, y + 14, 52, 14);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + 105, y + 17, 6, 9);

    ctx.restore();
  }

  /**
   * Bàn Tròn Họp Hologram 3D trung tâm (Central Round Table)
   */
  public static drawCustomRoundConferenceTable(ctx: CanvasRenderingContext2D, cx: number, cy: number, frame: number) {
    const rx = 175;
    const ry = 92;
    ctx.save();

    // Đổ bóng bàn tròn xuống thảm
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 12, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chân trụ kim loại lớn ở tâm bàn
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 30, cy + 10, 60, 35);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - 30, cy + 10, 60, 35);

    // Mặt bàn tròn lớn (Composite titan đen mờ)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Viền kim loại mạ crom
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.stroke();

    // VÒNG LED NEON CYAN PHÁT SÁNG QUANH TÂM BÀN TRÒN
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 95, 50, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Chiếu Màn Hình 3D Hologram Quả Cầu Xoay Tròn Chính Giữa Tâm Bàn Tròn
    this.drawCenterRoundTableHologram(ctx, cx, cy, frame);

    ctx.restore();
  }

  /**
   * Ghế xoay công thái học lưới đen (Ergonomic Mesh Chair)
   */
  public static drawErgonomicMeshChair(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    // 1. Chân sao 5 bánh xe mạ crom cao cấp
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2.2;
    for (let a = 0; a < 5; a++) {
      const rad = (a * Math.PI * 2) / 5;
      ctx.beginPath();
      ctx.moveTo(x, y + 12);
      ctx.lineTo(x + Math.cos(rad) * 18, y + 12 + Math.sin(rad) * 9);
      ctx.stroke();
      // Bánh xe đôi
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(x + Math.cos(rad) * 18, y + 12 + Math.sin(rad) * 9, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // Trục nâng thủy lực
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x - 3, y + 2, 6, 12);

    // 2. Đệm ngồi đen công thái học êm ái
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(x - 18, y - 6, 36, 12, 4);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 3. Tựa lưng lưới công thái học cao cấp (chiều cao tỉ lệ thật)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(x - 16, y - 48, 32, 42, 5);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Lưng lưới thoáng khí
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 0.8;
    for (let ly = y - 44; ly < y - 10; ly += 6) {
      ctx.beginPath();
      ctx.moveTo(x - 14, ly);
      ctx.lineTo(x + 14, ly);
      ctx.stroke();
    }

    // Tựa đầu (Headrest)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(x - 11, y - 60, 22, 10, 3);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Tay vịn 2 bên
    ctx.fillStyle = '#334155';
    ctx.fillRect(x - 21, y - 26, 4, 18);
    ctx.fillRect(x + 17, y - 26, 4, 18);

    ctx.restore();
  }

  /**
   * Ghế da điều hành Giám Đốc lưng cao (Executive Leather Chair)
   */
  public static drawExecutiveLeatherChair(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    // Chân sao 5 bánh mạ vàng hoàng kim
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.4;
    for (let a = 0; a < 5; a++) {
      const rad = (a * Math.PI * 2) / 5;
      ctx.beginPath();
      ctx.moveTo(x, y + 14);
      ctx.lineTo(x + Math.cos(rad) * 20, y + 14 + Math.sin(rad) * 10);
      ctx.stroke();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(x + Math.cos(rad) * 20, y + 14 + Math.sin(rad) * 10, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x - 3.5, y + 2, 7, 14);

    // Đệm ngồi da nappa đen chần bông sang trọng
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.roundRect(x - 20, y - 8, 40, 14, 5);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Tựa lưng da cao quyền lực
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(x - 18, y - 56, 36, 48, 6);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Tựa đầu da nappa
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(x - 13, y - 70, 26, 12, 4);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Tay vịn bọc da viền vàng
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 23, y - 32, 5, 22);
    ctx.fillRect(x + 18, y - 32, 5, 22);

    ctx.restore();
  }

  /**
   * Quầy bar pha cà phê thông minh
   */
  public static drawPantryCoffeeStation(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 145;
    const h = 48;
    ctx.save();
    // Đổ bóng quầy bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.roundRect(x + 4, y + 6, w, h, 6);
    ctx.fill();

    // Thân tủ gỗ óc chó xám
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Mặt đá cẩm thạch trắng
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(x, y, w, 14, 4);
    ctx.fill();

    // Máy pha cà phê Espresso inox
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + 20, y - 18, 24, 22);
    ctx.fillStyle = '#f59e0b'; // LED nút pha
    ctx.fillRect(x + 24, y - 14, 3, 3);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + 30, y - 14, 3, 3);
    this.drawCoffeeSteam(ctx, x + 32, y - 20);

    // Máy bán nước tự động mini bên phải
    ctx.fillStyle = '#4c1d95';
    ctx.fillRect(x + 95, y - 24, 36, 28);
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 95, y - 24, 36, 28);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 100, y - 20, 26, 12);

    ctx.restore();
  }

  /**
   * Cây nước khoáng nóng lạnh úp bình xanh
   */
  public static drawWaterCooler(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    // Thân máy trắng
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x - 8, y - 20, 16, 35);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 8, y - 20, 16, 35);

    // 2 Vòi nước nóng (đỏ) & lạnh (xanh)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x - 5, y - 4, 3, 4);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 2, y - 4, 3, 4);

    // Bình nước khoáng úp ngược màu xanh lam trong suốt
    ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
    ctx.beginPath();
    ctx.roundRect(x - 7, y - 36, 14, 16, 5);
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Bộ Sofa Da Nỉ Xanh & Bàn Trà Kính Tròn (Skyline Lounge)
   */
  public static drawLoungeSofaSuite(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    // Sofa dài 3 chỗ
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(x, y - 10, 110, 36, 6);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Đệm ngồi nỉ xanh
    ctx.fillStyle = '#0369a1';
    for (let c = 0; c < 3; c++) {
      ctx.fillRect(x + 6 + c * 34, y - 4, 30, 24);
    }

    // Bàn trà kính tròn nhỏ
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x + 150, y + 8, 22, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();
  }
}


