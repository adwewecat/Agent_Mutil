/**
 * Bộ dựng đồ họa Pixel Art 2.5D Isometric chuẩn phong cách The Pixel Office & Agent-Pixels
 * Tối ưu hóa không gian văn phòng thống nhất, không chồng chéo vật trang trí, Z-Depth sorting hoàn hảo
 */

import { Agent } from '../types';
import { ROOMS } from './mapData';

// Interface cho các thực thể có thể vẽ và sắp xếp theo trục Z (chiều sâu Y)
export interface ZDrawable {
  zY: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export class SpriteRenderer {
  /**
   * 1. Dựng nền tổng thể và kiến trúc văn phòng (Sàn nhà, Tường 3D, Cửa sổ kính, Vách ngăn phòng)
   */
  public static drawOfficeStructure(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Nền không gian tối bao quanh văn phòng
    ctx.fillStyle = '#060913';
    ctx.fillRect(0, 0, width, height);

    // Tường hậu phía sau văn phòng (Back Wall cao 80px có chiều sâu 3D Isometric)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(20, 20, width - 40, 60);

    // Gờ phào chỉ trần nhà phát sáng viền gỗ
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(20, 20, width - 40, 6);
    ctx.fillStyle = '#334155';
    ctx.fillRect(20, 26, width - 40, 2);

    // Phào chỉ chân tường 3D (Baseboard Skirting) chạy ngang phòng
    ctx.fillStyle = '#090d16';
    ctx.fillRect(20, 76, width - 40, 4);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(20, 76, width - 40, 1.5);

    // Các cửa sổ kính lớn Isometric (Windows) chiếu ánh sáng mặt trời ấm áp 4D (Pinterest Pin A & Pin B)
    const windows = [120, 280, 480, 680, 840];
    const time = Date.now() / 1000;
    windows.forEach((wx, idx) => {
      // 1. Cảnh ngoài cửa sổ: Bầu trời xanh ban ngày & tán cây xanh mát ngập nắng (như Pin A)
      const skyGrad = ctx.createLinearGradient(wx, 34, wx, 70);
      skyGrad.addColorStop(0, '#38bdf8');
      skyGrad.addColorStop(0.6, '#7dd3fc');
      skyGrad.addColorStop(1, '#bae6fd');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(wx, 34, 48, 36);

      // Tán lá cây xanh mát ngoài trời (Lush foliage in sunlight)
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(wx + 10, 65, 14, 0, Math.PI * 2);
      ctx.arc(wx + 30, 62, 16, 0, Math.PI * 2);
      ctx.arc(wx + 44, 68, 12, 0, Math.PI * 2);
      ctx.fill();

      // Đốm nắng xuyên qua kẽ lá
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(wx + 12, 60, 6, 0, Math.PI * 2);
      ctx.arc(wx + 28, 56, 8, 0, Math.PI * 2);
      ctx.fill();

      // Khung cửa sổ gỗ trắng cách tân 4 ô kính (White Architectural Window Panes - Pin A)
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2;
      ctx.strokeRect(wx, 34, 48, 36);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(wx + 23, 34, 2, 36); // Thanh dọc
      ctx.fillRect(wx, 51, 48, 2);      // Thanh ngang

      // Gờ bệ cửa sổ gỗ (Window Sill - Pin A)
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(wx - 3, 68, 54, 4);

      // 2. Chùm tia sáng mặt trời chiếu nghiêng 4D (Volumetric God Rays - Pin A)
      const rayAlpha = 0.08 + Math.sin(time * 1.5 + idx) * 0.03;
      const rayGrad = ctx.createLinearGradient(wx + 24, 70, wx + 60, 180);
      rayGrad.addColorStop(0, `rgba(254, 240, 138, ${rayAlpha * 1.6})`);
      rayGrad.addColorStop(0.5, `rgba(254, 240, 138, ${rayAlpha})`);
      rayGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');

      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(wx, 70);
      ctx.lineTo(wx + 48, 70);
      ctx.lineTo(wx + 110, 180);
      ctx.lineTo(wx + 20, 180);
      ctx.closePath();
      ctx.fill();

      // Vệt nắng chiếu sáng hình thang trên mặt sàn (Floor Sunlight Patch - Pin A)
      ctx.fillStyle = `rgba(254, 240, 138, ${rayAlpha * 0.7})`;
      ctx.beginPath();
      ctx.moveTo(wx + 20, 170);
      ctx.lineTo(wx + 105, 170);
      ctx.lineTo(wx + 125, 200);
      ctx.lineTo(wx + 30, 200);
      ctx.closePath();
      ctx.fill();

      // Hạt bụi bay lơ lửng trong vệt nắng (Animated Floating Dust Motes)
      for (let m = 0; m < 3; m++) {
        const moteX = wx + 15 + ((time * 8 + idx * 12 + m * 20) % 75);
        const moteY = 75 + ((time * 12 + idx * 15 + m * 30) % 95);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillRect(moteX, moteY, 1.5, 1.5);
      }
    });

    // Đổ bóng chiều sâu 4D chân tường hậu (Ambient Occlusion Shadow)
    const wallShadow = ctx.createLinearGradient(0, 80, 0, 115);
    wallShadow.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
    wallShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = wallShadow;
    ctx.fillRect(20, 80, width - 40, 35);

    // 1. Toàn bộ sàn văn phòng thống nhất gạch Isometric lam hoa cà / xanh tím nhạt chuẩn Pinterest Pin B (80 Elements Office Floor)
    this.drawIsometricOfficeTileFloor(ctx, 20, 80, width - 40, height - 100);

    // 2. Từng khu vực chức năng & Thảm trải sàn đặc thù (Zoned Rugs & Partitions)
    ROOMS.forEach(room => {
      ctx.save();
      if (room.id === 'director_office') {
        // Thảm sọc xanh ngọc bích phòng Giám đốc & Executive Lounge (Chuẩn hình ảnh tham khảo)
        this.drawEmeraldStripedRug(ctx, room.x + 20, room.y + 15, room.width - 40, room.height - 30);
      } else if (room.id === 'boardroom') {
        // Thảm xanh Navy hội nghị & thảo luận cao cấp
        this.drawNavyConferenceRug(ctx, room.x + 20, room.y + 20, room.width - 40, room.height - 35);
      } else if (room.id === 'kitchen_pantry') {
        // Gạch men trắng ceramic nhà bếp & khu giải lao
        this.drawCeramicFloor(ctx, room.x + 10, room.y + 10, room.width - 20, room.height - 20);
      }

      // Vách ngăn lửng kính mờ văn phòng (Office Cubicle Partitions với kính mờ & thanh nhôm)
      this.drawRoomPartition(ctx, room.x, room.y, room.width, room.height);

      // Biển LED tên phòng kiểu Pixel Art
      this.drawRoomBadge(ctx, room.id, room.x, room.y);

      ctx.restore();
    });

    // Hệ thống đèn trần hình nón công nghiệp phong cách Fallout Shelter Vault
    this.drawVaultIndustrialLighting(ctx);

    // Tường bao quanh toàn bộ văn phòng bên ngoài
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, width - 40, height - 40);
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
  private static drawIsometricOfficeTileFloor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
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

        // Tông màu gạch gốm lam nhạt xen kẽ chuẩn tranh tham khảo
        const isAlt = (Math.abs(c) + Math.abs(r)) % 2 === 0;
        ctx.fillStyle = isAlt ? '#c8d4ec' : '#bcc8e4';

        ctx.beginPath();
        ctx.moveTo(cx, cy - tileH / 2);
        ctx.lineTo(cx + tileW / 2, cy);
        ctx.lineTo(cx, cy + tileH / 2);
        ctx.lineTo(cx - tileW / 2, cy);
        ctx.closePath();
        ctx.fill();

        // Đường chỉ ron gạch isometric tinh tế
        ctx.strokeStyle = '#9aaac7';
        ctx.lineWidth = 0.75;
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
  private static drawEmeraldStripedRug(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
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
  private static drawNavyConferenceRug(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
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
  private static drawCeramicFloor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
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
  private static drawRoomPartition(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.save();
    // 1. Đế vách nỉ văn phòng hợp kim nhôm (Acoustic Fabric Cubicle Base)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);

    // 2. Tấm vách kính mờ văn phòng chạy viền trên (Frosted Glass Upper Screen - Pin B)
    ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
    ctx.fillRect(x + 1, y + 1, w - 2, 7);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(x + 1, y + 1, w - 2, 7);

    // Trụ góc nhôm văn phòng (Anodized Aluminum Corner Posts)
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x - 2, y - 2, 4, 12);
    ctx.fillRect(x + w - 2, y - 2, 4, 12);

    // Giấy ghi chú màu sắc dán trên vách kính (Colorful Sticky Notes - Pin B)
    ctx.fillStyle = '#fde047'; // Vàng
    ctx.fillRect(x + 22, y + 2, 4, 4);
    ctx.fillStyle = '#f472b6'; // Hồng
    ctx.fillRect(x + 36, y + 2, 4, 4);
    ctx.fillStyle = '#4ade80'; // Xanh lá
    ctx.fillRect(x + w - 26, y + 2, 4, 4);

    // 3. Cửa ra vào phòng rộng mở 48px với nẹp chỉ nhôm & thảm chuyển tiếp
    const doorW = 48;
    const doorX = x + w / 2 - doorW / 2;
    ctx.clearRect(doorX, y + h - 2, doorW, 4);
    ctx.fillStyle = '#cbd5e1'; // Nẹp ngưỡng cửa nhôm
    ctx.fillRect(doorX, y + h - 2, doorW, 3);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(doorX, y + h - 3, doorW, 1);
    ctx.restore();
  }

  /**
   * Biển LED tên phòng kiểu Pixel Art kiến trúc tinh tế, nhỏ gọn, tuyệt đối không che khuất đồ đạc hay người
   */
  private static drawRoomBadge(ctx: CanvasRenderingContext2D, roomId: string, x: number, y: number) {
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
  public static getFurnitureDrawables(agents: Agent[] = []): ZDrawable[] {
    const drawables: ZDrawable[] = [];

    // Kiểm tra nhân viên nào đang ngồi làm việc tại bàn
    const dung2AtDesk = agents.some(a => a.code === 'dung_2' && a.current_room === 'architect_office' && a.status !== 'moving');
    const dung3AtDesk = agents.some(a => a.code === 'dung_3' && a.current_room === 'dev_lab' && a.status !== 'moving');
    const dung4AtDesk = agents.some(a => a.code === 'dung_4' && a.current_room === 'games_room' && a.status !== 'moving');
    const dung1InBoardroom = agents.some(a => a.code === 'dung_1' && (a.current_room === 'boardroom' || a.status === 'debating') && a.status !== 'moving');
    const dung2InBoardroom = agents.some(a => a.code === 'dung_2' && (a.current_room === 'boardroom' || a.status === 'debating') && a.status !== 'moving');

    // ───────────────────────────────────────────────────────────────────────
    // 1. EXECUTIVE LOUNGE & DIRECTOR HUB DŨNG 1 (x: 30, y: 80, w: 280, h: 215)
    // ───────────────────────────────────────────────────────────────────────
    // Tranh nghệ thuật treo tường sau
    drawables.push({
      zY: 65,
      draw: ctx => this.drawWallArt(ctx, 150, 42, 45, 18, '#0284c7'),
    });
    // Tủ kính trưng bày tài liệu hồ sơ có file kẹp màu sắc
    drawables.push({
      zY: 110,
      draw: ctx => this.drawGlassFilingCabinet(ctx, 40, 85),
    });
    // Hộp hồ sơ tài liệu carton vàng/xanh
    drawables.push({
      zY: 112,
      draw: ctx => this.drawArchiveBoxes(ctx, 105, 88),
    });
    // Cây cảnh hình cầu Topiary trong chậu gốm nung
    drawables.push({
      zY: 120,
      draw: ctx => this.drawTopiaryPlant(ctx, 260, 92),
    });
    // Sofa nỉ góc Royal Blue kèm gối tựa cam trên thảm sọc xanh
    drawables.push({
      zY: 155,
      draw: ctx => this.drawModularBlueSofa(ctx, 75, 115, 135, 45),
    });
    // Bàn trà mặt kính tiếp khách với đĩa hoa quả tươi và tách cà phê
    drawables.push({
      zY: 190,
      draw: ctx => this.drawCoffeeTable(ctx, 110, 175),
    });

    // ───────────────────────────────────────────────────────────────────────
    // 2. CUBICLE KIẾN TRÚC SƯ & PM DŨNG 2 (x: 325, y: 80, w: 300, h: 215)
    // ───────────────────────────────────────────────────────────────────────
    // Kệ sách kỹ thuật sát tường sau
    drawables.push({
      zY: 95,
      draw: ctx => this.drawBookshelf(ctx, 335, 62),
    });
    // Kệ cây leo Ivy trên tường
    drawables.push({
      zY: 98,
      draw: ctx => this.drawWallIvyShelf(ctx, 435, 48),
    });
    // Mini Server Rack đèn LED
    drawables.push({
      zY: 105,
      draw: ctx => this.drawServerRack(ctx, 575, 60),
    });
    // Bàn làm việc kiến trúc sư (màn hình CAD, bản vẽ, thước T-square, khay tài liệu, PC tower)
    drawables.push({
      zY: 175,
      draw: ctx => this.drawArchitectDesk(ctx, 365, 145),
    });
    // Ghế xoay văn phòng nỉ xanh (chỉ vẽ ghế trống nếu Dũng 2 không ngồi tại bàn)
    if (!dung2AtDesk) {
      drawables.push({
        zY: 172,
        draw: ctx => this.drawOfficeSwivelChair(ctx, 413, 168),
      });
    }
    // Thùng rác inox công nghệ
    drawables.push({
      zY: 200,
      draw: ctx => this.drawTrashBin(ctx, 480, 195),
    });

    // ───────────────────────────────────────────────────────────────────────
    // 3. CUBICLE QA & SECURITY LEAD DŨNG 4 (x: 640, y: 80, w: 290, h: 215)
    // ───────────────────────────────────────────────────────────────────────
    // Poster quả địa cầu & biểu đồ công nghệ
    drawables.push({
      zY: 65,
      draw: ctx => this.drawGlobePoster(ctx, 775, 42),
    });
    // Tranh hoa tươi viền gỗ góc phải
    drawables.push({
      zY: 65,
      draw: ctx => this.drawFramedFloralArt(ctx, 895, 42),
    });
    // Tủ sideboard gắn tường màu xanh dương với cửa kính trượt
    drawables.push({
      zY: 85,
      draw: ctx => this.drawBlueWallSideboard(ctx, 675, 58),
    });
    // Bàn làm việc cubicle QA & Security (Vách kính mờ, Post-It notes, Màn hình CRT, desk phone, mug)
    drawables.push({
      zY: 175,
      draw: ctx => this.drawSecondaryOfficeDesk(ctx, 690, 145),
    });
    // Ghế xoay văn phòng nỉ xanh (chỉ vẽ ghế trống nếu Dũng 4 không ngồi tại bàn)
    if (!dung4AtDesk) {
      drawables.push({
        zY: 172,
        draw: ctx => this.drawOfficeSwivelChair(ctx, 714, 168),
      });
    }
    // Ghế xoay góc phòng có Cặp da nâu đặt trên ghế
    drawables.push({
      zY: 185,
      draw: ctx => this.drawBriefcaseOnChair(ctx, 875, 155),
    });

    // ───────────────────────────────────────────────────────────────────────
    // 4. KHU HẬU CẦN, BREAKOUT LOUNGE & BỐT TARDIS (x: 30, y: 310, w: 280, h: 200)
    // ───────────────────────────────────────────────────────────────────────
    // Bốt điện thoại Retro Tardis màu xanh dương ở góc
    drawables.push({
      zY: 365,
      draw: ctx => this.drawPoliceBoxTardis(ctx, 36, 325),
    });
    // Đồng hồ tròn treo tường màu xanh lá
    drawables.push({
      zY: 330,
      draw: ctx => this.drawRoundGreenClock(ctx, 140, 318),
    });
    // Tủ lạnh Inox có lò vi sóng trên nóc
    drawables.push({
      zY: 355,
      draw: ctx => this.drawRefrigeratorWithMicrowave(ctx, 75, 320),
    });
    // Quầy bếp & bồn rửa inox, máy pha espresso bốc khói
    drawables.push({
      zY: 365,
      draw: ctx => this.drawKitchenCounter(ctx, 125, 325),
    });
    // Bình nước nóng lạnh úp bình xanh
    drawables.push({
      zY: 365,
      draw: ctx => this.drawWaterDispenser(ctx, 205, 325),
    });
    // Máy bán nước tự động phát sáng LED
    drawables.push({
      zY: 365,
      draw: ctx => this.drawVendingMachine(ctx, 245, 320),
    });
    // Ghế băng sofa thư giãn & bàn uống nước
    drawables.push({
      zY: 440,
      draw: ctx => this.drawLoungeBench(ctx, 110, 420),
    });
    // Cây Topiary góc phòng pantry
    drawables.push({
      zY: 460,
      draw: ctx => this.drawTopiaryPlant(ctx, 260, 435),
    });

    // ───────────────────────────────────────────────────────────────────────
    // 5. DEV LAB & WORKSTATIONS DŨNG 3 (x: 325, y: 310, w: 300, h: 200)
    // ───────────────────────────────────────────────────────────────────────
    // Hộp lưu trữ tài liệu carton vàng/xanh
    drawables.push({
      zY: 345,
      draw: ctx => this.drawArchiveBoxes(ctx, 335, 325),
    });
    // Bàn làm việc Fullstack Dev chính (Dũng 3 - Chỗ số 3/7)
    drawables.push({
      zY: 395,
      draw: ctx => this.drawDevWorkstation(ctx, 355, 350),
    });
    // Ghế xoay nỉ xanh công thái học cho Dũng 3 (chỉ vẽ ghế trống nếu Dũng 3 không ngồi tại bàn)
    if (!dung3AtDesk) {
      drawables.push({
        zY: 375,
        draw: ctx => this.drawOfficeSwivelChair(ctx, 388, 372),
      });
    }
    // Bàn làm việc cubicle phụ / Peer Dev Desk (Chỗ số 5/7)
    drawables.push({
      zY: 395,
      draw: ctx => this.drawSecondaryOfficeDesk(ctx, 485, 350),
    });
    // Ghế xoay nỉ xanh cho Peer Dev
    drawables.push({
      zY: 405,
      draw: ctx => this.drawOfficeSwivelChair(ctx, 525, 410),
    });
    // Thùng rác lưới kim loại
    drawables.push({
      zY: 410,
      draw: ctx => this.drawTrashBin(ctx, 470, 395),
    });
    // Cây Monstera lá xẻ nhiệt đới đung đưa
    drawables.push({
      zY: 470,
      draw: ctx => this.drawPottedPlant(ctx, 580, 440),
    });

    // ───────────────────────────────────────────────────────────────────────
    // 6. KHU THẢO LUẬN, MÁY IN & CÂY BONSAI BOARDROOM (x: 640, y: 310, w: 290, h: 200)
    // ───────────────────────────────────────────────────────────────────────
    // Bảng kính kiến trúc trong suốt gắn tường
    drawables.push({
      zY: 340,
      draw: ctx => this.drawWhiteboard(ctx, 695, 318),
    });
    // Tủ kính trưng bày tài liệu hồ sơ có file kẹp màu sắc
    drawables.push({
      zY: 345,
      draw: ctx => this.drawGlassFilingCabinet(ctx, 648, 320),
    });
    // Ghế họp phía sau bàn họp hội nghị (chỉ vẽ ghế trống nếu Dũng 1/Dũng 2 chưa ngồi vào)
    if (!dung1InBoardroom) {
      drawables.push({
        zY: 338,
        draw: ctx => this.drawConferenceChair(ctx, 725, 335),
      });
    }
    if (!dung2InBoardroom) {
      drawables.push({
        zY: 338,
        draw: ctx => this.drawConferenceChair(ctx, 795, 335),
      });
    }
    // Bàn làm việc thảo luận đa năng / Conference Discussion Suite
    drawables.push({
      zY: 405,
      draw: ctx => this.drawConferenceTableSurface(ctx, 680, 350),
    });
    // Máy photocopy / in laser đa năng văn phòng có thùng rác tái chế
    drawables.push({
      zY: 385,
      draw: ctx => this.drawOfficeCopier(ctx, 830, 345),
    });
    // Cây Bonsai Nhật Bản trên đôn gỗ trắc
    drawables.push({
      zY: 435,
      draw: ctx => this.drawBonsaiTree(ctx, 885, 410),
    });
    // Cây cảnh Topiary góc phòng
    drawables.push({
      zY: 465,
      draw: ctx => this.drawTopiaryPlant(ctx, 655, 445),
    });

    return drawables;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CÁC HÀM DỰNG NỘI THẤT CHI TIẾT PIXEL ART
  // ─────────────────────────────────────────────────────────────────────────



  /**
   * Bàn họp hội đồng lớn bằng gỗ óc chó (Executive Boat-Shaped Boardroom Suite)
   */
  private static drawConferenceTableSurface(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 195;
    const h = 68;

    ctx.save();
    // Đổ bóng bàn họp xuống sàn ngọc thạch
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.roundRect(x + 6, y + 6, w, h, 14);
    ctx.fill();

    // Mặt bàn gỗ óc chó vát góc oval (Boat-shape)
    const tableGrad = ctx.createLinearGradient(x, y, x, y + h);
    tableGrad.addColorStop(0, '#451a03');
    tableGrad.addColorStop(0.5, '#5c2406');
    tableGrad.addColorStop(1, '#3b1502');

    ctx.fillStyle = tableGrad;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 12);
    ctx.fill();

    // Viền vát cạnh bóng kim loại mạ đồng
    ctx.strokeStyle = '#85370d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 12);
    ctx.stroke();

    // Hộp quản lý dây cáp trung tâm bằng nhôm xước (Cable Raceway & Outlets)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 45, y + 26, 105, 16);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 45, y + 26, 105, 16);

    // Cổng cắm điện & mạng LED
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(x + 55, y + 33, 4, 3);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 65, y + 33, 4, 3);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x + 135, y + 33, 4, 3);

    // Thảm đệm da đặt máy tính tại 4 góc ngồi (Leather Blotters)
    const blotters = [
      [x + 18, y + 8], [x + 138, y + 8],
      [x + 18, y + 46], [x + 138, y + 46]
    ];
    blotters.forEach(([bx, by]) => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(bx, by, 38, 14, 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // 2 Laptop siêu mỏng mở sẵn đang trình chiếu slide chiến lược
    // Laptop 1
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x + 24, y + 9, 24, 12);
    ctx.fillStyle = '#0284c7'; // Màn hình xanh dương
    ctx.fillRect(x + 26, y + 10, 20, 9);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x + 28, y + 12, 10, 2);
    ctx.fillRect(x + 28, y + 15, 14, 2);

    // Laptop 2
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x + 145, y + 9, 24, 12);
    ctx.fillStyle = '#047857'; // Màn hình xanh lá
    ctx.fillRect(x + 147, y + 10, 20, 9);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x + 149, y + 12, 12, 2);
    ctx.fillRect(x + 149, y + 15, 8, 2);

