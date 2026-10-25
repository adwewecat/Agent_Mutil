/**
 * Bộ dựng đồ họa Pixel Art 2.5D Isometric chuẩn phong cách Agent-Pixels
 * Dựng nội thất phòng bida, quầy pantry, phòng họp, dev lab và 4 Dũng chi tiết cao
 */

import { Agent } from '../types';
import { ROOMS } from './mapData';

export class SpriteRenderer {
  /**
   * Vẽ lớp nền tổng thể: Sàn phòng, hành lang gạch caro, tường 3D, và đồ nội thất tĩnh phía sau
   */
  public static drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // 1. Nền tổng thể văn phòng (Vùng không gian tối bao quanh)
    ctx.fillStyle = '#080d1a';
    ctx.fillRect(0, 0, width, height);

    // 2. Vẽ hành lang trung tâm gạch caro đen trắng (Checkerboard Hallway)
    this.drawCheckerboardHallway(ctx);

    // 3. Vẽ từng phòng chức năng với sàn gạch đặc thù
    ROOMS.forEach(room => {
      ctx.save();

      // Sàn phòng
      if (room.id === 'dev_lab' || room.id === 'architect_office') {
        this.drawParquetFloor(ctx, room.x, room.y, room.width, room.height);
      } else if (room.id === 'kitchen_pantry') {
        this.drawCeramicFloor(ctx, room.x, room.y, room.width, room.height);
      } else if (room.id === 'games_room') {
        this.drawLavenderTiles(ctx, room.x, room.y, room.width, room.height);
      } else if (room.id === 'boardroom') {
        this.drawTealCarpet(ctx, room.x, room.y, room.width, room.height);
      } else {
        this.drawSapphireFloor(ctx, room.x, room.y, room.width, room.height);
      }

      // Tường dày 2.5D Isometric (Wall Depth & Shadow)
      this.draw3DWalls(ctx, room.x, room.y, room.width, room.height);

      // Biển LED tên phòng kiểu Pixel Art
      this.drawRoomBadge(ctx, room.name, room.x, room.y);

      ctx.restore();
    });

