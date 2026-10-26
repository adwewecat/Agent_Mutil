/**
 * Game Engine điều khiển vòng lặp Canvas 60 FPS, di chuyển Agent, tương tác chuột và Camera
 */

import { Agent, CameraView } from '../types';
import { OFFICE_WIDTH, OFFICE_HEIGHT, ROOMS } from './mapData';
import { SpriteRenderer } from './spriteRenderer';
import { soundFx } from './soundEffects';

// Tọa độ bàn làm việc chính của 4 Dũng (Ngồi làm việc nghiêm túc 95% thời gian)
const WORKSTATIONS: Record<string, { x: number; y: number; room: string; status: Agent['status'] }> = {
  dung_1: { x: 135, y: 132, room: 'director_office', status: 'idle' },
  dung_2: { x: 413, y: 168, room: 'architect_office', status: 'idle' },
  dung_3: { x: 388, y: 372, room: 'dev_lab', status: 'coding' },
  dung_4: { x: 714, y: 168, room: 'games_room', status: 'testing' },
};

// Khu vực Pantry lấy nước / cà phê
const PANTRY_COFFEE = { x: 160, y: 375, room: 'kitchen_pantry' };

export class OfficeEngine {
  public canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private agents: Agent[] = [];
  private camera: CameraView = 'overview';
  private frameCount: number = 0;
  private animId: number = 0;
  private isRunning: boolean = false;
  public showScanlines: boolean = true;

  // Agent đang được người dùng bấm chọn trên Canvas
  public selectedAgentCode: string | null = null;
  // Bong bóng thoại tùy biến
  public customBubbles: Record<string, { text: string; expires: number }> = {};

  // Trạng thái nghỉ giải lao ngắn ngẫu nhiên (Lâu lâu mới đi giải lao 1 xíu, sau đó quay lại bàn làm việc)
  private nextBreakTime: number = Date.now() + 60000;
  private activeBreak: {
    agentCode: string;
    state: 'going_to_pantry' | 'resting_at_pantry' | 'returning_to_desk';
    finishRestTime: number;
  } | null = null;

  // Camera viewport
  private viewX: number = 0;
  private viewY: number = 0;
  private targetViewX: number = 0;
  private targetViewY: number = 0;
  private zoom: number = 1;
  private targetZoom: number = 1;

  // Sprites nhân vật độ phân giải cao chuẩn Pinterest
  private characterSprites: Record<string, HTMLImageElement> = {};

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Không thể khởi tạo Canvas 2D Context');
    this.ctx = context;
    this.updateCameraTarget();

