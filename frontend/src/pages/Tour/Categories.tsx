import React, { use, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { countryNamesInKorean } from "../Data/countryNames";
import DatePicker from "react-datepicker";
import "../../styles/calender.css";
import { Client } from "@stomp/stompjs";
import { socketService } from "./socketService";

interface CategoryState {
  travel: TravelPlan;
  setAccountModalContent: (value: "AccountBook" | "categories") => void;
  ChangeState: () => void;
  subscribeToNewLogs: () => void;
}
type TravelPlan = {
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
};
const categories = [
  { id: 1, label: "숙소", icon: "🏠", color: "#A5D8FF" },
  { id: 2, label: "교통", icon: "🚌", color: "#FFD3B6" },
  { id: 3, label: "식사", icon: "🍽️", color: "#FFEE93" },
  { id: 4, label: "쇼핑", icon: "🛍️", color: "#FFB6C1" },
  { id: 5, label: "선물", icon: "🎁", color: "#D9C2E9" },
  { id: 6, label: "마트", icon: "🛒", color: "#C4E9C5" },
  { id: 7, label: "투어", icon: "🎡", color: "#B9EBC2" },
  { id: 8, label: "카페", icon: "☕", color: "#D9B99B" },
  { id: 9, label: "항공", icon: "✈️", color: "#A8CFF0" },
  { id: 10, label: "통신", icon: "📱", color: "#D1E4F2" },
  { id: 11, label: "의료", icon: "🩺", color: "#AEE6E6" },
  { id: 12, label: "주류", icon: "🍻", color: "#F4A8A8" },
  { id: 13, label: "환전", icon: "💱", color: "#C8E5B5" },
  { id: 14, label: "미용", icon: "💇🏻", color: "#EAB2E8" },
  { id: 15, label: "관광", icon: "🎠", color: "#FFEAB6" },
  { id: 16, label: "팁", icon: "💸", color: "#C8E6D8" },
];
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  height: 100%;
  overflow: scroll;
  padding-bottom: 100px;
  scrollbar-width: none;
`;
const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;

  svg {
    margin-right: 10px;
    cursor: pointer;
    padding: 10px;
  }

  span {
    text-align: center;
    flex: 1;
  }
`;
const CompleteButton = styled.button`
  position: absolute;
  display: block;
  top: 50%;
  right: -20px;
  transform: translate(0, -50%);
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  width: 70px;
  white-space: nowrap;
  font-size: 15px;
  font-weight: bold;
  line-height: 2;
  padding: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }

  &:active {
    background-color: #004494;
    transform: scale(0.95);
  }
`;
const Amount = styled.div<{ $paymentType: string }>`
  background-color: ${(props) =>
    props.$paymentType === "cash" ? "#4CAF50" : "#007BFF"};
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 20px;
  font-weight: bold;
`;
const SelectedUser = styled.span`
  margin-top: 20%;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 900;
  color: #3a3a3a;
  letter-spacing: 3px;
`;
const Display = styled.textarea<{ $hasDescription: boolean }>`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => (props.$hasDescription ? "#333" : "#b0b0b0")};
  text-align: center;
  min-height: 30px;
  margin-top: 20px;
  background-color: transparent;
  border: none;
  outline: none;
  width: 80%;
  font-family: inherit;
  resize: none;
  scrollbar-width: none;
`;
const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  margin: 20px 0;
  margin-top: 15%;
`;
const Category = styled.div<{ $backgroundColor: string; $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
  justify-content: center;
  text-align: center;
  transition: transform 0.3s ease, filter 0.3s ease;

  span {
    font-size: 32px;
    margin-bottom: 10px;
    background-color: ${(props) => props.$backgroundColor};
    border-radius: 50%;
    padding: 15px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    transition: transform 0.3s ease;
  }

  /* 선택된 카테고리에 대한 스타일 */
  ${(props) =>
    props.$isSelected &&
    `
    transform: scale(1.2);
    span {
      transform: scale(1.2);
    }
  `}
`;

export default function Categories({
  travel,
  setAccountModalContent,
  ChangeState,
  subscribeToNewLogs,
}: CategoryState) {
  // const location = useLocation();
  // const { amount, paymentType, selectedUser } = location.state;

  // 리덕스 데이터 받기
  const {
    amount,
    currency,
    paymentType,
    date,
    selectedUser = { name: "", email: "" },
  } = useSelector((state: RootState) => {
    return state.SpendData.value;
  });

  // const { encrypted } = useParams<{ encrypted: string }>();
  const [description, setDescription] = useState("");
  // const [travel, setTravel] = useState({ travelCode: "", location: "" });

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const TourDataArr = useSelector(
    (state: RootState) => state.saveTourData.value
  );

  const findKeyByValue = (obj: { [key: string]: string }, value: string) => {
    return Object.keys(obj).find((key) => obj[key] === value);
  };

  // 현재 다루는 여행 데이터의 여행 코드를 찾는다.
  // useEffect(() => {
  //   const currentTourData = TourDataArr.filter(
  //     (data) => data.encryptCode === encrypted
  //   );
  //   const location = findKeyByValue(
  //     countryNamesInKorean,
  //     currentTourData[0].location
  //   );
  //   setTravel({
  //     location: location!,
  //     travelCode: currentTourData[0].travelCode,
  //   });
  // }, [encrypted]);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const navigate = useNavigate();

  // const goToAccountbook = () => {
  //   navigate(-1);
  // };

  const handleComplete = async () => {
    const selectedCategory = categories.find(
      (cat) => cat.id === selectedCategoryId
    );
    // const data = {
    //   travelCode: travel.travelCode,
    //   currency: travel.location,
    //   amount: Number(amount),
    //   KRW: 1000,
    //   date: selectedDate,
    //   payer: selectedUser?.email,

    //   method: paymentType,
    //   description,
    //   purpose: selectedCategory ? selectedCategory.label : "데이터 없음",
    // };

    const expendituresData = {
      purpose: selectedCategory ? selectedCategory.label : "데이터 없음",
      method: paymentType,
      isPublic: true,
      payer: selectedUser?.email,
      date: selectedDate,
      KRW: 1000,
      amount: Number(amount),
      currency: travel.location,
      description,
    };
    try {
      const token = localStorage.getItem("accessToken");
      socketService.addSpend(travel.travelCode, expendituresData, token);
      // subscribeToNewLogs();

      ChangeState();
      setAccountModalContent("AccountBook");

      console.log("데이터 저장 성공:", expendituresData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("데이터 저장 실패:", error.response?.data);
      } else {
        console.error("알 수 없는 오류:", error);
      }
    }

    // 동적으로 받아온 id를 URL에 반영하여 이동
    // navigate(`/Tour/${encrypted}`, { state: data });
  };

  const getFormattedDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    };
    return today.toLocaleDateString("ko-KR", options);
  };

  const handleCategoryClick = (encrypted: number) => {
    setSelectedCategoryId(encrypted); // 카테고리 클릭 시 선택된 카테고리 ID를 상태로 설정
  };

  return (
    <Container>
      <Header>
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="left"
          viewBox="0 0 16 16"
          onClick={goToAccountbook}
        >
          <path
            fillRule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
          />
        </svg> */}
        {/* <span>{getFormattedDate()}</span> */}
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date!)}
          dateFormat="yyyy-MM-dd"
        />
        <CompleteButton onClick={handleComplete}>완료</CompleteButton>
      </Header>
      <SelectedUser>{selectedUser?.name}</SelectedUser>
      <Amount $paymentType={paymentType}>{`${Number(
        amount
      ).toLocaleString()} ₩`}</Amount>

      <Display
        $hasDescription={!!description}
        value={description}
        onChange={handleDescriptionChange}
        placeholder="어디에 사용하셨나요"
      />
      <CategoriesGrid>
        {categories.map((category) => (
          <Category
            key={category.id}
            $backgroundColor={category.color}
            $isSelected={selectedCategoryId === category.id}
            onClick={() => handleCategoryClick(category.id)} // 카테고리 클릭 시 선택 처리
          >
            <span>{category.icon}</span>
            <div>{category.label}</div>
          </Category>
        ))}
      </CategoriesGrid>
    </Container>
  );
}