    // 4. Vẽ đồ nội thất phía sau (tủ sách, tranh, đồng hồ, bảng trắng, pantry, sofa, ghế dãy trên bàn họp)
    this.drawBackgroundFurniture(ctx);
  }

  /**
   * Vẽ lớp đồ nội thất phía trước (bàn họp, bàn dev lab, bàn bida, bàn trà, ghế dãy dưới)
   * Lớp này được vẽ SAU nhân vật ngồi ghế sau để mặt bàn che thân dưới một cách tự nhiên
   */
  public static drawForeground(ctx: CanvasRenderingContext2D) {
    this.drawForegroundFurniture(ctx);
  }

  /**
   * Tương thích ngược: vẽ cả nền và bàn ghế
   */
  public static drawMap(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.drawBackground(ctx, width, height);
    this.drawForeground(ctx);
  }

  /**
   * Vẽ hành lang gạch caro đen trắng (Checkerboard) kinh điển của Agent-Pixels
   */
  private static drawCheckerboardHallway(ctx: CanvasRenderingContext2D) {
    const startX = 250;
    const startY = 20;
    const endX = 570;
    const endY = 280;
    const tileSize = 20;

    for (let x = startX; x < endX; x += tileSize) {
      for (let y = startY; y < endY; y += tileSize) {
        const isWhite = (Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0;
        ctx.fillStyle = isWhite ? '#f1f5f9' : '#1e293b';
        ctx.fillRect(x, y, tileSize, tileSize);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, tileSize, tileSize);
      }
    }
  }

  /**
   * Vẽ sàn gỗ sồi Parquet vân gỗ phòng Dev & Kiến trúc
   */
  private static drawParquetFloor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    const plankH = 14;
    const plankW = 48;
    for (let py = y; py < y + h; py += plankH) {
      const rowIdx = Math.floor((py - y) / plankH);
      const offset = (rowIdx % 2) * (plankW / 2);
      for (let px = x - offset; px < x + w; px += plankW) {
        // Tạo sắc độ màu gỗ tự nhiên
        const seed = (Math.sin(px * 12.9898 + py * 78.233) * 43758.5453) % 1;
        const tone = Math.floor(Math.abs(seed) * 20);
        ctx.fillStyle = `rgb(${110 + tone}, ${75 + tone}, ${40 + tone})`;
        ctx.fillRect(Math.max(x, px), py, Math.min(plankW, x + w - px), plankH);

        // Đường chỉ rãnh vân gỗ
        ctx.strokeStyle = 'rgba(40, 20, 10, 0.45)';
        ctx.lineWidth = 1;
        ctx.strokeRect(Math.max(x, px), py, Math.min(plankW, x + w - px), plankH);
      }
    }
  }

  /**
   * Vẽ sàn gạch men trắng ceramic bóng bẩy khu bếp pantry
   */
  private static drawCeramicFloor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.fillStyle = '#f8fafc';
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
   * Vẽ sàn hoa văn tím lavender phòng giải trí bida & arcade
   */
  private static drawLavenderTiles(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.fillStyle = '#4a2559';
    ctx.fillRect(x, y, w, h);
    const sz = 24;
    for (let px = x; px < x + w; px += sz) {
      for (let py = y; py < y + h; py += sz) {
        ctx.fillStyle = (Math.floor((px - x) / sz) + Math.floor((py - y) / sz)) % 2 === 0 ? '#582d6b' : '#3f1f4c';
        ctx.fillRect(px, py, sz, sz);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.strokeRect(px, py, sz, sz);
      }
    }
  }

  /**
   * Vẽ thảm xanh ngọc thạch phòng họp hội đồng Boardroom
   */
  private static drawTealCarpet(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.fillStyle = '#16384c';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
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
   * Vẽ thảm sapphire phòng giám đốc
   */
  private static drawSapphireFloor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.fillStyle = '#1a3152';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
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
   * Dựng tường 3D có độ sâu Isometric, gờ nẹp và bóng đổ
   */
  private static draw3DWalls(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    // Tường trên cùng có độ sâu dày 12px
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x, y, w, 12);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, y, w, 4); // Gờ viền sáng trên đỉnh tường

    // Tường bao quanh
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    // Cửa ra vào phòng cắt rãnh (Doorway Cutout)
    const doorW = 32;
    const doorX = x + w / 2 - doorW / 2;
    ctx.fillStyle = '#92400e';
    ctx.fillRect(doorX, y + h - 4, doorW, 4); // Ngưỡng cửa gỗ
  }

  /**
   * Biển LED tên phòng
   */
  private static drawRoomBadge(ctx: CanvasRenderingContext2D, name: string, x: number, y: number) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(x + 10, y + 16, name.length * 7.5 + 16, 18);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 10, y + 16, name.length * 7.5 + 16, 18);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillText(name, x + 16, y + 29);
  }

  /**
   * Vẽ đồ nội thất tầng nền (gắn tường, sau ghế)
   */
  private static drawBackgroundFurniture(ctx: CanvasRenderingContext2D) {
    // 1. PHÒNG GIẢI TRÍ BIDA (Tường & Máy Arcade phía sau)
    this.drawArcadeCabinet(ctx, 290, 310);
    this.drawWallArt(ctx, 480, 295, 30, 20, '#d97706');

    // 2. PHÒNG GIÁM ĐỐC (Sofa dài đỏ & Tranh tường, Cây xanh sau)
    this.drawLuxuryRedSofa(ctx, 550, 45, 90, 30);
    this.drawArmchair(ctx, 520, 85, true);
    this.drawArmchair(ctx, 660, 85, false);
    this.drawPottedFicus(ctx, 515, 30);
    this.drawPottedFicus(ctx, 680, 30);
    this.drawWallArt(ctx, 600, 25, 40, 16, '#0284c7');

    // 3. KHU BẾP PANTRY (Quầy bếp, Tủ lạnh, Máy bán nước, Bình nước gắn tường)
    this.drawWaterDispenser(ctx, 750, 35);
    this.drawVendingMachine(ctx, 785, 35);
    this.drawKitchenCounter(ctx, 840, 40);
    this.drawRefrigerator(ctx, 905, 35);
    this.drawPottedFicus(ctx, 905, 160);
    this.drawWallClock(ctx, 845, 28);

    // 4. PHÒNG KIẾN TRÚC SƯ DŨNG 2 (Tủ sách, Server Rack, Đồng hồ tường)
    this.drawBookshelf(ctx, 35, 35);
    this.drawBookshelf(ctx, 95, 35);
    this.drawServerRack(ctx, 205, 35);
    this.drawPottedFicus(ctx, 165, 35);
    this.drawWallClock(ctx, 145, 28);

    // 5. DEV LAB DŨNG 3 (Tủ sách dev, Cây cảnh)
    this.drawBookshelf(ctx, 35, 440);
    this.drawPottedFicus(ctx, 200, 240);
    this.drawPottedFicus(ctx, 200, 460);

    // 6. PHÒNG HỌP BOARDROOM (Bảng trắng, Đồng hồ, Tủ tài liệu credenza, Cây cảnh)
    this.drawWhiteboard(ctx, 740, 240);
    this.drawWallClock(ctx, 715, 240);
    this.drawCredenza(ctx, 660, 480);
    this.drawPottedFicus(ctx, 905, 245);
    this.drawPottedFicus(ctx, 905, 475);
    // Ghế họp DÃY TRÊN (topChairs) - Được vẽ trước để nhân vật ngồi vào trước mặt ghế
    this.drawConferenceTopChairs(ctx, 640, 330);
  }

  /**
   * Vẽ đồ nội thất tầng nổi phía trước (Bàn họp, bàn dev lab, bàn bida, bàn trà, ghế trước)
   */
  private static drawForegroundFurniture(ctx: CanvasRenderingContext2D) {
    // 1. Bàn Bida chuẩn kích thước, nỉ xanh, bóng & gậy cơ
    this.drawBilliardTable(ctx, 350, 360);
    this.drawTrashBin(ctx, 285, 490);

    // 2. Bàn trà tiếp khách phòng Giám đốc
    this.drawCoffeeTable(ctx, 570, 95);

    // 3. Bàn làm việc kiến trúc sư Dũng 2
    this.drawWorkstationDesk(ctx, 100, 110, 80, '#38bdf8');

    // 4. Các bàn làm việc Dev Lab Dũng 3
    this.drawWorkstationDesk(ctx, 40, 260, 65, '#22c55e');
    this.drawWorkstationDesk(ctx, 130, 260, 65, '#22c55e');
    this.drawWorkstationDesk(ctx, 80, 360, 80, '#22c55e');

    // 5. Mặt bàn họp Hội đồng lớn & Laptop, khay tài liệu, bình hoa
    // (Được vẽ ĐÈ LÊN chân nhân vật ngồi dãy trên để tạo cảm giác ngồi họp thật 100%)
    this.drawConferenceTableSurface(ctx, 640, 330);

    // 6. Ghế họp DÃY DƯỚI (bottomChairs)
    this.drawConferenceBottomChairs(ctx, 640, 330);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CÁC HÀM DỰNG NỘI THẤT CHI TIẾT
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Bàn Bida (Billiard Table) chuẩn đẹp giống ảnh mẫu
   */
  private static drawBilliardTable(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 140;
    const h = 80;

    // Chân bàn gỗ bóng
    ctx.fillStyle = '#3e1f0e';
    ctx.fillRect(x + 10, y + h, 14, 18);
    ctx.fillRect(x + w - 24, y + h, 14, 18);

    // Viền khung gỗ thành bàn
    ctx.fillStyle = '#5c2d13';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#7a3e1b';
    ctx.fillRect(x + 2, y + 2, w - 4, 6);

    // Mặt nỉ xanh bida đặc trưng
    ctx.fillStyle = '#15803d';
    ctx.fillRect(x + 10, y + 10, w - 20, h - 20);

    // 6 Lỗ bida (Pockets)
    ctx.fillStyle = '#0f172a';
    const pockets = [
      [x + 10, y + 10], [x + w / 2, y + 8], [x + w - 10, y + 10],
      [x + 10, y + h - 10], [x + w / 2, y + h - 8], [x + w - 10, y + h - 10],
    ];
    pockets.forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Các quả bóng bi-a màu sắc (Đỏ, vàng, xanh, trắng)
    const balls = [
      { x: x + 45, y: y + 35, color: '#ef4444' },
      { x: x + 53, y: y + 42, color: '#eab308' },
      { x: x + 48, y: y + 48, color: '#3b82f6' },
      { x: x + 100, y: y + 36, color: '#f8fafc' }, // Bi cái trắng
    ];
    balls.forEach(b => {
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Gậy cơ bida bằng gỗ đặt chéo trên bàn
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 95, y + 40);
    ctx.lineTo(x + 60, y + 62);
    ctx.stroke();
  }

  /**
   * Máy trò chơi Arcade Retro màu tím neon
   */
  private static drawArcadeCabinet(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#581c87';
    ctx.fillRect(x, y, 36, 68);
    // Viền sáng marquee
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(x + 4, y + 4, 28, 10);
    // Màn hình arcade đang hiển thị game pixel
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 4, y + 18, 28, 22);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(x + 8, y + 24, 6, 6);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(x + 20, y + 28, 6, 6);

    // Bàn điều khiển: cần joystick đỏ và 2 nút
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(x + 2, y + 42, 32, 12);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(x + 12, y + 46, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 22, y + 45, 3, 3);
    ctx.fillRect(x + 27, y + 45, 3, 3);
  }

  /**
   * Sofa da đỏ sang trọng phòng tiếp khách Giám đốc
   */
  private static drawLuxuryRedSofa(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    // Tựa lưng sofa
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(x, y, w, 14);
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(x + 2, y + 2, w - 4, 10);

    // Đệm ngồi sofa
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x, y + 14, w, h - 14);
    // Tay vịn 2 bên
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(x - 6, y + 6, 8, h - 6);
    ctx.fillRect(x + w - 2, y + 6, 8, h - 6);
  }

  /**
   * Ghế bành da đỏ
   */
  private static drawArmchair(ctx: CanvasRenderingContext2D, x: number, y: number, isLeft: boolean) {
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(x, y, 26, 32);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x + 3, y + 3, 20, 24);
    // Tay vịn
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(isLeft ? x - 4 : x + 24, y + 4, 6, 26);
  }

  /**
   * Bàn trà gỗ tiếp khách với 2 tách cà phê
   */
  private static drawCoffeeTable(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x, y, 50, 24);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x + 2, y + 2, 46, 6);

    // 2 Tách cà phê trắng
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x + 12, y + 8, 7, 6);
    ctx.fillRect(x + 30, y + 10, 7, 6);
    ctx.fillStyle = '#451a03'; // Nước cà phê
    ctx.fillRect(x + 13, y + 9, 5, 2);
    ctx.fillRect(x + 31, y + 11, 5, 2);
  }

  /**
   * Cây cảnh Ficus / Monstera trong chậu đất nung
   */
  private static drawPottedFicus(ctx: CanvasRenderingContext2D, x: number, y: number) {
    // Chậu đất nung
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(x + 4, y + 16, 16, 16);
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(x + 2, y + 14, 20, 4);

    // Thân cây & Lá xanh pixel
    ctx.fillStyle = '#14532d';
    ctx.fillRect(x + 10, y + 6, 4, 10);
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(x + 6, y + 6, 8, 0, Math.PI * 2);
    ctx.arc(x + 18, y + 4, 9, 0, Math.PI * 2);
    ctx.arc(x + 12, y - 2, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(x + 10, y + 2, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Tủ sách gỗ đầy sách nhiều màu (như ảnh mẫu)
   */
  private static drawBookshelf(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#5c2d13';
    ctx.fillRect(x, y, 42, 64);
    ctx.strokeStyle = '#381a07';
    ctx.strokeRect(x, y, 42, 64);

    // 3 Tầng kệ sách
    for (let shelf = 0; shelf < 3; shelf++) {
      const sy = y + 14 + shelf * 18;
      ctx.fillStyle = '#381a07';
      ctx.fillRect(x + 2, sy, 38, 2);

      // Sách các màu: đỏ, xanh, vàng, tím, lục
      const colors = ['#ef4444', '#3b82f6', '#eab308', '#10b981', '#a855f7', '#f97316'];
      for (let b = 0; b < 6; b++) {
        ctx.fillStyle = colors[(shelf * 2 + b) % colors.length];
        ctx.fillRect(x + 4 + b * 6, sy - 12, 5, 12);
      }
    }
  }

  /**
   * Bình nước khoáng nóng lạnh (Water Dispenser có bình tròn xanh dương)
   */
  private static drawWaterDispenser(ctx: CanvasRenderingContext2D, x: number, y: number) {
    // Bình nước úp ngược xanh dương trong suốt
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(x + 10, y + 8, 8, 0, Math.PI * 2);
    ctx.fill();
    // Thân máy trắng
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x + 2, y + 14, 16, 36);
    // Vòi nước đỏ & xanh
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + 5, y + 26, 3, 4);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(x + 12, y + 26, 3, 4);
  }

  /**
   * Máy bán nước tự động (Vending Machine)
   */
  private static drawVendingMachine(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#475569';
    ctx.fillRect(x, y, 32, 54);
    // Kính trưng bày lon nước
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 4, y + 6, 24, 28);
    // Lon nước nhiều màu
    const canColors = ['#ef4444', '#22c55e', '#3b82f6', '#eab308'];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.fillStyle = canColors[(r * 3 + c) % canColors.length];
        ctx.fillRect(x + 6 + c * 7, y + 10 + r * 12, 5, 8);
      }
    }
    // Khe nhả lon
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 6, y + 42, 20, 6);
  }

  /**
   * Quầy bếp & Bồn rửa Inox (Kitchen Counter)
   */
  private static drawKitchenCounter(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x, y, 58, 38);
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(x, y, 58, 6); // Mặt đá bếp

    // Bồn rửa Inox & vòi nước
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + 10, y + 8, 22, 18);
    ctx.fillStyle = '#0284c7'; // Nước trong bồn
    ctx.fillRect(x + 12, y + 10, 18, 14);
    ctx.fillStyle = '#cbd5e1'; // Vòi rửa inox cong
    ctx.fillRect(x + 20, y + 3, 3, 8);
  }

  /**
   * Tủ lạnh 2 cánh trắng (Refrigerator)
   */
  private static drawRefrigerator(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x, y, 26, 54);
    ctx.strokeStyle = '#94a3b8';
    ctx.strokeRect(x, y, 26, 54);
    // Ngăn trên
    ctx.beginPath();
    ctx.moveTo(x, y + 20);
    ctx.lineTo(x + 26, y + 20);
    ctx.stroke();
    // Tay nắm cửa
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + 3, y + 12, 2, 6);
    ctx.fillRect(x + 3, y + 24, 2, 8);
  }

  /**
   * Bàn làm việc Workstation (có máy tính, màn hình LED, bàn phím)
   */
  private static drawWorkstationDesk(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, screenColor: string) {
    // Mặt bàn gỗ
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x, y, w, 32);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x + 2, y + 2, w - 4, 6);

    // Màn hình máy tính để bàn (PC Monitor)
    const monitorX = x + w / 2 - 14;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(monitorX, y - 16, 28, 18);
    ctx.fillStyle = screenColor; // Màn hình sáng
    ctx.fillRect(monitorX + 2, y - 14, 24, 14);

    // Bàn phím cơ & Chuột
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + w / 2 - 12, y + 12, 18, 6);
    ctx.fillStyle = '#ef4444'; // Cốc cà phê
    ctx.fillRect(x + w - 14, y + 10, 6, 8);

    // Ghế xoay văn phòng có tựa lưng
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + w / 2 - 8, y + 24, 16, 12);
  }

  /**
   * Ghế họp DÃY TRÊN (topChairs) - Vẽ trong Background
   */
  private static drawConferenceTopChairs(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const topChairs = [x + 25, x + 75, x + 125, x + 175];
    topChairs.forEach(cx => {
      ctx.fillStyle = '#15803d';
      ctx.fillRect(cx, y - 14, 18, 14);
      ctx.fillStyle = '#166534';
      ctx.fillRect(cx + 2, y - 12, 14, 4);
    });
  }

  /**
   * Mặt bàn họp Hội đồng lớn & Laptop, tài liệu, bình hoa - Vẽ trong Foreground đè lên chân nhân vật dãy trên
   */
  private static drawConferenceTableSurface(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 220;
    const h = 75;

    // Mặt bàn họp gỗ sồi bóng
    ctx.fillStyle = '#5c2d13';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.fill();
    ctx.strokeStyle = '#381a07';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Laptop hội nghị mở sẵn với màn hình phát sáng
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x + 175, y + 16, 22, 16);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 177, y + 18, 18, 12);

    // Khay tài liệu & bình hoa trung tâm
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 85, y + 24, 40, 16);
    ctx.fillStyle = '#22c55e'; // Chậu cây nhỏ trên bàn
    ctx.beginPath();
    ctx.arc(x + 105, y + 32, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Ghế họp DÃY DƯỚI (bottomChairs) - Vẽ trong Foreground
   */
  private static drawConferenceBottomChairs(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const h = 75;
    const bottomChairs = [x + 25, x + 75, x + 125, x + 175];
    bottomChairs.forEach(cx => {
      ctx.fillStyle = '#15803d';
      ctx.fillRect(cx, y + h, 18, 14);
      ctx.fillStyle = '#166534';
      ctx.fillRect(cx + 2, y + h + 8, 14, 4);
    });
  }

  /**
   * Bàn họp hội đồng đầy đủ (Hỗ trợ render trọn gói khi cần)
   */
  public static drawConferenceTable(ctx: CanvasRenderingContext2D, x: number, y: number) {
    this.drawConferenceTopChairs(ctx, x, y);
    this.drawConferenceTableSurface(ctx, x, y);
    this.drawConferenceBottomChairs(ctx, x, y);
  }

  /**
   * Bảng trắng kiến trúc lớn (Architecture Whiteboard)
   */
  private static drawWhiteboard(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x, y, 100, 40);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 100, 40);

    // Sơ đồ kiến trúc vẽ trên bảng (Boxes & Arrows)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 10, y + 8, 20, 12);
    ctx.strokeStyle = '#10b981';
    ctx.strokeRect(x + 65, y + 8, 22, 12);

    // Mũi tên kết nối
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(x + 30, y + 14);
    ctx.lineTo(x + 65, y + 14);
    ctx.stroke();

    // Khay để bút viết bảng
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 20, y + 40, 50, 3);
  }

  /**
   * Đồng hồ treo tường kim tròn
   */
  private static drawWallClock(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Kim đồng hồ
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 3, y - 4);
    ctx.moveTo(x, y);
    ctx.lineTo(x - 3, y + 2);
    ctx.stroke();
  }

  /**
   * Tranh nghệ thuật treo tường viền vàng
   */
  private static drawWallArt(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, mainColor: string) {
    ctx.fillStyle = mainColor;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#d97706'; // Viền khung mạ vàng
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
  }

  /**
   * Tủ tài liệu phòng họp (Credenza)
   */
  private static drawCredenza(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, y, 120, 24);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(x, y, 120, 24);
    for (let d = 0; d < 4; d++) {
      ctx.strokeRect(x + d * 30, y, 30, 24);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x + d * 30 + 13, y + 10, 4, 3);
    }
  }

  /**
   * Server Rack đèn LED
   */
  private static drawServerRack(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x, y, 34, 65);
    ctx.strokeStyle = '#475569';
    ctx.strokeRect(x, y, 34, 65);
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#22c55e' : '#38bdf8';
      ctx.fillRect(x + 5, y + 8 + i * 9, 4, 3);
      ctx.fillStyle = '#334155';
      ctx.fillRect(x + 13, y + 8 + i * 9, 16, 3);
    }
  }

  /**
   * Thùng rác inox nhỏ
   */
  private static drawTrashBin(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x, y, 12, 16);
    ctx.fillStyle = '#475569';
    ctx.fillRect(x, y, 12, 3);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 5. VẼ NHÂN VẬT PIXEL 4 DŨNG CHI TIẾT CAO & ANIMATION SỐNG ĐỘNG
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Vẽ Nhân vật Pixel Art cho 4 Dũng kèm animation chân, tư thế ngồi ghế, gõ phím, cầm cơ bida
   */
  public static drawAgent(ctx: CanvasRenderingContext2D, agent: Agent, frame: number, isBehindTable: boolean = false) {
    const x = agent.pos_x;
    const y = agent.pos_y;
    const isMoving = agent.status === 'moving';

    // Animation nhịp bước chân 4 frame
    const walkCycle = Math.floor((frame / 8) % 4);
    const legOffset = isMoving ? (walkCycle === 0 ? -4 : walkCycle === 2 ? 4 : 0) : 0;
    const bodyBob = isMoving ? Math.abs(Math.sin(frame * 0.25)) * 2 : 0;
    const charY = isBehindTable ? y - 4 : y - bodyBob;

    ctx.save();

    // 1. Nếu ngồi sau bàn họp (isBehindTable): Không vẽ chân dài dưới đất, để bàn che tự nhiên
    if (isBehindTable) {
      // Tựa lưng ghế họp xanh lá phía sau lưng
      ctx.fillStyle = '#166534';
      ctx.fillRect(x - 10, charY - 14, 20, 16);

      // Thân áo & Quần
      ctx.fillStyle = agent.code === 'dung_1' ? '#1e3a8a' : agent.code === 'dung_2' ? '#581c87' : '#065f46';
      ctx.fillRect(x - 9, charY - 8, 18, 14);

      // Cổ áo sơ mi & Cà vạt
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(x - 4, charY - 8, 8, 4);
      ctx.fillStyle = agent.code === 'dung_1' ? '#38bdf8' : '#c084fc';
      ctx.fillRect(x - 1.5, charY - 6, 3, 9);

      // Cánh tay đặt trang nghiêm lên bàn họp và cử chỉ tranh luận
      ctx.fillStyle = '#fbcfe8'; // Màu da tay
      if (agent.status === 'debating') {
        const gesture = Math.sin(frame * 0.2) * 3;
        // Tay trái đặt trên bàn
        ctx.fillRect(x - 13, charY + 2, 6, 6);
        // Tay phải giơ lên tranh luận phản biện
        ctx.fillRect(x + 8, charY - 2 + gesture, 6, 6);
      } else {
        ctx.fillRect(x - 12, charY + 2, 5, 6);
        ctx.fillRect(x + 7, charY + 2, 5, 6);
      }
    } else {
      // ───────────────────────────────────────────────────────────────────────
      // CÁC TƯ THẾ KHI Ở PHÒNG RIÊNG HOẶC DI CHUYỂN
      // ───────────────────────────────────────────────────────────────────────

      // 1. Tựa lưng ghế xoay nếu Dũng 3 đang ngồi tại bàn Dev Lab hoặc Dũng 2 tại phòng Kiến trúc
      if (!isMoving && agent.code === 'dung_3' && agent.current_room === 'dev_lab') {
        // Tựa ghế xoay văn phòng màu đen sau lưng Dũng 3
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x - 11, charY - 12, 22, 16);
        ctx.fillStyle = '#334155';
        ctx.fillRect(x - 9, charY - 10, 18, 12);
      } else if (!isMoving && agent.code === 'dung_2' && agent.current_room === 'architect_office') {
        // Ghế da xoay Kiến trúc sư
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(x - 11, charY - 12, 22, 16);
      }

      // 2. Bóng đổ mềm dưới chân (chỉ khi đứng hoặc đi)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(x, y + 16, 13, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // 3. Chân & Giày da
      ctx.fillStyle = '#0f172a';
      if (!isMoving && (agent.current_room === 'director_office' || agent.current_room === 'dev_lab')) {
        // Ngồi ghế: Chân gập ngắn gọn gàng
        ctx.fillRect(x - 6, charY + 8, 5, 6);
        ctx.fillRect(x + 1, charY + 8, 5, 6);
      } else {
        // Đứng hoặc đi bộ
        ctx.fillRect(x - 7, charY + 8 - legOffset, 5, 9 + legOffset);
        ctx.fillRect(x + 2, charY + 8 + legOffset, 5, 9 - legOffset);
      }

      // 4. Quần dài
      ctx.fillStyle = agent.code === 'dung_1' ? '#1e293b' : agent.code === 'dung_2' ? '#334155' : agent.code === 'dung_3' ? '#1e293b' : '#450a0a';
      ctx.fillRect(x - 8, charY + 3, 16, 7);

      // 5. Áo đặc trưng cho từng Dũng
      if (agent.code === 'dung_1') {
        // DŨNG 1: Vest xanh Navy + Cà vạt xanh
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(x - 10, charY - 11, 20, 16);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(x - 4, charY - 11, 8, 4);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x - 1.5, charY - 9, 3, 11);
      } else if (agent.code === 'dung_2') {
        // DŨNG 2: Áo gile tím lịch lãm
        ctx.fillStyle = '#581c87';
        ctx.fillRect(x - 10, charY - 11, 20, 16);
        ctx.fillStyle = '#e9d5ff';
        ctx.fillRect(x - 4, charY - 11, 8, 4);
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(x - 2, charY - 9, 4, 4);
      } else if (agent.code === 'dung_3') {
        // DŨNG 3: Hoodie xanh Hacker
        ctx.fillStyle = '#065f46';
        ctx.fillRect(x - 10, charY - 11, 20, 16);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(x - 5, charY - 4, 10, 7);
      } else {
        // DŨNG 4: Áo khoác an ninh đỏ + Thẻ vàng
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(x - 10, charY - 11, 20, 16);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(x - 6, charY - 7, 5, 5);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(x + 2, charY - 6, 4, 4);
      }

      // 6. Cánh tay & Hành động (Gõ bàn phím, vung tay khi đi, hoặc cầm gậy bida)
      ctx.fillStyle = '#fbcfe8';
      if (!isMoving && agent.code === 'dung_3' && agent.current_room === 'dev_lab') {
        // DŨNG 3 ĐANG GÕ CODE: 2 tay vươn về phía trước bàn phím cơ nhấp nháy liên tục
        const keyType = Math.sin(frame * 0.6) * 2;
        ctx.fillRect(x - 8, charY - 4 + keyType, 5, 7);
        ctx.fillRect(x + 3, charY - 4 - keyType, 5, 7);
      } else if (!isMoving && agent.code === 'dung_4' && agent.current_room === 'games_room') {
        // DŨNG 4 ĐANG CHƠI BIDA: Cầm cây gậy cơ bằng gỗ chĩa sang phải vào bàn bida
        ctx.fillRect(x - 8, charY - 2, 5, 6);
        ctx.fillRect(x + 4, charY - 4, 5, 6);
        // Gậy cơ bida bằng gỗ sồi vàng
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x - 10, charY + 6);
        ctx.lineTo(x + 24, charY - 6);
        ctx.stroke();
      } else if (isMoving) {
        ctx.fillRect(x - 13, charY - 7 - legOffset, 4, 10);
        ctx.fillRect(x + 9, charY - 7 + legOffset, 4, 10);
      } else {
        ctx.fillRect(x - 13, charY - 7, 4, 11);
        ctx.fillRect(x + 9, charY - 7, 4, 11);
      }
    }

    // 6. Khuôn mặt Pixel
    ctx.fillStyle = '#fed7aa'; // Màu da mặt ấm áp
    ctx.fillRect(x - 8, charY - 26, 16, 15);

    // 7. Mắt và Miệng
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 5, charY - 20, 3, 3);
    ctx.fillRect(x + 2, charY - 20, 3, 3);
    // Điểm sáng trong mắt
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 5, charY - 20, 1, 1);
    ctx.fillRect(x + 2, charY - 20, 1, 1);

    // 8. Tóc & Đặc điểm nhận dạng chuẩn 4 Dũng
    if (agent.code === 'dung_1') {
      // Tóc đen tỉa gọn gàng phong độ Giám đốc
      ctx.fillStyle = '#090d16';
      ctx.fillRect(x - 9, charY - 30, 18, 7);
      ctx.fillRect(x - 10, charY - 26, 3, 8);
      ctx.fillRect(x + 7, charY - 26, 3, 6);
    } else if (agent.code === 'dung_2') {
      // Tóc muối tiêu ánh bạc (40 năm kinh nghiệm) + Kính mắt gọng vàng thông thái
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x - 9, charY - 30, 18, 7);
      ctx.fillRect(x - 10, charY - 26, 3, 8);
      ctx.fillRect(x + 7, charY - 26, 3, 8);
      // Kính gọng vàng
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x - 6, charY - 21, 5, 4);
      ctx.strokeRect(x + 1, charY - 21, 5, 4);
    } else if (agent.code === 'dung_3') {
      // Tai nghe Gaming/Coding trùm tai màu xanh cyan
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x - 9, charY - 30, 18, 6); // Tóc nâu đậm
      ctx.fillStyle = '#38bdf8'; // Vành tai nghe
      ctx.fillRect(x - 9, charY - 31, 18, 3);
      ctx.fillRect(x - 11, charY - 25, 4, 8); // Chụp tai trái
      ctx.fillRect(x + 7, charY - 25, 4, 8); // Chụp tai phải
    } else {
      // Nón kết bảo hộ / Mũ lưỡi trai an ninh đỏ
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(x - 9, charY - 31, 18, 7);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x - 12, charY - 26, 8, 3); // Vành mũ chìa ra
    }

    // 9. Bảng tên Pixel nổi trên đầu
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(x - 28, charY - 50, 56, 16);
    ctx.strokeStyle = agent.avatar_color;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 28, charY - 50, 56, 16);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(agent.name, x, charY - 38);

    // 10. Bong bóng trạng thái động (Tranh luận / Code / Test)
    if (agent.status === 'debating') {
      this.drawSpeechBubble(ctx, x, charY - 56, '💬 TRANH LUẬN');
    } else if (agent.status === 'coding') {
      this.drawSpeechBubble(ctx, x, charY - 56, '⚡ CLEAN CODE');
    } else if (agent.status === 'testing') {
      this.drawSpeechBubble(ctx, x, charY - 56, '🛡️ STRESS TEST');
    }

    ctx.restore();
  }

  /**
   * Vẽ bóng hội thoại Pixel
   */
  private static drawSpeechBubble(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
    const w = text.length * 7 + 12;
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x - w / 2, y - 14, w, 15);
    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - w / 2, y - 14, w, 15);

    // Mũi nhọn bóng thoại
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 1);
    ctx.lineTo(x + 4, y + 1);
    ctx.lineTo(x, y + 5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#713f12';
    ctx.font = 'bold 8px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y - 3);
  }

  /**
   * Khung Camera an ninh CCTV chuẩn retro với thước ngắm ở 4 góc
   */
  public static drawCameraOverlay(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    cameraName: string,
    showScanlines: boolean
  ) {
    ctx.save();

    // Điểm đỏ REC nhấp nháy
    const now = new Date();
    const isBlinking = Math.floor(now.getTime() / 600) % 2 === 0;

    if (isBlinking) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(36, 36, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('LIVE CCTV • REC', 50, 40);

    // Tên Camera và Giờ hệ thống
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`CAM: ${cameraName.toUpperCase()}`, 50, 56);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(now.toISOString().replace('T', ' ').substring(0, 19), width - 210, 40);

    // Thước ngắm 4 góc (Corner Crosshairs) tinh tế
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    const len = 28;

    // Góc trên-trái
    ctx.beginPath();
    ctx.moveTo(14, 14 + len);
    ctx.lineTo(14, 14);
    ctx.lineTo(14 + len, 14);
    ctx.stroke();

    // Góc trên-phải
    ctx.beginPath();
    ctx.moveTo(width - 14 - len, 14);
    ctx.lineTo(width - 14, 14);
    ctx.lineTo(width - 14, 14 + len);
    ctx.stroke();

    // Góc dưới-trái
    ctx.beginPath();
    ctx.moveTo(14, height - 14 - len);
    ctx.lineTo(14, height - 14);
    ctx.lineTo(14 + len, height - 14);
    ctx.stroke();

    // Góc dưới-phải
    ctx.beginPath();
    ctx.moveTo(width - 14 - len, height - 14);
    ctx.lineTo(width - 14, height - 14);
    ctx.lineTo(width - 14, height - 14 - len);
    ctx.stroke();

    // Quét sọc CRT Scanlines nếu được kích hoạt
    if (showScanlines) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1.5);
      }
    }

    ctx.restore();
  }
}
