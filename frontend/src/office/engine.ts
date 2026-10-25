/**
 * Game Engine điều khiển vòng lặp Canvas 60 FPS, di chuyển Agent, tương tác chuột và Camera
 */

import { Agent, CameraView } from '../types';
import { OFFICE_WIDTH, OFFICE_HEIGHT, ROOMS } from './mapData';
import { SpriteRenderer } from './spriteRenderer';
import { soundFx } from './soundEffects';

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

  // Camera viewport
  private viewX: number = 0;
  private viewY: number = 0;
  private targetViewX: number = 0;
  private targetViewY: number = 0;
  private zoom: number = 1;
  private targetZoom: number = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Không thể khởi tạo Canvas 2D Context');
    this.ctx = context;
    this.updateCameraTarget();
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
        this.targetZoom = 1.35;
        this.targetViewX = centerX - OFFICE_WIDTH / (2 * this.targetZoom);
        this.targetViewY = centerY - OFFICE_HEIGHT / (2 * this.targetZoom);
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
      const dy = a.pos_y - 10 - wy;
      return Math.sqrt(dx * dx + dy * dy) < 32;
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
          // Khi đến nơi, trả về trạng thái theo phòng
          if (agent.current_room === 'boardroom') {
            agent.status = 'debating';
          } else if (agent.current_room === 'dev_lab') {
            agent.status = 'coding';
          } else if (agent.current_room === 'games_room') {
            agent.status = 'testing';
          } else {
            agent.status = 'idle';
          }
        }
      }

      // Âm thanh gõ phím khi Dũng 3 đang code
      if (agent.code === 'dung_3' && agent.status === 'coding' && this.frameCount % 14 === 0) {
        soundFx.playType();
      }
    });

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
    const furnitureDrawables = SpriteRenderer.getFurnitureDrawables();
    const allDrawables: { zY: number; draw: (c: CanvasRenderingContext2D) => void }[] = [
      ...furnitureDrawables,
      ...this.agents.map(agent => ({
        zY: agent.pos_y + 16,
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
   * Dựng một Agent kèm theo hiệu ứng chọn và bong bóng thoại
   */
  private renderAgentWithEffects(ctx: CanvasRenderingContext2D, agent: Agent) {
    const isSelected = agent.code === this.selectedAgentCode;
    const customBubble = this.customBubbles[agent.code]?.text;

    // Vẽ vòng phát sáng dưới chân nếu đang được chọn
    if (isSelected) {
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 2]);
      ctx.beginPath();
      const pulse = Math.sin(this.frameCount * 0.1) * 3;
      ctx.ellipse(agent.pos_x, agent.pos_y + 16, 20 + pulse, 9 + pulse * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Dựng nhân vật Pixel với animation phù hợp
    SpriteRenderer.drawAgent(ctx, agent, this.frameCount);

    // Nếu có bong bóng thoại đặc biệt thì vẽ đè lên
    if (customBubble) {
      this.drawSpecialBubble(ctx, agent.pos_x, agent.pos_y - 58, customBubble);
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
