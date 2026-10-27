/**
 * Game Engine điều khiển vòng lặp Canvas 60 FPS, di chuyển Agent, tương tác chuột và Camera
 */

import { Agent, CameraView } from '../types';
import { OFFICE_WIDTH, OFFICE_HEIGHT, ROOMS } from './mapData';
import { SpriteRenderer } from './spriteRenderer';
import { soundFx } from './soundEffects';
import { ImageLoader } from './imageLoader';

// Tọa độ các bàn làm việc và trạm chuyên môn của 3 chuyên gia Dũng
const WORKSTATIONS: Record<string, { x: number; y: number; room: string; status: Agent['status'] }> = {
  dung_1: { x: 230, y: 260, room: 'director_office', status: 'idle' },  // Phòng GĐ Vận Hành F&B (Dũng 1)
  dung_2: { x: 385, y: 620, room: 'architect_office', status: 'idle' }, // Trạm GĐ Phần Mềm (Dũng 2)
  dung_3: { x: 185, y: 620, room: 'dev_lab', status: 'coding' },        // Trạm Cyber Dev Lab (Dũng 3)
};

// Chỗ ngồi quanh bàn tròn trung tâm khi diễn ra họp hoặc tranh luận dự án Hologram 3D
const MEETING_SEATS: Record<string, { x: number; y: number }> = {
  dung_1: { x: 1000, y: 275 },  // Ghế Bắc: Phía trên bàn tròn (Nhân viên 1 - GĐ Vận hành F&B 40 năm KN)
  dung_2: { x: 860, y: 375 },   // Ghế Tây-Nam: Trái dưới bàn tròn (Nhân viên 2 - GĐ Phần mềm 40 năm KN)
  dung_3: { x: 1140, y: 375 },  // Ghế Đông-Nam: Phải dưới bàn tròn (Nhân viên 3 - Senior Dev 30 năm KN)
};

interface ChitChatStep {
  agentCode: string;
  text: string;
  durationMs: number;
}

