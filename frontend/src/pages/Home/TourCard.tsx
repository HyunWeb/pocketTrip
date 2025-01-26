import React from "react";
import styled from "styled-components";
import TourDateUi from "../../components/Common/TourDateUi";
import CardUserList from "./CardUserList";
import { Link } from "react-router-dom";

interface TravelData {
  name: string; // 여행지 이름
  cost: string; // 현재 누적 금액 (통화 단위 포함)
  ImgArr: string[]; // 참여 인원들의 프로필 이미지 경로 배열
  startOfDay: string; // 여행 시작일 (ISO 날짜 형식)
  endOfDay: string; // 여행 종료일 (ISO 날짜 형식)
  bgImg?: string;
}
interface TourCardProps {
  Tourdata: TravelData; // props 타입 정의
}
const Card = styled(Link)<{ $bgImg: string }>`
  width: 80%;
  height: 422px;
  background-image: linear-gradient(
      to top,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.34) 70%,
      rgba(0, 0, 0, 0) 100%
    ),
    url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center;
  margin: 0 auto;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: white;
  padding: 15px;

  h2 {
    font-size: 32px;
    font-weight: bold;
  }
  p {
    font-size: 24px;
    color: #a3a3a3;
    margin: 10px 0;
  }
`;
const TitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default function TourCard({ Tourdata }: TourCardProps) {
  const {
    name,
    cost,
    ImgArr,
    startOfDay,
    endOfDay,
    bgImg = "japan.jpg",
  } = Tourdata;
  // 참여유저의 프로필 이미지를 모두 가져오면 알아서 ui가 조정된다.
  const startDate = new Date(startOfDay);
  const endDate = new Date(endOfDay);
  const today = new Date();

  // 시작 종료일 시간 차이 계산
  const totalDuration = endDate.getTime() - startDate.getTime();
  // 오늘과 시작일 차이 계산
  const progressDuration = today.getTime() - startDate.getTime();
  // 진행률 0과 100 사이로 제한두고 계산
  const progress =
    totalDuration > 0
      ? Math.min(100, Math.max(0, (progressDuration / totalDuration) * 100))
      : 0;

  return (
    <Card to="/Tour" state={{ Tourdata }} $bgImg={bgImg}>
      <div>
        <TitleWrap>
          <h2>{name}</h2>
          <CardUserList user={ImgArr} />
        </TitleWrap>
        <p>{cost}</p>
        <TourDateUi
          $precent={progress ? progress.toFixed(2) + "%" : "0%"}
          startOfDay={startOfDay}
          endOfDay={endOfDay}
          $bgColor="white"
          $backGraphColor="#626262"
        />
        {/* 진행률 기입 시 자동 변경 */}
      </div>
    </Card>
  );
}