    // Nạp sẵn 4 sprites nhân vật chân thực phong cách Pinterest
    ['dung_1', 'dung_2', 'dung_3', 'dung_4'].forEach(code => {
      const img = new Image();
      img.src = `/assets/characters/${code}.png`;
      this.characterSprites[code] = img;
    });
  }

  /**
   * Cập nhật danh sách Agent nhưng GIỮ NGUYÊN tọa độ pos_x, pos_y đang di chuyển
   * để nhân vật không bị dịch chuyển giật cục khi React render lại state!
   */
  public setAgents(newAgents: Agent[]) {
    this.agents = newAgents.map(newA => {
      const existing = this.agents.find(a => a.code === newA.code);
      if (existing) {
        return {
          ...newA,
          pos_x: existing.pos_x,
          pos_y: existing.pos_y,
          target_x: newA.target_x,
          target_y: newA.target_y,
          status: existing.status === 'moving' && newA.status !== 'moving' ? existing.status : newA.status,
        };
      }
      return { ...newA };
    });
  }

  public getAgents(): Agent[] {
    return this.agents;
  }

  /**
   * Điều động Agent lập tức tới tọa độ đích trên Canvas
   */
  public moveAgentTo(code: string, targetX: number, targetY: number, newStatus: string = 'moving') {
    const agent = this.agents.find(a => a.code === code);
    if (agent) {
      agent.target_x = Math.max(30, Math.min(OFFICE_WIDTH - 30, targetX));
      agent.target_y = Math.max(30, Math.min(OFFICE_HEIGHT - 30, targetY));
      agent.status = newStatus as Agent['status'];
      soundFx.playWalk();
    }
  }

  /**
   * Hiển thị bong bóng thoại ngắn trên đầu Agent
   */
  public setCustomBubble(code: string, text: string, durationMs: number = 4000) {
    this.customBubbles[code] = {
      text,
      expires: Date.now() + durationMs,
    };
  }

  public setCamera(cam: CameraView) {
    if (this.camera !== cam) {
      this.camera = cam;
      soundFx.playCameraSwitch();
      this.updateCameraTarget();
    }
  }

  public getCamera(): CameraView {
    return this.camera;
  }

  private updateCameraTarget() {
    if (this.camera === 'overview') {
      this.targetViewX = 0;
      this.targetViewY = 0;
      this.targetZoom = 1;
    } else {
      const room = ROOMS.find(r => r.id === this.camera);
      if (room) {
        const centerX = room.x + room.width / 2;
        const centerY = room.y + room.height / 2;
        this.targetZoom = 1.12; // Zoom tinh tế, không làm vỡ tỉ lệ hoặc che khuất tầm nhìn
        const viewW = OFFICE_WIDTH / this.targetZoom;
        const viewH = OFFICE_HEIGHT / this.targetZoom;
        const rawX = centerX - viewW / 2;
        const rawY = centerY - viewH / 2;
        this.targetViewX = Math.max(0, Math.min(rawX, OFFICE_WIDTH - viewW));
        this.targetViewY = Math.max(0, Math.min(rawY, OFFICE_HEIGHT - viewH));
      }
    }
  }

  /**
   * Chuyển đổi tọa độ chuột từ màn hình trình duyệt sang tọa độ thế giới Canvas (World Coordinates)
   */
  public screenToWorld(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const screenX = (clientX - rect.left) * scaleX;
    const screenY = (clientY - rect.top) * scaleY;

    const worldX = screenX / this.zoom + this.viewX;
    const worldY = screenY / this.zoom + this.viewY;

    return { x: worldX, y: worldY };
  }

  /**
   * Xử lý click chuột tương tác trực tiếp trên Canvas
   */
  public handleCanvasClick(clientX: number, clientY: number): {
    action: 'selected_agent' | 'moved_agent' | 'selected_room' | 'none';
    agent?: Agent;
    room?: string;
    target?: { x: number; y: number };
  } {
    const { x: wx, y: wy } = this.screenToWorld(clientX, clientY);

    // 1. Kiểm tra xem người dùng có click vào một trong 4 Dũng hay không
    const clickedAgent = this.agents.find(a => {
      const dx = a.pos_x - wx;
      const dy = a.pos_y - wy;
      return Math.sqrt(dx * dx + dy * dy) < 22;
    });

    if (clickedAgent) {
      this.selectedAgentCode = clickedAgent.code;
      soundFx.playAlert();

      // Phát lời chào đặc trưng của từng Dũng
      const greetings: Record<string, string> = {
        dung_1: 'Tôi là Dũng 1 (Director). Hãy giao bài toán cho tôi!',
        dung_2: 'Dũng 2 (40 năm KN) sẵn sàng thẩm định kiến trúc!',
        dung_3: 'Dũng 3 (Fullstack Dev) sẵn sàng viết Clean Code!',
        dung_4: 'Dũng 4 (QA Lead) sẵn sàng bắn phá Stress Test!',
      };
      this.setCustomBubble(clickedAgent.code, greetings[clickedAgent.code] || 'Tôi đang lắng nghe!');

      return { action: 'selected_agent', agent: clickedAgent };
    }

    // 2. Nếu đã có 1 Dũng được chọn trước đó, click vào bất kỳ sàn phòng nào sẽ ĐIỀU ĐỘNG Dũng đó đi tới điểm đó!
    if (this.selectedAgentCode) {
      const selectedAgent = this.agents.find(a => a.code === this.selectedAgentCode);
      if (selectedAgent) {
        const clampedX = Math.max(30, Math.min(OFFICE_WIDTH - 30, Math.round(wx)));
        const clampedY = Math.max(30, Math.min(OFFICE_HEIGHT - 30, Math.round(wy)));

        this.moveAgentTo(this.selectedAgentCode, clampedX, clampedY, 'moving');
        this.setCustomBubble(this.selectedAgentCode, 'Đang đi đến vị trí chỉ định...', 3000);

        return {
          action: 'moved_agent',
          agent: selectedAgent,
          target: { x: clampedX, y: clampedY },
        };
      }
    }

    // 3. Nếu chưa chọn Dũng nào, kiểm tra click vào phòng nào để chuyển Camera góc quay
    const clickedRoom = ROOMS.find(
      r => wx >= r.x && wx <= r.x + r.width && wy >= r.y && wy <= r.y + r.height
    );

    if (clickedRoom) {
      this.setCamera(clickedRoom.id as CameraView);
      return { action: 'selected_room', room: clickedRoom.id };
    }

    return { action: 'none' };
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    const loop = () => {
      this.update();
      this.render();
      if (this.isRunning) {
        this.animId = requestAnimationFrame(loop);
      }
    };
    this.animId = requestAnimationFrame(loop);
  }

  public stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.animId);
  }

  private update() {
    this.frameCount++;

    // Mượt mà chuyển dịch Camera (Smooth Lerp)
    this.viewX += (this.targetViewX - this.viewX) * 0.08;
    this.viewY += (this.targetViewY - this.viewY) * 0.08;
    this.zoom += (this.targetZoom - this.zoom) * 0.08;

    // Cập nhật vị trí di chuyển thực tế của 4 Dũng
    this.agents.forEach(agent => {
      const dx = agent.target_x - agent.pos_x;
      const dy = agent.target_y - agent.pos_y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 3) {
        agent.status = 'moving';
        // Tốc độ di chuyển 3.5px / frame rất tự nhiên và nhanh nhẹn
        const speed = 3.5;
        agent.pos_x += (dx / dist) * speed;
        agent.pos_y += (dy / dist) * speed;

        if (this.frameCount % 18 === 0) {
          soundFx.playWalk();
        }
      } else {
        agent.pos_x = agent.target_x;
        agent.pos_y = agent.target_y;
        if (agent.status === 'moving') {
          // Khi đến nơi, nếu không nằm trong quy trình break, chuyển trạng thái phù hợp theo phòng
          if (agent.current_room === 'boardroom') {
            agent.status = 'debating';
          } else if (agent.current_room === 'dev_lab') {
            agent.status = 'coding';
          } else if (agent.current_room === 'games_room') {
            agent.status = 'testing';
          } else if (agent.current_room === 'kitchen_pantry') {
            agent.status = 'resting';
          } else {
            agent.status = 'idle';
          }
        }
      }

      // Âm thanh gõ phím khi Dũng 3 đang code tại bàn
      if (agent.code === 'dung_3' && agent.status === 'coding' && this.frameCount % 14 === 0) {
        soundFx.playType();
      }
    });

    // ─────────────────────────────────────────────────────────────────────
    // QUY TRÌNH NGHỈ GIẢI LAO TỰ ĐỘNG THỈNH THOẢNG (95% LÀM VIỆC TẠI BÀN, LÂU LÂU 1 NGƯỜI ĐI UỐNG CÀ PHÊ 8 GIÂY RỒI VỀ)
    // ─────────────────────────────────────────────────────────────────────
    if (this.activeBreak) {
      const breakAgent = this.agents.find(a => a.code === this.activeBreak?.agentCode);
      if (breakAgent) {
        if (this.activeBreak.state === 'going_to_pantry') {
          const dx = breakAgent.pos_x - PANTRY_COFFEE.x;
          const dy = breakAgent.pos_y - PANTRY_COFFEE.y;
          if (Math.sqrt(dx * dx + dy * dy) <= 4) {
            breakAgent.current_room = 'kitchen_pantry';
            breakAgent.status = 'resting';
            this.activeBreak.state = 'resting_at_pantry';
            this.activeBreak.finishRestTime = Date.now() + 8500;
            this.setCustomBubble(breakAgent.code, 'Thưởng thức tách cà phê nạp năng lượng... ☕', 8000);
          }
        } else if (this.activeBreak.state === 'resting_at_pantry') {
          if (Date.now() >= this.activeBreak.finishRestTime) {
            const home = WORKSTATIONS[breakAgent.code];
            if (home) {
              this.activeBreak.state = 'returning_to_desk';
              this.moveAgentTo(breakAgent.code, home.x, home.y, 'moving');
              this.setCustomBubble(breakAgent.code, 'Nạp đủ năng lượng rồi, về bàn làm việc thôi! 💼', 3500);
            } else {
              this.activeBreak = null;
              this.nextBreakTime = Date.now() + 90000 + Math.random() * 30000;
            }
          }
        } else if (this.activeBreak.state === 'returning_to_desk') {
          const home = WORKSTATIONS[breakAgent.code];
          if (home) {
            const dx = breakAgent.pos_x - home.x;
            const dy = breakAgent.pos_y - home.y;
            if (Math.sqrt(dx * dx + dy * dy) <= 4) {
              breakAgent.current_room = home.room;
              breakAgent.status = home.status;
              this.activeBreak = null;
              // Lượt giải lao tiếp theo sau 90 đến 120 giây (ngồi làm việc đàng hoàng phần lớn thời gian)
              this.nextBreakTime = Date.now() + 90000 + Math.random() * 30000;
            }
          } else {
            this.activeBreak = null;
            this.nextBreakTime = Date.now() + 90000 + Math.random() * 30000;
          }
        }
      } else {
        this.activeBreak = null;
      }
    } else if (Date.now() > this.nextBreakTime) {
      // Chỉ cho phép giải lao nếu KHÔNG có cuộc họp nào đang diễn ra và nhân vật đang ở bàn làm việc
      const isMeetingActive = this.agents.some(a => a.current_room === 'boardroom' || a.status === 'debating');
      if (isMeetingActive) {
        this.nextBreakTime = Date.now() + 30000;
      } else {
        const atDeskAgents = this.agents.filter(a => {
          const home = WORKSTATIONS[a.code];
          if (!home) return false;
          const dx = a.pos_x - home.x;
          const dy = a.pos_y - home.y;
          return Math.sqrt(dx * dx + dy * dy) < 15 && a.status !== 'moving';
        });

        if (atDeskAgents.length > 0) {
          const chosen = atDeskAgents[Math.floor(Math.random() * atDeskAgents.length)];
          this.activeBreak = {
            agentCode: chosen.code,
            state: 'going_to_pantry',
            finishRestTime: 0,
          };
          this.moveAgentTo(chosen.code, PANTRY_COFFEE.x, PANTRY_COFFEE.y, 'moving');
          this.setCustomBubble(chosen.code, 'Đi pha tách cà phê giải lao 1 xíu... ☕', 4000);
        } else {
          this.nextBreakTime = Date.now() + 30000;
        }
      }
    }

    // Dọn dẹp bong bóng thoại hết hạn
    const now = Date.now();
    Object.keys(this.customBubbles).forEach(key => {
      if (this.customBubbles[key].expires < now) {
        delete this.customBubbles[key];
      }
    });
  }

  private render() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // Áp dụng biến đổi Camera Zoom & Panning
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.viewX, -this.viewY);

    // 1. Dựng nền tổng thể và kiến trúc văn phòng (Sàn nhà, Tường 3D, Cửa sổ kính, Vách ngăn phòng)
    SpriteRenderer.drawOfficeStructure(ctx, OFFICE_WIDTH, OFFICE_HEIGHT);

    // 2. Gom toàn bộ đồ đạc nội thất và 4 Dũng vào danh sách Z-Sort
    const furnitureDrawables = SpriteRenderer.getFurnitureDrawables(this.agents);
    const allDrawables: { zY: number; draw: (c: CanvasRenderingContext2D) => void }[] = [
      ...furnitureDrawables,
      ...this.agents.map(agent => ({
        zY: this.getAgentZDepth(agent),
        draw: (c: CanvasRenderingContext2D) => this.renderAgentWithEffects(c, agent),
      })),
    ];

    // 3. Sắp xếp tất cả thực thể theo thứ tự chiều sâu Y (Tránh triệt để chồng chéo vật thể)
    allDrawables.sort((a, b) => a.zY - b.zY);

    // 4. Vẽ tuần tự theo thứ tự chiều sâu hoàn hảo
    for (const item of allDrawables) {
      item.draw(ctx);
    }

    ctx.restore();

    // 5. Lớp phủ Camera an ninh (CCTV REC Overlay)
    const currentCameraName = ROOMS.find(r => r.id === this.camera)?.name || 'Văn phòng Tổng quan';
    SpriteRenderer.drawCameraOverlay(ctx, canvas.width, canvas.height, currentCameraName, this.showScanlines);

    // 6. Nếu có Agent được chọn, hiển thị thanh trạng thái điều khiển trên Canvas
    if (this.selectedAgentCode) {
      const sel = this.agents.find(a => a.code === this.selectedAgentCode);
      if (sel) {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(canvas.width / 2 - 190, canvas.height - 38, 380, 28);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.strokeRect(canvas.width / 2 - 190, canvas.height - 38, 380, 28);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`🎮 ĐÃ CHỌN [${sel.name.toUpperCase()}] • BẤM ĐIỂM BẤT KỲ TRÊN SÀN ĐỂ ĐIỀU ĐỘNG`, canvas.width / 2, canvas.height - 20);
        ctx.restore();
      }
    }
  }

  /**
   * Tính toán chiều sâu Z-Depth cho từng Dũng dựa trên hành vi và vị trí ngồi làm việc/họp
   * Đảm bảo nhân vật ngồi vào ghế, tay đặt lên bàn, không trèo lên bàn, bàn họp che chân tự nhiên
   */
  private getAgentZDepth(agent: Agent): number {
    if (agent.status === 'moving') {
      return agent.pos_y + 10;
    }
    // Khi họp tại Boardroom: Dũng 1 đứng đầu bàn thuyết trình (zY: 410), Dũng 2 và các đại biểu ngồi ghế sau bàn (zY: 355)
    if (agent.current_room === 'boardroom' || agent.status === 'debating') {
      if (agent.code === 'dung_1') {
        return 410; // Đứng đầu bàn họp Oval, tay đặt lên mặt bàn
      }
      return 355; // Ngồi ghế họp phía sau mặt bàn Oval
    }
    // Khi Giám đốc ngồi sofa: Z-Depth 160 nằm trên đệm sofa (155) nhưng sau bàn trà tiếp khách (190)
    if (agent.code === 'dung_1' && agent.current_room === 'director_office') {
      return 160;
    }
    // Khi Dũng 3 ngồi tại Dev Lab: Z-Depth 396 nằm trước khung bàn dev (395), tay đặt lên bàn phím
    if (agent.code === 'dung_3' && agent.current_room === 'dev_lab') {
      return 396;
    }
    // Khi Dũng 2 ngồi tại bàn kiến trúc sư: Z-Depth 176 nằm trước khung bàn (175)
    if (agent.code === 'dung_2' && agent.current_room === 'architect_office') {
      return 176;
    }
    // Khi Dũng 4 ngồi tại bàn QA: Z-Depth 176 nằm trước khung bàn (175)
    if (agent.code === 'dung_4' && agent.current_room === 'games_room') {
      return 176;
    }
    return agent.pos_y + 10;
  }

  /**
   * Dựng một Agent kèm theo hiệu ứng chọn và bong bóng thoại
   */
  private renderAgentWithEffects(ctx: CanvasRenderingContext2D, agent: Agent) {
    const isSelected = agent.code === this.selectedAgentCode;
    const customBubble = this.customBubbles[agent.code]?.text;

    // Vẽ vòng phát sáng dưới chân nếu đang được chọn (vừa vặn với nhân vật thu nhỏ)
    if (isSelected) {
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 2]);
      ctx.beginPath();
      const pulse = Math.sin(this.frameCount * 0.1) * 2;
      ctx.ellipse(agent.pos_x, agent.pos_y + 10, 15 + pulse, 6 + pulse * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Dựng nhân vật với sprite chất lượng cao chuẩn Pinterest và animation
    SpriteRenderer.drawAgent(ctx, agent, this.frameCount, this.characterSprites[agent.code]);

    // Nếu có bong bóng thoại đặc biệt thì vẽ đè lên
    if (customBubble) {
      this.drawSpecialBubble(ctx, agent.pos_x, agent.pos_y - 48, customBubble);
    }
  }

  private drawSpecialBubble(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
    const w = Math.min(320, text.length * 6.5 + 16);
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - w / 2, y - 16, w, 18);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - w / 2, y - 16, w, 18);

    // Mũi nhọn
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 2);
    ctx.lineTo(x + 4, y + 2);
    ctx.lineTo(x, y + 6);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(text.length > 40 ? text.substring(0, 38) + '...' : text, x, y - 4);
    ctx.restore();
  }
}
