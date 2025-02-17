import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface Expenditure {
  expenditureId: string; // 지출 ID
  travelCode: string; // 여행 코드
  purpose: string; // 지출 목적 (예: 숙소, 식비 등)
  method: "card" | "cash"; // 결제 방법 (카드 or 현금)
  payer: string; // 결제한 사람 (이메일 또는 ID)
  date: string; // 날짜 (YYYY-MM-DD 형식)
  amount: number; // 결제 금액
  currency: string; // 통화 (예: "그린란드", "KRW" 등)
  description: string; // 지출 설명
  public: boolean; // 공개 여부
  krw: number; // 환산된 원화 금액 (소문자 키)
  KRW: number; // 환산된 원화 금액 (대문자 키)
}

const SOCKET_URL = process.env.REACT_APP_API_BASE_URL;

class SocketService {
  private static instance: SocketService;
  private client: Client | null = null;

  // 싱글톤 패턴을 위한 인스턴스 생성 방지
  private constructor() {}

  // 하나의 인스턴스만 만든다.
  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }

    return SocketService.instance;
  }

  // 소켓 연결 시도한다.
  public connect(token: string) {
    if (this.client && this.client.connected) {
      console.log("✅ 이미 WebSocket 연결됨");
      return;
    }

    const socket = new SockJS(`${SOCKET_URL}/ws`);
    this.client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      // debug: (msg) => console.log(msg),
      reconnectDelay: 5000,
    });

    this.client.onConnect = () => {
      console.log("✅ WebSocket 연결 성공!");
    };

    this.client.onStompError = (frame) => {
      console.error("❌ WebSocket 오류:", frame);
    };

    this.client.activate();
  }

  public initialSend(
    travelCodes: string | undefined,
    body: object,
    token: string | null
  ) {
    if (this.client && this.client.connected && travelCodes) {
      this.client.publish({
        destination: `/app/travelPlan/${travelCodes}`,
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
    }
  }

  public addSpend(
    travelCodes: string | undefined,
    body: object,
    token: string | null
  ) {
    if (this.client && this.client.connected && travelCodes) {
      this.client.publish({
        destination: `/app/travelPlan/${travelCodes}/Insert`,
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
    }
  }

  public Logsubscribe(
    travelCodes: string | undefined,
    callback1: (message: any) => void,
    callback2: (message: any) => void
  ) {
    if (!this.client || !this.client.connected) {
      console.error("❌ WebSocket이 연결되지 않았습니다.");
      return;
    }

    this.client.subscribe(`/user/queue/${travelCodes}`, (message) => {
      const messages = message.body;
      const response = JSON.parse(messages).body.data;
      const Tourdata = JSON.parse(response[0]);
      const TourDataResult = Tourdata.data[0];
      const spendData = JSON.parse(response[1]);
      // 소비내역을 리스트 속성 상태에 맞게 정리
      const spendList = spendData.map((data: Expenditure, index: number) => {
        return {
          LogState: "minus",
          title: data.purpose,
          detail: data.description || "설명 없음",
          profile: "/ProfileImage.png",
          type: data.method === "cash" ? "현금" : "카드",
          money: Number(data.amount).toLocaleString(),
        };
      });
      callback1(spendList);
      callback2(TourDataResult);
    });
  }

  public RealTimeLogSubscribe(
    travelCodes: string | undefined,
    callback: (message: any) => void
  ) {
    if (!this.client || !this.client.connected) {
      console.error("❌ WebSocket이 연결되지 않았습니다.");
      return;
    }

    this.client.subscribe(`/topic/insert/${travelCodes}`, (message) => {
      const result = JSON.parse(message.body);
      const result2 = JSON.parse(result.body.data[0]);
      const spendList = result2.map((data: Expenditure, index: number) => {
        return {
          LogState: "minus",
          title: data.purpose,
          detail: data.description || "설명 없음",
          profile: "/ProfileImage.png",
          type: data.method === "cash" ? "현금" : "카드",
          money: Number(data.amount).toLocaleString(),
        };
      });
      callback([...spendList]);
    });
  }

  public disconnect() {
    if (this.client) {
      this.client.deactivate();
      console.log("🚫 WebSocket 연결 종료");
    }
  }
}

export const socketService = SocketService.getInstance();
