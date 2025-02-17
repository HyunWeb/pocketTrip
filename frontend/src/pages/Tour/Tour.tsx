import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/Common/Header";
import TourInfo from "./TourInfo";
import { useLocation, useParams } from "react-router-dom";
import MoneyInfo from "./MoneyInfo";
import Usehistory from "./Usehistory";
import { io } from "socket.io-client";
import SockJS from "sockjs-client"; // SockJS 추가
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { savePath } from "../../slices/RoutePathSlice";
import axios from "axios";
import Modal from "../..//components/Common/Modal";
import AccountModal from "./AccountModal";
import CryptoJS, { enc } from "crypto-js";
import { Stomp, Message, Client } from "@stomp/stompjs";
import { socketService } from "./socketService";

export interface MoneyLogProps {
  LogState: "plus" | "minus";
  title: string;
  detail: string;
  profile: string;
  type: "카드" | "현금";
  money: string;
}

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
interface TravelPlan {
  id: string;
  travelCode: string;
  title: string;
  founder: string;
  location: string;
  startDate: string; // 날짜 문자열
  endDate: string; // 날짜 문자열
  expense: number;
  calculate: boolean;
  participants: string[]; // 참가자 리스트 (배열)
  encryptCode: string;
}

interface PaymentState {
  amount: string | null;
  selectedUser: selectedUserType | null;
  paymentType: string | null;
}
type selectedUserType = { name: string; email: string };

// const data = [
//   {
//     id: "1",
//     travelCode: "sdsdds",
//     title: "일본여행지갑", // 여행지갑 이름
//     location: "일본", // 여행지 이름
//     expense: 2000000, // 현재 누적 금액
//     ImgArr: [
//       "./ProfileImage.png",
//       "./ProfileImage.png",
//       "./ProfileImage.png",
//       "./ProfileImage.png",
//       "./ProfileImage.png",
//       "./ProfileImage.png",
//       "./ProfileImage.png",
//     ], // 참여인원들 프로필 이미지 주소
//     startDate: "2025-01-18", // 여행 시작일
//     endDate: "2025-02-20", // 여행 종료일
//     bgImg: "./japan.jpg",
//   }
// ];

