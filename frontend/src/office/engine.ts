/**
 * Game Engine điều khiển vòng lặp Canvas 60 FPS, di chuyển Agent và Camera
 */

import { Agent, CameraView } from '../types';
import { OFFICE_WIDTH, OFFICE_HEIGHT, ROOMS } from './mapData';
import { SpriteRenderer } from './spriteRenderer';
import { soundFx } from './soundEffects';

export class OfficeEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private agents: Agent[] = [];
  private camera: CameraView = 'overview';
  private frameCount: number = 0;
  private animId: number = 0;
  private isRunning: boolean = false;
  public showScanlines: boolean = true;

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

  public setAgents(agents: Agent[]) {
    this.agents = agents;
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
        // Zoom vào tâm của phòng đó
        const centerX = room.x + room.width / 2;
        const centerY = room.y + room.height / 2;
        this.targetZoom = 1.45;
        this.targetViewX = centerX - OFFICE_WIDTH / (2 * this.targetZoom);
        this.targetViewY = centerY - OFFICE_HEIGHT / (2 * this.targetZoom);
      }
    }
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    const loop = () => {
      this.update();
      this.render();
      this.animId = requestAnimationFrame(loop);
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

    // Cập nhật vị trí di chuyển của 4 Dũng
    this.agents.forEach(agent => {
      const dx = agent.target_x - agent.pos_x;
      const dy = agent.target_y - agent.pos_y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 2) {
        agent.status = 'moving';
        const speed = 2.5;
        agent.pos_x += (dx / dist) * speed;
        agent.pos_y += (dy / dist) * speed;

        if (this.frameCount % 20 === 0) {
          soundFx.playWalk();
        }
      } else {
        agent.pos_x = agent.target_x;
        agent.pos_y = agent.target_y;
        if (agent.status === 'moving') {
          agent.status = 'idle';
        }
      }

      // Âm thanh gõ phím khi Dũng 3 đang code
      if (agent.code === 'dung_3' && agent.status === 'coding' && this.frameCount % 12 === 0) {
        soundFx.playType();
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

    // 1. Dựng bản đồ phòng và nội thất
    SpriteRenderer.drawMap(ctx, OFFICE_WIDTH, OFFICE_HEIGHT);

    // 2. Dựng 4 Nhân vật Dũng
    this.agents.forEach(agent => {
      SpriteRenderer.drawAgent(ctx, agent, this.frameCount);
    });

    ctx.restore();

    // 3. Lớp phủ Camera an ninh (CCTV REC Overlay ở tọa độ tĩnh trên cùng)
    const currentCameraName = ROOMS.find(r => r.id === this.camera)?.name || 'Văn phòng Tổng quan';
    SpriteRenderer.drawCameraOverlay(ctx, canvas.width, canvas.height, currentCameraName, this.showScanlines);
  }
}