// Tập hợp các đoạn hội thoại phiếm đời thường, hài hước và giàu kinh nghiệm giữa 3 chuyên gia Dũng
const IDLE_DIALOGUES: ChitChatStep[][] = [
  // Đoạn 1: Phở bốc khói & Độ trễ lag
  [
    { agentCode: 'dung_1', text: 'Dũng 3 ơi! Quán đông khách mà code lag là bát phở nguội tanh đấy nhé! 😂🍜', durationMs: 4200 },
    { agentCode: 'dung_2', text: 'Anh 1 yên tâm! Em bọc HMAC SHA-256 + Cache RAM rồi, mượt như bơ lạt! 🛡️', durationMs: 4200 },
    { agentCode: 'dung_3', text: 'Phở bốc khói, code bốc lửa! 30 năm gõ phím chưa để bếp trễ 1 giây nào! 🚀', durationMs: 4200 },
  ],
  // Đoạn 2: Trà sen hay cà phê phin
  [
    { agentCode: 'dung_1', text: 'Sáng nay ai trà sen, ai cà phê đen phin đậm đặc để bác Dũng 1 chiêu đãi nào? ☕', durationMs: 4200 },
    { agentCode: 'dung_3', text: 'Cho em ly cà phê đen không đường, nạp năng lượng sinh Clean Code 0 bug! ⚡', durationMs: 4200 },
    { agentCode: 'dung_2', text: 'Em xin cốc trà ô long ít đường, uống vào thẩm định kiến trúc cho tỉnh táo! 🍵', durationMs: 4200 },
  ],
  // Đoạn 3: Khoe hệ thống với đối thủ Mỹ Toast POS & Square
  [
    { agentCode: 'dung_2', text: 'Toast POS với Square bên Mỹ mà thấy quả hệ thống 50K TPS này chắc cũng xin sang học việc! 😎', durationMs: 4200 },
    { agentCode: 'dung_1', text: 'Quy trình F&B chuẩn Việt Nam giờ cao điểm mà mượt thì chấp mọi đối thủ toàn cầu! 🌏', durationMs: 4200 },
    { agentCode: 'dung_3', text: 'FastAPI async non-blocking, bếp nhận đơn trước khi khách kịp chớp mắt luôn! 🏎️', durationMs: 4200 },
  ],
  // Đoạn 4: Kèo bi-a nỉ Simonis
  [
    { agentCode: 'dung_3', text: 'Bàn bida đằng kia nỉ Simonis xanh mướt kìa, nghỉ trưa anh em làm ván bi-a cọ xát nhỉ? 🎱', durationMs: 4200 },
    { agentCode: 'dung_1', text: 'Bác 40 năm kinh nghiệm F&B lẫn bida, chấp 2 chú mỗi đứa 3 cơ, ai thua trả tiền cà phê! 🏆', durationMs: 4200 },
    { agentCode: 'dung_2', text: 'Kèo này nhận luôn! Em cơ thủ có hạng đấy bác Dũng 1 ơi! 😆', durationMs: 4200 },
  ],
  // Đoạn 5: Trà sữa trân châu full topping
  [
    { agentCode: 'dung_3', text: 'Đang gõ phím cơ mỏi tay, bác Dũng 1 nhớ giữ lời vụ trà sữa trân châu full topping nhé! 🧋', durationMs: 4200 },
    { agentCode: 'dung_1', text: 'Cứ duyệt xong code ngon lành là bác ship hẳn 3 cốc size khổng lồ về tận bàn! 👍', durationMs: 4200 },
    { agentCode: 'dung_2', text: 'Dũng 3 nghe rõ chưa, code cẩn thận không có bug thì mới có trà sữa uống nhé! 😜', durationMs: 4200 },
  ],
  // Đoạn 6: Thử thách đứt cáp quang biển
  [
    { agentCode: 'dung_1', text: '40 năm trong nghề sợ nhất đứt cáp quang biển vào giờ cơm trưa, khách kêu ầm ĩ! 🌊', durationMs: 4200 },
    { agentCode: 'dung_2', text: 'Offline-First SQLite Sync lo hết anh ơi! Mạng đứt thì LAN nội bộ vẫn in đơn ầm ầm! 🛡️', durationMs: 4200 },
    { agentCode: 'dung_3', text: 'Khi nào có mạng lại tự động sync lên Cloud, không mất 1 xu doanh thu của bác! ✨', durationMs: 4200 },
  ],
  // Đoạn 7: Bàn phím cơ Switch Blue
  [
    { agentCode: 'dung_2', text: 'Dũng 3 gõ bàn phím cơ Switch Blue lạch cạch nghe vui tai như tiếng xào rau của bếp trưởng ấy nhỉ! 🍳', durationMs: 4200 },
    { agentCode: 'dung_3', text: 'Gõ thế này mới ra thơ ra code được anh ơi! Từng dòng code đều chuẩn OpenAPI! 💻', durationMs: 4200 },
    { agentCode: 'dung_1', text: 'Nghe tiếng gõ phím rộn rã thế này bác thấy yên tâm hẳn! Chuỗi nhà hàng sắp bùng nổ rồi! 🚀', durationMs: 4200 },
  ],
  // Đoạn 8: Tinh thần phục vụ Haidilao
  [
    { agentCode: 'dung_1', text: 'Dù phần mềm có siêu đến mấy thì nụ cười chào đón khách vẫn là số 1, đúng chất Haidilao nhé! 😊', durationMs: 4200 },
    { agentCode: 'dung_2', text: 'Đúng vậy anh 1! Phần mềm giải phóng sức lao động, còn cảm xúc ấm áp thì con người quyết định! 💡', durationMs: 4200 },
    { agentCode: 'dung_3', text: 'Em làm thêm tính năng Staff POS Mode để nhân viên dễ dàng order hộ khách lớn tuổi luôn rồi ạ! 📱', durationMs: 4200 },
  ],
];

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

  // Hệ thống trò chuyện phiếm tự nhiên (Natural Idle Chit-Chat & Small Talk)
  private nextChitChatTime: number = Date.now() + 6000;
  private activeDialogue: {
    steps: ChitChatStep[];
    currentStepIndex: number;
    nextStepTime: number;
  } | null = null;

  // Trạng thái nghỉ giải lao ngắn ngẫu nhiên
  private nextBreakTime: number = Date.now() + 15000;
  private activeBreak: {
    agentCode: string;
    targetX: number;
    targetY: number;
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

    // Nạp sẵn toàn bộ sprites Chibi Anime và nội thất chuẩn Pinterest
    ImageLoader.init();
  }

  /**
   * Cập nhật danh sách Agent nhưng GIỮ NGUYÊN tọa độ pos_x, pos_y đang di chuyển
   * để nhân vật không bị dịch chuyển giật cục khi React render lại state!
   */
  public setAgents(newAgents: Agent[]) {
    this.agents = newAgents.map(newA => {
      const existing = this.agents.find(a => a.code === newA.code);
      let targetX = newA.target_x;
      let targetY = newA.target_y;

      // Nếu chuyển tới bàn tròn phòng họp (boardroom), phân bổ từng ghế riêng biệt xung quanh Hologram
      if (newA.current_room === 'boardroom' && MEETING_SEATS[newA.code]) {
        targetX = MEETING_SEATS[newA.code].x;
        targetY = MEETING_SEATS[newA.code].y;
      }

      if (existing) {
        return {
          ...newA,
          pos_x: existing.pos_x,
          pos_y: existing.pos_y,
          target_x: targetX,
          target_y: targetY,
          status: existing.status === 'moving' && newA.status !== 'moving' ? existing.status : newA.status,
        };
      }
      return { ...newA, target_x: targetX, target_y: targetY };
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
      let tx = targetX;
      let ty = targetY;
      if (tx === 690 && ty === 665 && MEETING_SEATS[code]) {
        tx = MEETING_SEATS[code].x;
        ty = MEETING_SEATS[code].y;
      }
      agent.target_x = Math.max(30, Math.min(OFFICE_WIDTH - 30, tx));
      agent.target_y = Math.max(30, Math.min(OFFICE_HEIGHT - 30, ty));
      agent.status = newStatus as Agent['status'];
      soundFx.playWalk();
    }
  }

  public selectAgent(code: string | null) {
    this.selectedAgentCode = code;
    (window as any).__selectedAgentCode = code;
  }

  public cancelBreak() {
    if (this.activeBreak) {
      const home = WORKSTATIONS[this.activeBreak.agentCode];
      if (home) {
        this.moveAgentTo(this.activeBreak.agentCode, home.x, home.y, home.status);
      }
      this.activeBreak = null;
    }
    this.activeDialogue = null;
    this.nextChitChatTime = Date.now() + 25000;
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
        this.targetZoom = 1.35; // Zoom vào khu vực phòng trong Cyber Office 16:9
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

    // 1. Kiểm tra xem người dùng có click vào một trong 4 Dũng hay không (Hitbox toàn thân)
    const clickedAgent = this.agents.find(a => {
      const charH = 150;
      return wx >= a.pos_x - 45 && wx <= a.pos_x + 45 &&
             wy >= a.pos_y - charH && wy <= a.pos_y + 15;
    });

    if (clickedAgent) {
      this.selectedAgentCode = clickedAgent.code;
      (window as any).__selectedAgentCode = clickedAgent.code;
      soundFx.playAlert();

      // Phát lời chào đặc trưng của từng Nhân Viên
      const greetings: Record<string, string> = {
        dung_1: 'Nhân viên 1 (GĐ Vận hành F&B 40 năm KN). Hãy giao bài toán F&B cho tôi!',
        dung_2: 'Nhân viên 2 (GĐ Phần mềm 40 năm KN) sẵn sàng phân tích toàn diện hệ thống!',
        dung_3: 'Nhân viên 3 (Senior Dev 30 năm KN) sẵn sàng lập trình Clean Code khi bạn duyệt!',
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
        this.setCustomBubble(this.selectedAgentCode, 'Đang đi đến vị trí bạn chỉ định...', 3000);

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

    // 4. Click vào khoảng trống hủy chọn
    this.selectedAgentCode = null;
    (window as any).__selectedAgentCode = null;
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
    // QUY TRÌNH NGHỈ GIẢI LAO TỰ ĐỘNG THỈNH THOẢNG (ĐỨNG DẬY ĐI LẠI, SAU ĐÓ QUAY VỀ BÀN LÀM VIỆC)
    // ─────────────────────────────────────────────────────────────────────
    if (this.activeBreak) {
      const breakAgent = this.agents.find(a => a.code === this.activeBreak?.agentCode);
      if (breakAgent) {
        if (this.activeBreak.state === 'going_to_pantry') {
          const dx = breakAgent.pos_x - this.activeBreak.targetX;
          const dy = breakAgent.pos_y - this.activeBreak.targetY;
          if (Math.sqrt(dx * dx + dy * dy) <= 6) {
            breakAgent.status = 'resting';
            this.activeBreak.state = 'resting_at_pantry';
            this.activeBreak.finishRestTime = Date.now() + 6500;
          }
        } else if (this.activeBreak.state === 'resting_at_pantry') {
          if (Date.now() >= this.activeBreak.finishRestTime) {
            const home = WORKSTATIONS[breakAgent.code];
            if (home) {
              this.activeBreak.state = 'returning_to_desk';
              this.moveAgentTo(breakAgent.code, home.x, home.y, 'moving');
              this.setCustomBubble(breakAgent.code, 'Nạp đủ năng lượng rồi, về bàn làm việc thôi! 💼', 3000);
            } else {
              this.activeBreak = null;
              this.nextBreakTime = Date.now() + 25000 + Math.random() * 20000;
            }
          }
        } else if (this.activeBreak.state === 'returning_to_desk') {
          const home = WORKSTATIONS[breakAgent.code];
          if (home) {
            const dx = breakAgent.pos_x - home.x;
            const dy = breakAgent.pos_y - home.y;
            if (Math.sqrt(dx * dx + dy * dy) <= 6) {
              breakAgent.current_room = home.room;
              breakAgent.status = home.status;
              this.activeBreak = null;
              this.nextBreakTime = Date.now() + 25000 + Math.random() * 20000;
            }
          } else {
            this.activeBreak = null;
            this.nextBreakTime = Date.now() + 25000 + Math.random() * 20000;
          }
        }
      } else {
        this.activeBreak = null;
      }
    } else if (Date.now() > this.nextBreakTime) {
      // Chỉ cho phép giải lao nếu KHÔNG có cuộc họp nào đang diễn ra
      const isMeetingActive = this.agents.some(a => a.current_room === 'boardroom' || a.status === 'debating');
      if (isMeetingActive) {
        this.nextBreakTime = Date.now() + 20000;
      } else {
        const atDeskAgents = this.agents.filter(a => {
          const home = WORKSTATIONS[a.code];
          if (!home) return false;
          const dx = a.pos_x - home.x;
          const dy = a.pos_y - home.y;
          return Math.sqrt(dx * dx + dy * dy) < 20 && a.status !== 'moving';
        });

        if (atDeskAgents.length > 0) {
          const chosen = atDeskAgents[Math.floor(Math.random() * atDeskAgents.length)];
          const roamingSpots = [
            { x: 1050, y: 620, msg: 'Đi dạo ngắm đại lộ xe bay thư giãn... 🚗' },
            { x: 500,  y: 680, msg: 'Pha tách cà phê nóng nạp năng lượng... ☕' },
            { x: 680,  y: 650, msg: 'Vận động gân cốt sau phiên code tập trung... 🏃' },
          ];
          const spot = roamingSpots[Math.floor(Math.random() * roamingSpots.length)];

          this.activeBreak = {
            agentCode: chosen.code,
            targetX: spot.x,
            targetY: spot.y,
            state: 'going_to_pantry',
            finishRestTime: 0,
          };
          this.moveAgentTo(chosen.code, spot.x, spot.y, 'moving');
          this.setCustomBubble(chosen.code, spot.msg, 4500);
        } else {
          this.nextBreakTime = Date.now() + 20000;
        }
      }
    }

    // ─────────────────────────────────────────────────────────────────────
    // QUY TRÌNH NÓI CHUYỆN PHIẾM TỰ NHIÊN HÀI HƯỚC (NATURAL IDLE CHIT-CHAT & SMALL TALK)
    // ─────────────────────────────────────────────────────────────────────
    if (this.activeDialogue) {
      if (Date.now() >= this.activeDialogue.nextStepTime) {
        this.activeDialogue.currentStepIndex++;
        if (this.activeDialogue.currentStepIndex < this.activeDialogue.steps.length) {
          const step = this.activeDialogue.steps[this.activeDialogue.currentStepIndex];
          this.setCustomBubble(step.agentCode, step.text, step.durationMs);
          this.activeDialogue.nextStepTime = Date.now() + step.durationMs;
        } else {
          // Kết thúc chuỗi đối thoại, nghỉ một khoảng 8s - 14s trước khi bắt đầu câu chuyện mới
          this.activeDialogue = null;
          this.nextChitChatTime = Date.now() + 8000 + Math.random() * 6000;
        }
      }
    } else if (Date.now() > this.nextChitChatTime) {
      // Chỉ kích hoạt trò chuyện phiếm nếu không có cuộc họp hay tranh luận căng thẳng
      const isMeetingActive = this.agents.some(a => a.status === 'debating');
      if (!isMeetingActive) {
        const dialogue = IDLE_DIALOGUES[Math.floor(Math.random() * IDLE_DIALOGUES.length)];
        const step0 = dialogue[0];
        this.setCustomBubble(step0.agentCode, step0.text, step0.durationMs);
        this.activeDialogue = {
          steps: dialogue,
          currentStepIndex: 0,
          nextStepTime: Date.now() + step0.durationMs,
        };
      } else {
        this.nextChitChatTime = Date.now() + 15000;
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
    SpriteRenderer.drawOfficeStructure(ctx, OFFICE_WIDTH, OFFICE_HEIGHT, this.frameCount);

    // 2. Gom toàn bộ đồ đạc nội thất và 4 Dũng vào danh sách Z-Sort
    const furnitureDrawables = SpriteRenderer.getFurnitureDrawables(this.agents, this.frameCount);
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
   * Tính toán chiều sâu Z-Depth cho từng Dũng trên 4 tầng Tháp AI
   */
  private getAgentZDepth(agent: Agent): number {
    return agent.pos_y + 10;
  }

  /**
   * Dựng một Agent kèm theo hiệu ứng chọn và bong bóng thoại
   */
  private renderAgentWithEffects(ctx: CanvasRenderingContext2D, agent: Agent) {
    const isSelected = agent.code === this.selectedAgentCode;
    const isDebating = agent.status === 'debating';
    const customBubble = this.customBubbles[agent.code]?.text;

    // Vòng phát sáng hào quang dưới chân khi đang tranh luận trong phòng họp
    if (isDebating) {
      ctx.save();
      ctx.strokeStyle = agent.avatar_color;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = agent.avatar_color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      const auraPulse = Math.sin(this.frameCount * 0.12) * 2.5;
      ctx.ellipse(agent.pos_x, agent.pos_y + 8, 16 + auraPulse, 6 + auraPulse * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

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

    // Nếu có bong bóng thoại đặc biệt thì vẽ chuẩn ngay trên đỉnh đầu
    if (customBubble) {
      this.drawSpecialBubble(ctx, agent, customBubble);
    }
  }

  /**
   * Dựng bong bóng thoại tranh luận và trò chuyện phiếm cỡ lớn (High-Readability Large Speech Bubble)
   * Có huy hiệu phân vai, 4 cột equalizer âm thanh nhảy nhót, ngắt dòng tự động (Word Wrapping)
   */
  private drawSpecialBubble(ctx: CanvasRenderingContext2D, agent: Agent, text: string) {
    const accentColor = agent.avatar_color || '#00f0ff';
    const x = agent.pos_x;
    const y = agent.pos_y - 58; // Vị trí đỉnh đầu nhân vật

    // Xác định huy hiệu chức danh và icon của từng Dũng
    let roleBadge = 'AI AGENT';
    if (agent.code === 'dung_1') roleBadge = '🥩 DŨNG 1 • GĐ VẬN HÀNH F&B (40 NĂM KN)';
    else if (agent.code === 'dung_2') roleBadge = '💻 DŨNG 2 • GĐ PHẦN MỀM (40 NĂM KN)';
    else if (agent.code === 'dung_3') roleBadge = '⚡ DŨNG 3 • SENIOR FULLSTACK (30 NĂM KN)';

    ctx.save();

    // Thiết lập font chữ lớn, rõ nét dễ nhìn theo yêu cầu người dùng (12.5px bold)
    const fontContent = 'bold 12.5px "Outfit", "Segoe UI", sans-serif';
    ctx.font = fontContent;

    // Tách từ và ngắt dòng (Word Wrapping) để hiển thị trọn vẹn, không bị cắt dấu ba chấm (...)
    const maxLineLength = 320;
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxLineLength && currentLine) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Tính toán chiều rộng và chiều cao bong bóng thoại dựa trên số dòng
    let maxTextWidth = 160;
    for (const line of lines) {
      const lw = ctx.measureText(line).width;
      if (lw > maxTextWidth) maxTextWidth = lw;
    }

    const headerHeight = 22;
    const lineHeight = 18;
    const paddingX = 14;
    const paddingY = 10;
    const bubbleWidth = Math.max(240, Math.min(360, maxTextWidth + paddingX * 2));
    const bubbleHeight = headerHeight + lines.length * lineHeight + paddingY * 2;

    // Kẹp tọa độ ngang để bong bóng không bị tràn ra ngoài màn hình Canvas (OFFICE_WIDTH = 1376)
    const clampedCenterX = Math.max(bubbleWidth / 2 + 15, Math.min(x, 1376 - bubbleWidth / 2 - 15));
    const bubbleLeft = clampedCenterX - bubbleWidth / 2;
    const bubbleTop = y - bubbleHeight;

    // 1. Bóng đổ HUD nổi khối
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.beginPath();
    ctx.roundRect(bubbleLeft + 3, bubbleTop + 3, bubbleWidth, bubbleHeight, 8);
    ctx.fill();

    // 2. Hộp thoại Cyber Dark Glass cao cấp
    const bgGrad = ctx.createLinearGradient(bubbleLeft, bubbleTop, bubbleLeft, bubbleTop + bubbleHeight);
    bgGrad.addColorStop(0, 'rgba(15, 23, 42, 0.98)');
    bgGrad.addColorStop(1, 'rgba(23, 37, 84, 0.96)');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.roundRect(bubbleLeft, bubbleTop, bubbleWidth, bubbleHeight, 8);
    ctx.fill();

    // Viền phát sáng theo màu nhận diện của Agent
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.6;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 3. Mũi tên chỉ xuống đỉnh đầu Agent
    ctx.fillStyle = 'rgba(23, 37, 84, 0.98)';
    ctx.beginPath();
    ctx.moveTo(x - 7, bubbleTop + bubbleHeight);
    ctx.lineTo(x + 7, bubbleTop + bubbleHeight);
    ctx.lineTo(x, bubbleTop + bubbleHeight + 7);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 7, bubbleTop + bubbleHeight);
    ctx.lineTo(x, bubbleTop + bubbleHeight + 7);
    ctx.lineTo(x + 7, bubbleTop + bubbleHeight);
    ctx.stroke();

    // 4. Thanh Header huy hiệu Speaker
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.roundRect(bubbleLeft + 1, bubbleTop + 1, bubbleWidth - 2, headerHeight, [7, 7, 0, 0]);
    ctx.fill();

    // Dải màu accent bên mép trái
    ctx.fillStyle = accentColor;
    ctx.fillRect(bubbleLeft + 1, bubbleTop + 1, 3.5, headerHeight);

    // Tiêu đề chức danh Agent
    ctx.font = 'bold 9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = accentColor;
    ctx.textAlign = 'left';
    ctx.fillText(roleBadge, bubbleLeft + 10, bubbleTop + 15);

    // 4 Cột Equalizer sóng âm thanh trò chuyện nhảy nhót sinh động
    const eqX = bubbleLeft + bubbleWidth - 36;
    const eqY = bubbleTop + 16;
    for (let i = 0; i < 4; i++) {
      const barH = 3 + Math.abs(Math.sin(this.frameCount * 0.22 + i * 1.1)) * 9;
      ctx.fillStyle = accentColor;
      ctx.fillRect(eqX + i * 5, eqY - barH, 2.5, barH);
    }

    // 5. Nội dung đối thoại (Text trắng sáng sắc nét, nhiều dòng)
    ctx.font = fontContent;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    let textY = bubbleTop + headerHeight + paddingY + 11;
    for (const line of lines) {
      // Đổ bóng chữ nhẹ tăng tương phản
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillText(line, bubbleLeft + paddingX + 0.5, textY + 0.5);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(line, bubbleLeft + paddingX, textY);
      textY += lineHeight;
    }

    ctx.restore();
  }
}
