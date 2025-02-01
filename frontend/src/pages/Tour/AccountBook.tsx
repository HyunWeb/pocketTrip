import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
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

const CurrencyButton = styled.button`
  background-color: #d9d9d9;
  color: black;
  border: none;
  border-radius: 20px;
  padding: 5px 15px;
  font-size: 17px;
  font-weight: bold;
  margin-top: 20%;
  cursor: pointer;
  height: 40px;
`;

const Display = styled.div<{ hasAmount: boolean }>`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => (props.hasAmount ? "#333" : "#b0b0b0")};
  margin: 20px 0;
  text-align: center;
  min-height: 30px;
  margin-top: 15%;
`;

const Keypad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 90%;
  margin: 20px 0;
  margin-top: 15%;
`;

const Key = styled.button`
  background-color: #d9d9d9;
  font-size: 24px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  height: 60px;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const DeleteKey = styled(Key)`
  svg {
    width: 24px;
    height: 24px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 20px;
  gap: 10px;
`;

const ActionButton = styled.button<{ bgColor: string }>`
  background-color: ${(props) => props.bgColor};
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 20px;
  padding: 10px 30px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export default function AccountBook() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("KRW");
  const navigate = useNavigate();

  const getFormattedDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    };
    return today.toLocaleDateString("ko-KR", options);
  };

  const handleKeyPress = (key: string) => {
    if (key === "delete") {
      setAmount((prev) => prev.slice(0, -1));
    } else if (key === ".") {
      if (!amount.includes(".")) setAmount((prev) => prev + key);
    } else {
      setAmount((prev) => prev + key);
    }
  };

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "KRW" ? "USD" : "KRW"));
  };

  const handleSvgClick = () => {
    navigate(-1);
  };

  const currencySymbol = currency === "KRW" ? "₩" : "$";

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
          onClick={handleSvgClick}
        >
          <path
            fillRule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
          />
        </svg>
        <span>{getFormattedDate()}</span>
      </Header>

      <CurrencyButton onClick={toggleCurrency}>{currency} ▼</CurrencyButton>

      <Display hasAmount={!!amount}>
        {amount
          ? `${parseFloat(amount).toLocaleString()} ${currencySymbol}`
          : "얼마를 사용하셨나요"}
      </Display>

      <Keypad>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map((key) => (
          <Key key={key} onClick={() => handleKeyPress(key)}>
            {key}
          </Key>
        ))}
        <DeleteKey onClick={() => handleKeyPress("delete")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-backspace"
            viewBox="0 0 16 16"
          >
            <path d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z" />
            <path d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
          </svg>
        </DeleteKey>
      </Keypad>

      <Footer>
        <ActionButton
          bgColor="#4CAF50"
          onClick={() => console.log("Cash clicked", amount)}
        >
          현금
        </ActionButton>
        <ActionButton
          bgColor="#007BFF"
          onClick={() => console.log("Card clicked", amount)}
        >
          카드
        </ActionButton>
      </Footer>
    </Container>
  );
}
