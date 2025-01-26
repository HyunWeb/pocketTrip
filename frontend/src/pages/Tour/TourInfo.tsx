import React from "react";
import styled from "styled-components";
import TourDateUi from "../../components/Common/TourDateUi";

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

const TourWrap = styled.div`
  padding: 20px;
  background-color: white;
  position: relative;
  box-shadow: 0px 9px 9px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 16px;
    color: #919191;
    margin-bottom: 10px;
  }
  h3 {
    font-size: 40px;
    font-weight: bold;
    color: #051e31;
    margin-bottom: 20px;
  }

  &::after {
    content: "";
    width: 0px;
    height: 0px;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, -1px);
    border-top: 20px solid white;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 20px solid transparent;
    filter: drop-shadow(0px 6px 6px rgba(0, 0, 0, 0.1));
  }
`;
export default function TourInfo({ Tourdata }: TourCardProps) {
  // 참여유저의 프로필 이미지를 모두 가져오면 알아서 ui가 조정된다.
  const startDate = new Date(Tourdata.startOfDay);
  const endDate = new Date(Tourdata.endOfDay);
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
    <TourWrap>
      <h2>여행지</h2>
      <h3>일본</h3>
      <TourDateUi
        $precent={progress ? progress.toFixed(2) + "%" : "0%"}
        startOfDay={Tourdata.startOfDay}
        endOfDay={Tourdata.endOfDay}
        $bgColor="black"
        $backGraphColor="#E9E9E9"
      />
    </TourWrap>
  );
}