    // Ly nước thủy tinh có đá mát lạnh
    ctx.fillStyle = 'rgba(186, 230, 253, 0.6)';
    ctx.fillRect(x + 85, y + 10, 6, 8);
    ctx.fillRect(x + 105, y + 10, 6, 8);

    ctx.restore();
  }

  /**
   * Ghế xoay văn phòng công thái học bánh xe nỉ xanh Royal Blue (Pinterest Pin B - Ergonomic Rolling Office Chair)
   */
  private static drawOfficeSwivelChair(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
   * Ghế họp văn phòng xoay nỉ xanh Royal Blue (Pinterest Pin B - Conference Swivel Chair)
   */
  private static drawConferenceChair(ctx: CanvasRenderingContext2D, x: number, y: number) {
    this.drawOfficeSwivelChair(ctx, x, y);
  }

  /**
   * Bàn làm việc cubicle phụ chuẩn công sở 80 Elements (Pinterest Pin B - Secondary Cubicle Desk Spot)
   */
  private static drawSecondaryOfficeDesk(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
  private static drawDevWorkstation(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
  private static drawArchitectDesk(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
   * Sofa góc nỉ Royal Blue kèm gối tựa cam trên thảm sọc xanh (Pinterest Pin B - Luxury Modular Lounge)
   */
  private static drawModularBlueSofa(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.save();

    // 1. Thảm trải sàn sọc xanh ngọc bích (Pinterest Pin B - Emerald Green Striped Area Rug)
    const rugW = w + 36;
    const rugH = h + 28;
    const rugX = x - 18;
    const rugY = y - 4;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(rugX + 4, rugY + 4, rugW, rugH);

    // Nền thảm xanh
    ctx.fillStyle = '#15803d';
    ctx.fillRect(rugX, rugY, rugW, rugH);

    // Các sọc xanh lá sáng song song
    ctx.fillStyle = '#22c55e';
    for (let sx = rugX + 6; sx < rugX + rugW - 6; sx += 12) {
      ctx.fillRect(sx, rugY + 2, 6, rugH - 4);
    }
    // Viền thảm thêu
    ctx.strokeStyle = '#166534';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rugX, rugY, rugW, rugH);

    // 2. Đổ bóng sofa xuống thảm
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.roundRect(x - 3, y + 4, w + 6, h + 4, 6);
    ctx.fill();

    // 3. 4 Chân sofa gỗ sồi tự nhiên vát thon (Tapered Oak Legs)
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 4, y + h - 1, 4, 5);
    ctx.fillRect(x + w - 8, y + h - 1, 4, 5);
    ctx.fillRect(x + w / 2 - 2, y + h - 1, 4, 5);

    // 4. Tựa lưng sofa màu Royal Blue (Tufted Modular Backrest)
    const backGrad = ctx.createLinearGradient(x, y, x, y + 16);
    backGrad.addColorStop(0, '#1e40af');
    backGrad.addColorStop(1, '#1d4ed8');
    ctx.fillStyle = backGrad;
    ctx.beginPath();
    ctx.roundRect(x, y, w, 16, 4);
    ctx.fill();

    // Chỉ may múi đệm tựa lưng
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 1;
    for (let c = 1; c < 4; c++) {
      const cx = x + (w / 4) * c;
      ctx.beginPath();
      ctx.moveTo(cx, y + 1);
      ctx.lineTo(cx, y + 15);
      ctx.stroke();
    }

    // 5. Đệm ngồi nỉ Royal Blue êm ái đa khối (Plush Modular Seat Cushions)
    const seatGrad = ctx.createLinearGradient(x, y + 15, x, y + h);
    seatGrad.addColorStop(0, '#2563eb');
    seatGrad.addColorStop(1, '#1d4ed8');
    ctx.fillStyle = seatGrad;
    ctx.beginPath();
    ctx.roundRect(x + 2, y + 14, w - 4, h - 14, 3);
    ctx.fill();

    // Mép đệm bóng sáng
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(x + 4, y + 15, w - 8, 2);

    // Phân rãnh giữa các khối ghế
    ctx.strokeStyle = '#172554';
    ctx.lineWidth = 1.5;
    for (let c = 1; c < 4; c++) {
      const cx = x + (w / 4) * c;
      ctx.beginPath();
      ctx.moveTo(cx, y + 15);
      ctx.lineTo(cx, y + h);
      ctx.stroke();
    }

    // 6. Tay vịn sofa 2 bên
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.roundRect(x - 5, y + 4, 8, h - 4, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(x + w - 3, y + 4, 8, h - 4, 4);
    ctx.fill();

    // Viền tay vịn
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(x - 4, y + 5, 2, h - 6);
    ctx.fillRect(x + w + 1, y + 5, 2, h - 6);

    // 7. Gối tựa màu cam rực rỡ ở 2 góc (Pinterest Pin B - Vibrant Orange Throw Pillows)
    // Gối góc trái
    ctx.save();
    ctx.translate(x + 8, y + 16);
    ctx.rotate(-0.15);
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.roundRect(0, 0, 14, 14, 3);
    ctx.fill();
    ctx.fillStyle = '#fb923c';
    ctx.fillRect(2, 2, 10, 3);
    ctx.strokeStyle = '#9a3412';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // Gối góc phải
    ctx.save();
    ctx.translate(x + w - 22, y + 14);
    ctx.rotate(0.18);
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.roundRect(0, 0, 14, 14, 3);
    ctx.fill();
    ctx.fillStyle = '#fdba74';
    ctx.fillRect(2, 2, 10, 3);
    ctx.strokeStyle = '#c2410c';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  /**
   * Bàn trà tiếp khách mặt kính cường lực khung mạ đồng với 2 tách cà phê nóng
   */
  private static drawCoffeeTable(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 64;
    const h = 26;

    ctx.save();
    // Đổ bóng bàn trà
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.roundRect(x + 2, y + 4, w, h, 4);
    ctx.fill();

    // Khung kim loại mạ vàng đồng (Brass Leg Frame)
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(x + 4, y + 6, 2, h - 6);
    ctx.fillRect(x + w - 6, y + 6, 2, h - 6);
    ctx.fillRect(x + 4, y + h - 2, w - 8, 2);

    // Kệ dưới bằng gỗ óc chó (Lower Magazine Shelf)
    ctx.fillStyle = '#3f1f0a';
    ctx.fillRect(x + 6, y + 16, w - 12, 6);
    // Tạp chí kiến trúc đặt bên dưới
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(x + 12, y + 17, 16, 4);

    // Mặt bàn gỗ bóng màu xanh Teal sẫm vát cạnh chuẩn Pinterest Pin B (Dark Teal Coffee Table Top)
    ctx.fillStyle = '#0f2942';
    ctx.beginPath();
    ctx.roundRect(x, y, w, 14, 3);
    ctx.fill();

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Vệt sáng phản chiếu góc kính (Glass Glint)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 6, y + 3);
    ctx.lineTo(x + 20, y + 3);
    ctx.stroke();

    // 1. Đĩa gốm hoa quả tươi đầy màu sắc ở giữa bàn (Fruit Bowl - Pinterest Pin B signature)
    const bowlX = x + w / 2;
    const bowlY = y + 7;
    // Bát gốm trắng
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(bowlX, bowlY, 9, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Táo đỏ tươi
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(bowlX - 3.5, bowlY - 1, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Quả cam vàng
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(bowlX + 3.5, bowlY - 1, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Quả táo xanh nhỏ
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(bowlX, bowlY - 2.5, 2, 0, Math.PI * 2);
    ctx.fill();

    // 2. Tách cà phê gốm trắng bốc khói 2 bên
    // Tách 1 bên trái
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x + 10, y + 4, 7, 6);
    ctx.fillStyle = '#451a03'; // Cà phê
    ctx.fillRect(x + 11, y + 5, 5, 2);
    this.drawCoffeeSteam(ctx, x + 13, y + 4);

    // Tách 2 bên phải
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x + w - 17, y + 4, 7, 6);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x + w - 16, y + 5, 5, 2);
    this.drawCoffeeSteam(ctx, x + w - 14, y + 4);

    ctx.restore();
  }

  /**
   * Kệ sách thép & gỗ công nghiệp chuẩn Tech Workshop (Pinterest Pin 1)
   */
  private static drawBookshelf(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
  private static drawServerRack(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
  private static drawWhiteboard(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
   * Bốt điện thoại retro / Tardis màu xanh dương ở góc phòng (Iconic signature từ hình ảnh tham khảo)
   */
  private static drawPoliceBoxTardis(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 28;
    const h = 58;
    ctx.save();
    // Đổ bóng bốt điện thoại
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(x + 2, y + 4, w, h);

    // Thân bốt điện thoại màu xanh navy hoàng gia
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);

    // Nóc mái dốc bốt điện thoại
    ctx.fillStyle = '#172554';
    ctx.beginPath();
    ctx.moveTo(x - 2, y);
    ctx.lineTo(x + w + 2, y);
    ctx.lineTo(x + w - 4, y - 6);
    ctx.lineTo(x + 4, y - 6);
    ctx.closePath();
    ctx.fill();

    // Đèn nhỏ trên đỉnh
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x + w / 2 - 2, y - 9, 4, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + w / 2 - 1, y - 8, 2, 2);

    // Biển hiệu chữ trắng trên đỉnh "POLICE BOX"
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 2, y + 2, w - 4, 6);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 4.5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BOX', x + w / 2, y + 6.5);

    // 4 Ô kính cửa sổ màu trắng xanh
    const winW = 9;
    const winH = 11;
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(x + 3, y + 11, winW, winH);
    ctx.fillRect(x + 16, y + 11, winW, winH);
    ctx.fillRect(x + 3, y + 25, winW, winH);
    ctx.fillRect(x + 16, y + 25, winW, winH);

    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 3, y + 11, winW, winH);
    ctx.strokeRect(x + 16, y + 11, winW, winH);
    ctx.strokeRect(x + 3, y + 25, winW, winH);
    ctx.strokeRect(x + 16, y + 25, winW, winH);

    // Các pano cửa dưới
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(x + 3, y + 39, winW, 14);
    ctx.fillRect(x + 16, y + 39, winW, 14);
    ctx.strokeStyle = '#172554';
    ctx.strokeRect(x + 3, y + 39, winW, 14);
    ctx.strokeRect(x + 16, y + 39, winW, 14);

    // Tay nắm cửa bạc
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x + 13, y + 32, 2, 4);
    ctx.restore();
  }

  /**
   * Chú mèo trắng đốm cam đang cuộn tròn ngủ trên bàn làm việc (Chi tiết đáng yêu từ hình ảnh tham khảo)
   */
  private static drawSleepingCat(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
  private static drawBlueWallSideboard(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
  private static drawBriefcaseOnChair(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
  private static drawFramedFloralArt(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
  private static drawGlobePoster(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
  private static drawRoundGreenClock(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
  private static drawArchiveBoxes(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
  private static drawKitchenCounter(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
   * Tủ lạnh Inox 2 cánh có Lò vi sóng điện tử trên nóc (Pinterest Pin A - Cozy Tech Kitchen Suite)
   */
  private static drawRefrigeratorWithMicrowave(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 32;
    const h = 54;

    ctx.save();

    // ───────────────────────────────────────────────────────────────────────
    // 1. LÒ VI SÓNG ĐẶT TRÊN NÓC TỦ LẠNH (Pinterest Pin A - Microwave on Fridge)
    // ───────────────────────────────────────────────────────────────────────
    const mwW = 28;
    const mwH = 15;
    const mwX = x + 2;
    const mwY = y - 16;

    // Bóng đổ lò vi sóng xuống nóc tủ lạnh
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(mwX + 2, y - 2, mwW - 4, 3);

    // Vỏ máy lò vi sóng kim loại màu xám than
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(mwX, mwY, mwW, mwH, 2);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Cửa kính tối màu quan sát khoang lò
    ctx.fillStyle = '#090d16';
    ctx.fillRect(mwX + 2, mwY + 2, 17, mwH - 4);
    // Vệt phản chiếu ánh sáng trên cửa kính lò
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mwX + 4, mwY + 3);
    ctx.lineTo(mwX + 11, mwY + 3);
    ctx.stroke();

    // Tay nắm cửa lò vi sóng
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(mwX + 17, mwY + 3, 1.5, mwH - 6);

    // Bảng điều khiển điện tử
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(mwX + 20, mwY + 2, 6, mwH - 4);

    // Màn hình số LED xanh Cyan phát sáng "0:45"
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(mwX + 21, mwY + 3, 4, 2);

    // Núm vặn hẹn giờ & các phím bấm
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(mwX + 22, mwY + 7, 2, 2);
    ctx.fillStyle = '#ef4444'; // Nút Start/Stop đỏ
    ctx.fillRect(mwX + 22, mwY + 10, 2, 1.5);

    // ───────────────────────────────────────────────────────────────────────
    // 2. THÂN TỦ LẠNH THÉP XƯỚC KHÔNG GỈ (Stainless Steel Refrigerator)
    // ───────────────────────────────────────────────────────────────────────
    const fridgeGrad = ctx.createLinearGradient(x, y, x + w, y);
    fridgeGrad.addColorStop(0, '#94a3b8');
    fridgeGrad.addColorStop(0.5, '#e2e8f0');
    fridgeGrad.addColorStop(1, '#64748b');

    ctx.fillStyle = fridgeGrad;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 2);
    ctx.fill();

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Khe phân cách ngăn đá trên và ngăn mát dưới
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y + 18);
    ctx.lineTo(x + w, y + 18);
    ctx.stroke();

    // 2 Tay nắm thanh dài bằng hợp kim
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 4, y + 5, 2, 9);
    ctx.fillRect(x + 4, y + 22, 2, 24);

    // Màn hình LED nhiệt độ điện tử (-18°C / 4°C)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 12, y + 5, 14, 6);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 14, y + 7, 10, 2);

    // Giấy ghi chú nam châm dán trên cửa
    ctx.fillStyle = '#fde047';
    ctx.fillRect(x + 16, y + 25, 6, 6);
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(x + 18, y + 35, 5, 5);

    ctx.restore();
  }

  /**
   * Tủ kính sách đứng khung xanh Royal Blue có chậu hoa trên nóc (Pinterest Pin B - Signature Blue Glass Cabinet)
   */
  private static drawGlassFilingCabinet(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
  private static drawOfficeCopier(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
  private static drawTopiaryPlant(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
  private static drawBonsaiTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
  private static drawWallIvyShelf(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
   * Máy bán nước tự động có đèn LED phát sáng (Pinterest Pin 2)
   */
  private static drawVendingMachine(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 34;
    const h = 54;

    ctx.save();
    // Thùng máy kim loại sơn xám đậm
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 3);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Biển hiệu "COLD DRINKS" phát sáng
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(x + 3, y + 3, w - 6, 7);
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(x + 6, y + 5, 12, 2);

    // Cửa kính trưng bày 3 tầng lon nước giải khát
    ctx.fillStyle = '#020617';
    ctx.fillRect(x + 4, y + 12, w - 8, 24);

    // 3 Hàng lon nước nhiều màu
    const cans = ['#ef4444', '#10b981', '#3b82f6'];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.fillStyle = cans[c];
        ctx.fillRect(x + 6 + c * 8, y + 15 + r * 10, 5, 7);
      }
    }

    // Khe nhả tiền & nút bấm
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 4, y + 38, w - 8, 12);
    ctx.fillStyle = '#ef4444'; // Khe xu đỏ
    ctx.fillRect(x + 8, y + 40, 4, 2);
    ctx.fillStyle = '#22c55e'; // Khe nhả lon
    ctx.fillRect(x + 8, y + 44, 18, 4);

    ctx.restore();
  }

  /**
   * Cây nước nóng lạnh hiện đại
   */
  private static drawWaterDispenser(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
  private static drawLoungeBench(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#581c87';
    ctx.fillRect(x, y, 80, 22);
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(x + 2, y + 2, 76, 5);
  }

  /**
   * Chậu cây xanh nhiệt đới Monstera / Ficus 4D chân thực
   */
  private static drawPottedPlant(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
  private static drawWallArt(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string) {
    ctx.fillStyle = '#eab308'; // Khung vàng
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = c;
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  }



  /**
   * Thùng rác inox
   */
  private static drawTrashBin(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x, y, 12, 15);
    ctx.fillStyle = '#475569';
    ctx.fillRect(x, y, 12, 3);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 3. VẼ 4 DŨNG CHUẨN XÁC, ANIMATION ĐẸP, ĐÚNG TƯ THẾ LÀM VIỆC
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Vẽ Nhân vật cho 4 Dũng: Mô phỏng cử chỉ 2.5D Isometric chân thật nhất (Chuẩn tranh Habbo / Pinterest)
   * Tự động xoay người, gập chân ngồi ghế, vươn tay gõ phím cơ, ngồi họp đối thoại tranh luận sống động
   */
  public static drawAgent(ctx: CanvasRenderingContext2D, agent: Agent, frame: number, _spriteImg?: HTMLImageElement) {
    const x = agent.pos_x;
    const y = agent.pos_y;
    const isMoving = agent.status === 'moving';

    ctx.save();

    // ─────────────────────────────────────────────────────────────────────
    // 1. NHÂN VẬT ĐANG DI CHUYỂN: DÁNG ĐI BỘ 4 KHUNG HÌNH TỰ NHIÊN
    // ─────────────────────────────────────────────────────────────────────
    if (isMoving) {
      const facingLeft = agent.target_x < agent.pos_x;
      this.drawWalkingAgent(ctx, x, y, frame, agent, facingLeft);
    }
    // ─────────────────────────────────────────────────────────────────────
    // 2. PHÒNG HỌP BOARDROOM: NGỒI GHẾ HỌP XOAY NGƯỜI ĐỐI THOẠI TRANH LUẬN
    // ─────────────────────────────────────────────────────────────────────
    else if (agent.current_room === 'boardroom' || agent.status === 'debating') {
      const isLeftSpeaker = agent.code === 'dung_1';
      this.drawSittingBoardroomAgent(ctx, x, y, frame, agent, isLeftSpeaker);
    }
    // ─────────────────────────────────────────────────────────────────────
    // 3. SOFA GIÁM ĐỐC: DŨNG 1 NGỒI LÚN SÂU VÀO ĐỆM SOFA, CẦM TÁCH CÀ PHÊ BỐC KHÓI
    // ─────────────────────────────────────────────────────────────────────
    else if (agent.code === 'dung_1' && agent.current_room === 'director_office') {
      this.drawSittingSofaDirector(ctx, x, y, frame, agent);
    }
    // ─────────────────────────────────────────────────────────────────────
    // 4. DEV LAB: DŨNG 3 NGỒI GHẾ XOAY CÔNG THÁI HỌC, GÕ BÀN PHÍM CƠ 2 MÀN HÌNH
    // ─────────────────────────────────────────────────────────────────────
    else if (agent.code === 'dung_3' && agent.current_room === 'dev_lab') {
      this.drawSittingDevAgent(ctx, x, y, frame, agent);
    }
    // ─────────────────────────────────────────────────────────────────────
    // 5. CUBICLE KIẾN TRÚC SƯ: DŨNG 2 NGỒI TRƯỚC BÀN VẼ CAD & BLUEPRINT
    // ─────────────────────────────────────────────────────────────────────
    else if (agent.code === 'dung_2' && agent.current_room === 'architect_office') {
      this.drawSittingArchitectAgent(ctx, x, y, frame, agent);
    }
    // ─────────────────────────────────────────────────────────────────────
    // 6. CUBICLE QA: DŨNG 4 NGỒI TRẠM KIỂM THỬ CHẠY STRESS TEST 5,000 TPS
    // ─────────────────────────────────────────────────────────────────────
    else if (agent.code === 'dung_4' && agent.current_room === 'games_room') {
      this.drawSittingQAAgent(ctx, x, y, frame, agent);
    }
    // ─────────────────────────────────────────────────────────────────────
    // 7. KHU PANTRY: ĐỨNG THƯỞNG THỨC CÀ PHÊ NÓNG GIẢI LAO
    // ─────────────────────────────────────────────────────────────────────
    else if (agent.current_room === 'kitchen_pantry' || agent.status === 'resting') {
      this.drawStandingPantryAgent(ctx, x, y, frame, agent);
    }
    // ─────────────────────────────────────────────────────────────────────
    // 8. ĐỨNG NGHỈ THÔNG THƯỜNG KHÁC (IDLE STANDING)
    // ─────────────────────────────────────────────────────────────────────
    else {
      this.drawIdleStandingAgent(ctx, x, y, frame, agent);
    }

    // ─────────────────────────────────────────────────────────────────────
    // BẢNG TÊN & BONG BÓNG SUY NGHĨ FALLOUT SHELTER
    // ─────────────────────────────────────────────────────────────────────
    const headTopY = isMoving ? y - 35 - Math.abs(Math.sin(frame * 0.25)) * 2 : y - 32;

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
  private static drawSittingDevAgent(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, _agent: Agent) {
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

    // Cổ & Khuôn mặt nghiêng 3/4 nhìn vào màn hình
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 5, y - 24, 10, 10);
    // Mắt chăm chú nhìn màn hình code
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 3, y - 20, 2, 2);
    ctx.fillRect(x + 2, y - 20, 2, 2);
    ctx.fillStyle = '#4ade80'; // Ánh sáng xanh hắt lên mắt
    ctx.fillRect(x - 2, y - 20, 1, 1);
    ctx.fillRect(x + 3, y - 20, 1, 1);

    // Tóc nâu cắt gọn gàng
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(x - 6, y - 27, 12, 5);
    ctx.fillRect(x - 7, y - 24, 2, 6);
    ctx.fillRect(x + 5, y - 24, 2, 5);

    // Tai nghe Gaming Coding màu Cyan viền bạc trên tai
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(x - 8, y - 22, 3, 6);
    ctx.fillRect(x + 5, y - 22, 3, 6);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x - 7.5, y - 20, 2, 2);
    ctx.fillRect(x + 5.5, y - 20, 2, 2);
    // Vành tai nghe vắt qua đỉnh đầu
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y - 25, 6, Math.PI, 0);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Dũng 2 ngồi ghế xoay trước bàn vẽ CAD & Blueprint, tay cầm thước T và chuột thiết kế
   */
  private static drawSittingArchitectAgent(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, _agent: Agent) {
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

    // Cổ & Khuôn mặt
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 5, y - 24, 10, 10);

    // Tóc muối tiêu 40 năm kinh nghiệm
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x - 6, y - 27, 12, 5);
    ctx.fillRect(x - 7, y - 24, 2, 6);
    ctx.fillRect(x + 5, y - 24, 2, 6);

    // Kính gọng vàng trí thức
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 4, y - 21, 3.5, 3);
    ctx.strokeRect(x + 0.5, y - 21, 3.5, 3);
    ctx.beginPath();
    ctx.moveTo(x - 0.5, y - 20);
    ctx.lineTo(x + 0.5, y - 20);
    ctx.stroke();

    // Mắt tập trung vào bản vẽ kiến trúc
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 3, y - 20, 1.5, 1.5);
    ctx.fillRect(x + 1.5, y - 20, 1.5, 1.5);

    ctx.restore();
  }

  /**
   * Dũng 4 ngồi ghế xoay trạm QA & Security, tay gõ phím chạy ma trận Stress Test 5,000 TPS
   */
  private static drawSittingQAAgent(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, _agent: Agent) {
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

    // Khuôn mặt
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 5, y - 24, 10, 10);
    // Mắt
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 3, y - 20, 2, 2);
    ctx.fillRect(x + 1, y - 20, 2, 2);

    // Mũ an ninh đỏ
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(x - 6, y - 28, 12, 6);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x - 7, y - 24, 5, 2);

    ctx.restore();
  }

  /**
   * Ngồi họp thảo luận chiến lược tại bàn Boardroom lớn (Xoay người 3/4 đối thoại trực tiếp, cử chỉ tay sống động)
   */
  private static drawSittingBoardroomAgent(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number,
    _agent: Agent,
    isLeftSpeaker: boolean
  ) {
    ctx.save();
    // 1. Tựa lưng ghế họp da màu đen quyền lực phía sau (High-Back Executive Leather Chair)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(x - 11, y - 26, 22, 28, 4);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 8, y - 24, 16, 5);

    // 2. Thân người ngồi sau bàn:
    if (isLeftSpeaker) {
      // DŨNG 1: Software Director - Xoay 3/4 nhìn sang PHẢI (về phía Dũng 2)
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(x - 7, y - 14, 14, 14);
      ctx.fillStyle = '#f8fafc'; // Sơ mi trắng
      ctx.fillRect(x - 2, y - 14, 5, 5);
      ctx.fillStyle = '#dc2626'; // Cà vạt đỏ quyền lực
      ctx.fillRect(x, y - 11, 2, 7);

      // Tay trái đặt trên bàn họp cạnh laptop
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(x - 9, y - 12, 3, 6);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(x - 8, y - 5, 4, 4);

      // Tay phải giơ lên chỉ trỏ / giải thích chiến lược kinh doanh (Gesture Animation)
      const gestureBob = Math.sin(frame * 0.12) * 2;
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(x + 6, y - 12 + gestureBob, 4, 5);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(x + 8, y - 15 + gestureBob, 4, 5);
      ctx.fillRect(x + 10, y - 18 + gestureBob, 2, 4);

      // Đầu & Khuôn mặt hướng sang PHẢI
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(x - 4, y - 24, 10, 10);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 2, y - 20, 2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 3, y - 20, 1, 1);
      // Miệng đang phát biểu
      const mouthOpen = Math.floor(frame / 6) % 2 === 0 ? 2 : 1;
      ctx.fillStyle = '#831843';
      ctx.fillRect(x + 4, y - 17, 2, mouthOpen);

      // Tóc đen vuốt phong độ
      ctx.fillStyle = '#090d16';
      ctx.fillRect(x - 5, y - 27, 11, 5);
      ctx.fillRect(x - 6, y - 24, 3, 6);
      ctx.fillRect(x + 3, y - 25, 3, 3);
    } else {
      // DŨNG 2: Architect & PM - Xoay 3/4 nhìn sang TRÁI (về phía Dũng 1)
      ctx.fillStyle = '#475569';
      ctx.fillRect(x - 7, y - 14, 14, 14);
      ctx.fillStyle = '#f8fafc'; // Sơ mi trắng
      ctx.fillRect(x - 3, y - 14, 5, 5);
      ctx.fillStyle = '#1e40af'; // Cà vạt navy
      ctx.fillRect(x - 2, y - 11, 2, 7);

      // Tay phải đặt trên laptop gõ kiến trúc
      ctx.fillStyle = '#475569';
      ctx.fillRect(x + 6, y - 12, 3, 6);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(x + 5, y - 5, 4, 4);

      // Tay trái vung ra phản biện rủi ro hệ thống (Counter-debate gesture)
      const gestureBob = Math.cos(frame * 0.12) * 2;
      ctx.fillStyle = '#475569';
      ctx.fillRect(x - 10, y - 12 + gestureBob, 4, 5);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(x - 12, y - 15 + gestureBob, 5, 5);

      // Đầu & Khuôn mặt hướng sang TRÁI
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(x - 6, y - 24, 10, 10);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x - 4, y - 20, 2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 4, y - 20, 1, 1);
      // Kính gọng vàng
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 5, y - 21, 4, 3);

      // Miệng đối thoại phản biện
      const mouthOpen = Math.floor(frame / 6) % 2 === 1 ? 2 : 1;
      ctx.fillStyle = '#831843';
      ctx.fillRect(x - 5, y - 17, 2, mouthOpen);

      // Tóc muối tiêu 40 năm KN
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x - 6, y - 27, 11, 5);
      ctx.fillRect(x + 3, y - 24, 3, 6);
    }

    ctx.restore();
  }

  /**
   * Dũng 1 ngồi lún sâu vào đệm sofa nỉ Royal Blue, tay cầm tách cà phê nóng có khói bốc lên
   */
  private static drawSittingSofaDirector(ctx: CanvasRenderingContext2D, x: number, y: number, _frame: number, _agent: Agent) {
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

    // 6. Khuôn mặt Giám đốc thư thái, tự tin
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 5, y - 24, 10, 10);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 3, y - 20, 2, 2);
    ctx.fillRect(x + 2, y - 20, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 3, y - 20, 1, 1);
    ctx.fillRect(x + 2, y - 20, 1, 1);

    // Nụ cười tự tin
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(x - 1, y - 17, 3, 1);

    // Tóc đen vuốt slicked-back bóng bẩy
    ctx.fillStyle = '#090d16';
    ctx.fillRect(x - 6, y - 27, 12, 5);
    ctx.fillRect(x - 7, y - 24, 2, 6);
    ctx.fillRect(x + 5, y - 24, 2, 6);

    ctx.restore();
  }

  /**
   * Đứng giải lao tại khu vực Pantry, 2 tay nâng tách cà phê thưởng thức
   */
  private static drawStandingPantryAgent(ctx: CanvasRenderingContext2D, x: number, y: number, _frame: number, agent: Agent) {
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
  private static drawWalkingAgent(
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
  private static drawIdleStandingAgent(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, agent: Agent) {
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
  private static drawAgentTorso(ctx: CanvasRenderingContext2D, x: number, y: number, agent: Agent) {
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
   * Vẽ khuôn mặt, mắt, kính, tai nghe và kiểu tóc của 4 Dũng
   */
  private static drawAgentHead(ctx: CanvasRenderingContext2D, x: number, y: number, agent: Agent) {
    // Khuôn mặt
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 5, y - 20, 10, 10);

    // Mắt
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 3, y - 16, 2, 2);
    ctx.fillRect(x + 1, y - 16, 2, 2);

    // Tóc & phụ kiện
    if (agent.code === 'dung_1') {
      ctx.fillStyle = '#090d16'; // Tóc đen phong độ
      ctx.fillRect(x - 6, y - 23, 12, 5);
      ctx.fillRect(x - 7, y - 20, 2, 6);
      ctx.fillRect(x + 5, y - 20, 2, 5);
    } else if (agent.code === 'dung_2') {
      ctx.fillStyle = '#94a3b8'; // Tóc muối tiêu
      ctx.fillRect(x - 6, y - 23, 12, 5);
      ctx.fillRect(x - 7, y - 20, 2, 6);
      ctx.fillRect(x + 5, y - 20, 2, 6);
      // Kính gọng vàng
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 4, y - 17, 3.5, 3);
      ctx.strokeRect(x + 0.5, y - 17, 3.5, 3);
    } else if (agent.code === 'dung_3') {
      ctx.fillStyle = '#1c1917'; // Tóc nâu sẫm
      ctx.fillRect(x - 6, y - 23, 12, 5);
      // Tai nghe coding cyan
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(x - 7, y - 19, 2.5, 6);
      ctx.fillRect(x + 4.5, y - 19, 2.5, 6);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(x, y - 21, 5, Math.PI, 0);
      ctx.stroke();
    } else {
      // Mũ an ninh đỏ
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(x - 6, y - 24, 12, 6);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x - 8, y - 20, 5, 2);
    }
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
        icon = '🔍';
        borderColor = '#f59e0b';
        textColor = '#fef08a';
      } else {
        text = 'Rủi ro & Kiến trúc';
        icon = '⚙️';
        borderColor = '#c084fc';
        textColor = '#f3e8ff';
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

    const displayText = `${icon} ${text}`;
    const w = Math.min(145, displayText.length * 5.6 + 16);
    const h = 15;

    // Hộp bong bóng thoại bo góc mềm mại
    ctx.save();
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, bubbleY - h - 14, w, h, 4);
    ctx.fill();

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, bubbleY - h - 14, w, h, 4);
    ctx.stroke();

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
    ctx.textAlign = 'center';
    ctx.fillText(displayText, x, bubbleY - 18);
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
}
