import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

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
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  top: 24px;
  right: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  width: 50px;
  padding: 5px 10px;
  font-size: 15px;
  font-weight: bold;
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

const Amount = styled.div<{ paymentType: string }>`
  background-color: ${(props) =>
    props.paymentType === "cash" ? "#4CAF50" : "#007BFF"};
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 20%;
`;

const Display = styled.textarea<{ hasDescription: boolean }>`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => (props.hasDescription ? "#333" : "#b0b0b0")};
  margin: 20px 0;
  text-align: center;
  min-height: 30px;
  margin-top: 15%;
  background-color: transparent;
  border: none;
  outline: none;
  width: 80%;
  font-family: inherit;
  resize: none;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  margin: 20px 0;
  margin-top: 15%;
`;

const Category = styled.div<{ backgroundColor: string; isSelected: boolean }>`
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
    background-color: ${(props) => props.backgroundColor};
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
    props.isSelected &&
    `
    transform: scale(1.2);
    span {
      transform: scale(1.2);
    }
  `}
`;

export default function Categories() {
  const location = useLocation();
  const { amount, paymentType } = location.state;
  const { id } = useParams(); // useParams를 컴포넌트 상단에서 호출하여 id 값을 받아옴
  console.log(id);
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const navigate = useNavigate();
  const goToAccountbook = () => {
    navigate("/Accountbook");
  };
<<<<<<< HEAD

  const handleComplete = () => {
    const selectedCategory = categories.find(
      (cat) => cat.id === selectedCategoryId
    );
    const data = {
      amount,
      paymentType,
      description,
      category: selectedCategory
        ? {
            id: selectedCategory.id,
            label: selectedCategory.label,
            icon: selectedCategory.icon,
          }
        : null,
    };

    // 동적으로 받아온 id를 URL에 반영하여 이동
    navigate(`/Tour/${id}`, { state: data });
=======
  const handleComplete = () => {
    const selectedCategory = categories.find(
      (cat) => cat.id === selectedCategoryId
    );
    const data = {
      amount,
      paymentType,
      description,
      category: selectedCategory
        ? {
            id: selectedCategory.id,
            label: selectedCategory.label,
            icon: selectedCategory.icon,
          }
        : null,
    };

    navigate("/Tour/1", { state: data }); // , { state: data }
>>>>>>> 0944218 (가계부랑 지갑연결)

    console.log("지출액:", amount);
    console.log("지출 방식:", paymentType);
    console.log("설명:", description);
    console.log("선택한 카테고리 ID:", selectedCategoryId);
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

  const handleCategoryClick = (id: number) => {
    setSelectedCategoryId(id); // 카테고리 클릭 시 선택된 카테고리 ID를 상태로 설정
  };

  return (
    <Container>
      <Header>
        <svg
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
        </svg>
        <span>{getFormattedDate()}</span>
      </Header>
      <CompleteButton onClick={handleComplete}>완료</CompleteButton>
      <Amount paymentType={paymentType}>{`${Number(
        amount
      ).toLocaleString()} ₩`}</Amount>

      <Display
        hasDescription={!!description}
        value={description}
        onChange={handleDescriptionChange}
        placeholder="어디에 사용하셨나요"
      />
      <CategoriesGrid>
        {categories.map((category) => (
          <Category
            key={category.id}
            backgroundColor={category.color}
            isSelected={selectedCategoryId === category.id}
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
