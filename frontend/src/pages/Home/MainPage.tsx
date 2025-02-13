import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { ChangeCurrentPage } from "../../slices/currentPageSlice";
import Header from "../../components/Common/Header";
import Alert from "../../components/Common/Alert";
import TourCard from "./TourCard";
import styled from "styled-components";
import EmptyCard from "./EmptyCard";
import NextTour from "./NextTour";
import CodeBanner from "./CodeBanner";
import InputCodeBox from "../../components/Common/InputCodeBox";
import RankChart from "./RankChart";
import axios from "axios";
import { setTravelData } from "../../slices/SaveTourDataSlice";
import CryptoJS from "crypto-js";
import { saveUser } from "../../slices/userDataSlice";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || "default-secret-key";
const IV = CryptoJS.enc.Utf8.parse("1234567890123456"); // 16바이트 IV

const encrypt = (data: string) => {
  const encrypted = CryptoJS.AES.encrypt(
    data,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {
      iv: IV,
      mode: CryptoJS.mode.CBC, // CBC 모드를 명시적으로 지정
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();

  // Base64 → URL-safe 변환
  return encrypted.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

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

interface User {
  id: string; // MongoDB ObjectId 형식
  name: string; // 사용자 이름
  email: string; // 이메일 (형식 검증 필요)
  password: string; // 암호화된 비밀번호 (bcrypt 해싱됨)
  phone: string; // 전화번호 (형식 검증 필요)
}

const H2 = styled.h2`
  font-size: 18px;
  font-weight: 500;
  font-family: inherit;
  margin: 20px;
`;

export default function MainPage() {
  const dispatch: AppDispatch = useDispatch();
  const [TourDataArr, setTourDataArr] = useState<TravelPlan[]>([]);
  const [CurrentTour, setCurrentTour] = useState<TravelPlan>();
  const [nextTourData, setNextTourData] = useState<TravelPlan>();
  // 알림창 관련 로직
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [InputCodeVisible, setInputCodeVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userDatas, setUserDatas] = useState<User>();
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "success"
  );

  useEffect(() => {
    dispatch(ChangeCurrentPage("home"));
    const token = localStorage.getItem("accessToken");
    getTravelData(token as string); // 여행 정보 요청
    getUserProfile(token as string); // 유저 정보 요청
  }, []);

  // 위에서 필요한 정보 요청이 끝나면 이후에 필요한 여행을 선택한다.
  useEffect(() => {
    if (TourDataArr.length > 0) {
      SelectCurrentTourData();
      dispatch(setTravelData(TourDataArr)); // 암호화 코드 추가된 여행 정보 저장
    }
  }, [TourDataArr]);

  // 현재 여행중인 여행정보를 하나만 선정한다.
  useEffect(() => {
    if (CurrentTour) {
      const currentEndTime = new Date(CurrentTour.endDate).getTime();
      const SortingArr =
        TourDataArr.length >= 2 ? SortingTour(TourDataArr) : TourDataArr;
      const NextTours = SortingArr.filter(
        (data) => new Date(data.startDate).getTime() >= currentEndTime
      );
      setNextTourData(NextTours[0]);
    }
  }, [CurrentTour]);

  useEffect(() => {
    if (isAlertVisible) {
      const timer = setTimeout(() => {
        setIsAlertVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAlertVisible]);

  // 유저의 모든 여행 기록을 받아와서 암호화 코드를 추가 한다.
  const getTravelData = async (token: string) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/plan/find`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const TourData = response.data.data;
    // 암호화 코드 저장
    const updatedTourData = TourData.map((item: TravelPlan, index: number) => ({
      ...item,
      encryptCode: encrypt(item.travelCode),
    }));
    setTourDataArr(updatedTourData);
  };

  const getUserProfile = async (token: string) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/auth/userprofile`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    setUserDatas(response.data.data[0]);
    dispatch(saveUser(response.data.data[0]));
  };

  const SelectCurrentTourData = () => {
    const currentTourList: TravelPlan[] = [];
    const currentTime = new Date().getTime();

    // 현재시간 기준 여행중인 정보들만 뽑아낸다.
    TourDataArr &&
      TourDataArr.map((data: TravelPlan, index: number) => {
        const startTime = new Date(data.startDate).getTime();
        const endTime = new Date(data.endDate).getTime();

        if (startTime <= currentTime && currentTime <= endTime) {
          currentTourList.push(data);
        }
      });

    // 현재 여행도중인 여행정보들만 대입
    // 출발순으로 정렬된 여행들 중 첫번째 여행을 지정한다.
    setCurrentTour(SortingTour(currentTourList)[0]);
  };

  // 현재 여행중인 정보들을 출발 순서대로 정렬 > 가장 빨리 출발한걸 하나 선택
  const SortingTour = (currentTourList: TravelPlan[]) => {
    currentTourList = [...currentTourList].sort(
      (a: TravelPlan, b: TravelPlan) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    return currentTourList;
  };

  const handleAction = () => {
    setAlertMessage("작업이 성공적으로 완료되었습니다.");
    setAlertType("success");
    setIsAlertVisible(true);
  };

  // axios 요청으로 현재 날짜 기준으로 해당하는 여행 정보를 하나만 불러온다.
  // 현재 여행
  const data = CurrentTour && {
    id: CurrentTour?.id,
    travelCode: CurrentTour?.travelCode,
    name: CurrentTour?.title, // 여행지갑 이름
    location: CurrentTour?.location, // 여행지 이름
    expense: CurrentTour?.expense, // 현재 누적 금액
    ImgArr: [
      "./ProfileImage.png",
      "./ProfileImage.png",
      "./ProfileImage.png",
      "./ProfileImage.png",
      "./ProfileImage.png",
      "./ProfileImage.png",
      "./ProfileImage.png",
    ], // 참여인원들 프로필 이미지 주소
    startDate: CurrentTour?.startDate, // 여행 시작일
    endDate: CurrentTour?.endDate, // 여행 종료일
    encryptCode: CurrentTour.encryptCode,
  };

  // 유저 데이터
  const userData = userDatas && {
    name: userDatas.name,
    profile: "ProfileImage.png",
  };

  // 현재 여행이 없을 경우
  // const data = CurrentTour;
  // console.log(data);

  // 다음 여행지 계획
  const nextTour = nextTourData
    ? {
        location: nextTourData?.location,
        startDate: nextTourData?.startDate, // 여행 시작일
        endDate: nextTourData?.endDate, // 여행 종료일
      }
    : false;
  // 다음 여행지 계획이 없을 경우
  // const nextTour = false;

  // 순위 데이터
  const popularCountry = {
    labels: ["일본", "태국", "프랑스"],
    data: [60, 40, 20],
  };
  return (
    <div style={{ paddingBottom: "100px" }}>
      <Header $bgColor={"#eaf6ff"} userData={userData} />
      <H2>현재 여행중인 지역</H2>
      {data ? <TourCard Tourdata={data} /> : <EmptyCard />}
      <H2>다가오는 여행</H2>
      <NextTour nextTour={nextTour} />
      <CodeBanner setInputCodeVisible={setInputCodeVisible} />
      <RankChart popularCountry={popularCountry} />
      {isAlertVisible && (
        <Alert
          alertState={alertType}
          message={alertMessage}
          setIsAlertVisible={setIsAlertVisible}
        />
      )}
      {InputCodeVisible && (
        <InputCodeBox setInputCodeVisible={setInputCodeVisible} />
      )}
    </div>
  );
}
