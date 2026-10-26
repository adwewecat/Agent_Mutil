/**
 * Quản lý nạp và cache toàn bộ Sprite ảnh thật độ phân giải cao:
 * - 9 tư thế Chibi Anime cho 4 Dũng chuẩn Pinterest pin_1013309984899659354
 * - Nội thất văn phòng chuẩn Pinterest pin_office (817544138597868043)
 * - Phòng họp Boardroom Oval chuẩn Pinterest pin_meeting (591730838527550441)
 */

export class ImageLoader {
  private static chibiCache: Record<string, Record<string, HTMLImageElement>> = {};
  private static officeCache: Record<string, HTMLImageElement> = {};
  private static initialized = false;

  private static readonly AGENT_CODES = ['dung_1', 'dung_2', 'dung_3', 'dung_4'];
  private static readonly POSES = [
    'front_happy',
    'presenting_forward',
    'turn_back',
    'profile_walk',
    'thinking_stand',
    'three_quarter_idle',
    'bending_look',
    'thinking_seated',
    'crawling_low'
  ];

  private static readonly OFFICE_ITEMS = [
    'pin_894809019751482321_room',
    'foreground_meeting_table',
    'foreground_divider_wall',
    'foreground_front_desk',
    'boardroom_meeting_suite',
    'boardroom_table',
    'lounge_suite',
    'photocopier',
    'water_cooler',
    'tall_bookcase',
    'filing_cabinet_plant',
    'drawer_pedestal',
    'cubicle_pod_top',
    'cubicle_pod_bot'
  ];

  public static init() {
    if (this.initialized) return;
    this.initialized = true;

    // 1. Nạp Chibi Anime sprites cho 4 Dũng
    this.AGENT_CODES.forEach(code => {
      this.chibiCache[code] = {};
      this.POSES.forEach(pose => {
        const img = new Image();
        img.src = `/sprites/chibi/${code}/${pose}.png`;
        this.chibiCache[code][pose] = img;
      });
    });

    // 2. Nạp nội thất văn phòng & phòng họp
    this.OFFICE_ITEMS.forEach(name => {
      const img = new Image();
      img.src = `/sprites/office/${name}.png`;
      this.officeCache[name] = img;
    });
  }

  /**
   * Lấy Sprite Chibi Anime theo mã nhân vật và tư thế hành động
   */
  public static getChibi(code: string, pose: string): HTMLImageElement | null {
    if (!this.initialized) this.init();
    const agentMap = this.chibiCache[code];
    if (agentMap && agentMap[pose] && agentMap[pose].complete && agentMap[pose].naturalWidth > 0) {
      return agentMap[pose];
    }
    // Fallback sang pose mặc định
    if (agentMap && agentMap['front_happy'] && agentMap['front_happy'].complete && agentMap['front_happy'].naturalWidth > 0) {
      return agentMap['front_happy'];
    }
    return null;
  }

  /**
   * Lấy Sprite nội thất văn phòng
   */
  public static getOffice(name: string): HTMLImageElement | null {
    if (!this.initialized) this.init();
    const img = this.officeCache[name];
    if (img && img.complete && img.naturalWidth > 0) {
      return img;
    }
    return null;
  }
}