export default function Tour() {
  const SOCKET_URL = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("accessToken");
  const SECRET_KEY = process.env.REACT_APP_SECRET_KEY!;
  const IV = CryptoJS.enc.Utf8.parse("1234567890123456"); // 16바이트 IV
  const stompClientRef = useRef<Client | null>(null);
  const decrypt = (encryptedData: string) => {
    // URL-safe Base64 복구
    const base64 = encryptedData.replace(/-/g, "+").replace(/_/g, "/");

    const decrypted = CryptoJS.AES.decrypt(
      base64,
      CryptoJS.enc.Utf8.parse(SECRET_KEY),
      {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8); // 복호화된 문자열 반환
  };
  const [travelCodes, setTravelCodes] = useState<string>();
  const [logs, setLogs] = useState<MoneyLogProps[]>([]);
  const [TourData, setTourData] = useState<TravelPlan>({
    id: "",
    travelCode: "",
    title: "",
    founder: "",
    location: "",
    startDate: "", // 날짜 문자열
    endDate: "", // 날짜 문자열
    expense: 0,
    calculate: false,
    participants: [], // 참가자 리스트 (배열)
    encryptCode: "",
  });
  const [FilteringData, setFilteringData] = useState<TravelPlan[]>([]);

  const dispatch: AppDispatch = useDispatch();
  const { encrypted } = useParams<{ encrypted: string }>();

  const { state } = useLocation(); // 메인 / 마이페이지 어디서 들어온 경로인지 판별
  const fromPage = state.from; // "/" 혹은 "/mypage" 경로 추출
  const [modalVisible, setModalVisible] = useState<boolean>(false); // 모달 생성
  const [modalMoving, setModalMoving] = useState<boolean>(false); // 모달 움직임 제어
  const [accountModalContent, setAccountModalContent] = useState<
    "AccountBook" | "categories"
  >("AccountBook");

  // 홈 혹은 마이페이지 중 어느 경로로 들어온건지 저장 (뒤로가기 기능)
  useEffect(() => {
    dispatch(savePath(fromPage)); // 뒤로가기 경로 설정
    const decode = decrypt(encrypted!); // 여행코드 해독
    setTravelCodes(decode); // 여행코드 저장
  }, []);

  //-------------------------------------------------
  // 소켓 통신 (필요시 추가)
  // useEffect(() => {
  //   if (!token) {
  //     console.error("❌ AccessToken이 없습니다. WebSocket 연결 불가.");
  //     return;
  //   }
  //   // 재연결 방지
  //   if (stompClientRef.current && stompClientRef.current.active) {
  //     console.log("✅ 이미 WebSocket이 활성화되어 있습니다.");
  //     return;
  //   }

  //   if (!SOCKET_URL) return;

  //   // 소켓 연결 시작
  //   const socket = new SockJS(`${SOCKET_URL}/ws`);
  //   const client = Stomp.over(socket);

  //   const stompClient = new Client({
  //     webSocketFactory: () => socket,
  //     connectHeaders: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     debug: (msg) => console.log(msg),
  //     reconnectDelay: 5000,
  //     heartbeatIncoming: 4000,
  //     heartbeatOutgoing: 4000,
  //   });

  //   stompClient.onConnect = () => {
  //     console.log("연결 성공");

  //     // ✅ 서버에서 메시지를 받을 구독 경로 설정
  //     stompClient.subscribe(`/queue/${travelCodes}`, (message) => {
  //       console.log("📩 받은 메시지:", message.body);
  //     });

  //     // ✅ 서버로 메시지를 보내기
  //     stompClient.publish({
  //       destination: `/travelPlan/${travelCodes}`,
  //       body: JSON.stringify({ sender: "user1", content: "Hello WebSocket!" }),
  //     });
  //   };

  //   stompClient.onStompError = (frame) => {
  //     console.error("소켓 오류", frame);
  //   };

  //   // stompClient.activate();

  //   stompClientRef.current = stompClient;

  //   return () => {
  //     if (stompClientRef.current) {
  //       stompClientRef.current.deactivate();
  //     }
  //   };
  // }, []);
  useEffect(() => {
    if (!token || !travelCodes) return;

    // 초기 요청
    socketService.initialSend(
      travelCodes,
      {
        message: "여행 계획을 요청합니다.",
      },
      token
    );

    // 기존 기록들 받아오는 구독 (과거 지출기록, 여행 정보)
    socketService.Logsubscribe(travelCodes, setLogs, setTourData);
    // 새로운 기록 실시간 추가하는 구독
    subscribeToNewLogs();
  }, [travelCodes]);

  const subscribeToNewLogs = () => {
    if (!token) return console.warn(" 토큰 혹은 여행코드가 없습니다.");
    if (!travelCodes) return console.warn(" 여행코드가 없습니다.");

    socketService.RealTimeLogSubscribe(travelCodes, setLogs);
  };

  // useEffect(() => {
  //   const token = localStorage.getItem("accessToken");
  //   if (!SOCKET_URL || !token || !travelCodes) return; // 주소나 토큰 없을 시 종료

  //   const socket = new SockJS(`${SOCKET_URL}/ws`);
  //   const client = Stomp.over(socket);

  //   // WebSocket 연결 시 Authorization 헤더에 JWT 토큰 전달
  //   client.connect(
  //     { Authorization: `Bearer ${token}` }, // 이 부분이 중요
  //     (frame: String) => {
  //       console.log("소켓 연결 성공", frame);
  //       if (encrypted === undefined) return;

  //       // 소비내역 불러오기 (요청 및 응답)
  //       client.send(
  //         `/app/travelPlan/${travelCodes}`,
  //         { Authorization: `Bearer ${token}` },
  //         JSON.stringify({
  //           message: "여행 계획을 요청합니다.",
  //         })
  //       );

  //       client.subscribe(`/user/queue/${travelCodes}`, (message) => {
  //         console.log(message);
  //         const messages = message.body;
  //         const response = JSON.parse(messages).body.data;
  //         // const Tourdata = JSON.parse(response[0]);
  //         const spendData = JSON.parse(response[1]);

  //         // 소비내역을 리스트 속성 상태에 맞게 정리
  //         const spendList = spendData.map(
  //           (data: Expenditure, index: number) => {
  //             console.log(data);
  //             return {
  //               LogState: "minus",
  //               title: data.purpose,
  //               detail: data.description || "설명 없음",
  //               profile: "/ProfileImage.png",
  //               type: data.method === "cash" ? "현금" : "카드",
  //               money: Number(data.amount).toLocaleString(),
  //             };
  //           }
  //         );
  //         setLogs(spendList);
  //       });

  //       // 구독
  //       // client.subscribe("/topic/travelPlan", function (response) {
  //       //   console.log("서버로부터 받은 메시지: " + response.body);
  //       // });

  //       // // 메시지 전송
  //       // client.send("/app/travelPlan", {}, "여행 계획 메시지");

  //       //Tour 페이지에서 여행 계획 추가 요청;
  //       // insertAccountBook(expendituresData);
  //       client.subscribe(`/topic/insert/${travelCodes}`, function (response) {
  //         // 만약 JSON 형태로 응답이 온다면, 이를 객체로 변환
  //         const message = response.body;
  //         const obj = JSON.parse(message).body.data;
  //         console.log("나에게 온 메시지: " + obj);
  //       });

  //       updateAccountBook(expendituresupdateData);
  //       // client.subscribe(
  //       //   `/topic/${decrypt(encrypted)}/${expendituresURL}/Update`, // 경로
  //       //   function (response) {
  //       //     // 만약 JSON 형태로 응답이 온다면, 이를 객체로 변환
  //       //     const message = response.body;
  //       //     const obj = JSON.parse(message).body.data;
  //       //     console.log("나에게 온 메시지: " + obj);
  //       //   }
  //       // );
  //     },
  //     function (error: String) {
  //       console.log("소켓 연결 실패", error);
  //     }
  //   );

  //   const expendituresData = {
  //     purpose: "dfsdfdf",
  //     method: "dfdff",
  //     isPublic: true,
  //     payer: "ccc1459@naver.com",
  //     date: "2015-10-19",
  //     KRW: 555456,
  //     amount: 4444,
  //     currency: "dfddddff",
  //     description: "fdfdf",
  //   };

  //   function insertAccountBook(expendituresData: any) {
  //     // 메시지 전송
  //     // 메시지 수신
  //     if (encrypted === undefined) return;

  //     client.send(
  //       `/app/travelPlan/${decrypt(encrypted)}/Insert`, // 경로
  //       { Authorization: `Bearer ${token}` }, // 헤더 (Authorization 포함)
  //       JSON.stringify(expendituresData) // 객체를 JSON 문자열로 변환하여 본문에 포함
  //     );
  //   }

  //   const expendituresupdateData = {
  //     purpose: "dfsdfdf11111111111111111111",
  //     method: "dfdff111111111111111",
  //     isPublic: false,
  //     payer: "ccc1459@naver.com",
  //     date: "2015-10-11",
  //     amount: 4445555,
  //     currency: "dfddddffaaa",
  //     KRW: 555,
  //     description: "fdfdfdddd",
  //   };

  //   const expendituresURL = "oNpoTZYN";
  //   //비용 데이터를 수정하기 위한 expenditureID
  //   function updateAccountBook(expendituresupdateData: any) {
  //     if (encrypted === undefined) return;
  //     client.send(
  //       `/app/travelPlan/${decrypt(encrypted)}/${expendituresURL}/Update`, // 경로
  //       { Authorization: `Bearer ${token}` }, // 헤더 (Authorization 포함)
  //       JSON.stringify(expendituresupdateData)
  //       // 객체를 JSON 문자열로 변환하여 본문에 포함
  //     );
  //   }

  //   return () => {
  //     // 컴포넌트 언마운트 시 연결 종료
  //     client.disconnect(() => {
  //       console.log("소켓 연결 종료");
  //     });
  //   };
  // }, [SOCKET_URL, token, travelCodes]); // 의존성 배열에 추가

  // 유저의 모든 여행 기록을 받아와서 암호화 코드를 추가 한다.

  //----------------------------------------------------

  const getTravelData = async (token: string) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/plan/select/${travelCodes}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
    const TourData = response.data.data[0];
    setTourData(TourData);
  };

  const fetchSpendingLogs = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/expenditures/${travelCodes}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setLogs(response.data.data); // 서버에서 받은 데이터를 logs에 저장
    } catch (error) {
      console.error("지출 내역 불러오기 실패:", error);
    }
  };

  // 버튼 동작에 따라서 모달창이 on/off된다.
  const ChangeState = () => {
    // 모달창이 렌더링 되기 전이면 렌더링 후 등장
    if (modalVisible === false) {
      setModalVisible(true);
      setTimeout(() => {
        setModalMoving(true);
      }, 50);
    } else {
      // // 모달창이 렌더링 되어 있는 상태면 내리는 동작 이후 제거
      setModalMoving(false);
      setTimeout(() => {
        setModalVisible(false);
      }, 500);
      setAccountModalContent("AccountBook");
    }
  };
  return (
    <div>
      <Header $bgColor={"white"} encrypted={encrypted} fromPage={fromPage} />
      {TourData && <TourInfo Tourdata={TourData} />}
      {TourData && <MoneyInfo Tourdata={TourData} ChangeState={ChangeState} />}
      <Usehistory logs={logs} />
      {modalVisible && (
        <AccountModal
          modalMoving={modalMoving}
          ChangeState={ChangeState}
          travel={TourData}
          accountModalContent={accountModalContent}
          setAccountModalContent={setAccountModalContent}
          subscribeToNewLogs={subscribeToNewLogs}
        />
      )}
    </div>
  );
}
