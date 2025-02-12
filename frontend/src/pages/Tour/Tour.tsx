import React, { useEffect, useMemo, useState } from "react";
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
import CryptoJS from "crypto-js";
import { Client } from "@stomp/stompjs";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY!;
const IV = CryptoJS.enc.Utf8.parse("1234567890123456"); // 16바이트 IV

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
export interface MoneyLogProps {
  LogState: "plus" | "minus";
  title: string;
  detail: string;
  profile: string;
  type: "카드" | "현금";
  money: string;
}

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
//   },
//   {
//     id: "2",
//     travelCode: "ddddddd",
//     title: "미국 여행의 방", // 여행지갑 이름
//     location: "미국", // 여행지 이름
//     expense: 1000000,
//     ImgArr: ["./ProfileImage.png", "./ProfileImage.png"], // 참여인원들 프로필 이미지 주소
//     startDate: "2024-10-20",
//     endDate: "2024-10-25",
//   },
//   {
//     id: "3",
//     travelCode: "sdfsdfdfdfdf",
//     title: "프랑스 여행의 방",
//     location: "프랑스", // 여행지 이름
//     expense: 2500000,
//     ImgArr: ["./ProfileImage.png"], // 참여인원들 프로필 이미지 주소
//     startDate: "2024-05-02",
//     endDate: "2024-05-10",
//   },
// ];

export default function Tour() {
  const [travelCodes, setTravelCodes] = useState<string>();
  const dispatch: AppDispatch = useDispatch();
  const data = useSelector((state: RootState) => state.saveTourData);

  const { encrypted } = useParams<{ encrypted: string }>();

  // 뒤로가기 누를때 메인에서 온거면 메인, 마이페이지에서 온거면 그곳으로 되돌아가야한다.
  const { state } = useLocation(); // 메인 / 마이페이지 어디서 들어온 경로인지 판별
  const fromPage = state.from; // "/" 혹은 "/mypage" 경로 추출

  useEffect(() => {
    dispatch(savePath(fromPage));
  }, []);

  useEffect(() => {
    const decode = decrypt(encrypted!);
    setTravelCodes(decode);
  }, [encrypted]);

  const [logs, setLogs] = useState<MoneyLogProps[]>([]);
  const FilteringData = data.value.filter(
    (item) => item.encryptCode === encrypted
  );

  const { amount, paymentType, description, category } = state || {};

  useEffect(() => {
    if (category) {
      setLogs([
        {
          LogState: "minus",
          title: category.label,
          detail: description || "설명 없음",
          profile: "/ProfileImage.png",
          type: paymentType === "cash" ? "현금" : "카드",
          money: Number(amount).toLocaleString(),
        },
      ]);
    }
  }, [amount, paymentType, description, category]);

  const SOCKET_URL = process.env.REACT_APP_SOCKET_BASE_URL;

  // 소켓 통신 (필요시 추가)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!SOCKET_URL || !token) return; // 주소 없을시 종료
    console.log("소켓 연결 시도:");

    const socket = new SockJS(`${SOCKET_URL}`);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (msg) => console.log("[STOMP DEBUG]:", msg),

      // 연결 시도 간격 설정
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        Authorization: `Bearer ${token}`, // 헤더에 JWT 포함
      },

      // 연결 시
      onConnect: () => {
        console.log("연결 성공!");
      },

      // 에러 시
      onStompError: (frame) => {
        console.error("STOMP 오류 발생:", frame);
      },
    });
    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <div>
      <Header $bgColor={"white"} encrypted={encrypted} fromPage={fromPage} />
      <TourInfo Tourdata={FilteringData[0]} />
      <MoneyInfo Tourdata={FilteringData[0]} />
      <Usehistory logs={logs} />
    </div>
  );
}
