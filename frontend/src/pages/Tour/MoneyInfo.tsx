import React from "react";
import Button from "../../components/Common/Button";
import styled from "styled-components";

interface TravelData {
  name: string; // 여행지갑 이름
  selectedCountry: string; // 여행지 이름
  budget: string; // 현재 누적 금액 (통화 단위 포함)
  ImgArr: string[]; // 참여 인원들의 프로필 이미지 경로 배열
  startDate: string; // 여행 시작일 (ISO 날짜 형식)
  endDate: string; // 여행 종료일 (ISO 날짜 형식)
  bgImg?: string;
}
interface TourCardProps {
  Tourdata: TravelData; // props 타입 정의
}
const MoneyInfoWrap = styled.div`
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  h2 {
    font-size: 16px;
    color: #919191;
    margin-bottom: 15px;
  }
  strong {
    font-size: 40px;
    color: #051e31;
    font-weight: bold;
    position: relative;
    margin-bottom: 30px;

    &::before {
      content: "₩";
      color: #7e7e7e;
      font-size: 36px;
      position: absolute;
      left: -10px;
      transform: translateX(-100%);
      font-weight: 400;
    }
  }
  /* strong > span {
    color: #7e7e7e;
    font-size: 36px;
  } */
`;

export default function MoneyInfo({ Tourdata }: TourCardProps) {
  return (
    <MoneyInfoWrap>
      <h2>현재예산</h2>
      <strong>{Tourdata.budget}</strong>
      {/* <span>₩</span> */}
      <Button size="M" name="가계부 작성" />
    </MoneyInfoWrap>
  );
}
