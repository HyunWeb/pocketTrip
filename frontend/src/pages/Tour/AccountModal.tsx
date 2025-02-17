import { AppDispatch, RootState } from "@/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";
import AccountBook from "./AccountBook";
import Categories from "./Categories";

interface AccountModal {
  modalMoving: boolean;
  ChangeState: () => void;
  accountModalContent: string;
  travel: TravelPlan;
  setAccountModalContent: (value: "AccountBook" | "categories") => void;
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

const ModalBox = styled.div<{ $isActive: boolean }>`
  background-color: white;
  height: 100vh;
  width: 100%;
  max-width: 768px;
  border-radius: 20px 20px 0 0;
  box-shadow: 0px -1px 3px 3px rgba(0, 0, 0, 0.2);
  position: fixed;
  left: 50%;
  z-index: 80;
  transform: translateX(-50%);
  top: ${(props) => (props.$isActive ? "20px" : "100vh")};
  transition-duration: 500ms;
  padding: 20px;
  box-sizing: border-box;
`;

const CloseButton = styled.button`
  width: 100%;
  font-size: 20px;
  background-color: transparent;
  border: none;
  transition-duration: 300ms;
  border-radius: 20px;
  margin-bottom: 20px;

  &:hover {
    background-color: #e1e1e1;
  }
  &:active {
    background-color: #e1e1e1;
  }
`;

export default function AccountModal({
  modalMoving,
  ChangeState,
  accountModalContent,
  travel,
  setAccountModalContent,
  subscribeToNewLogs,
}: AccountModal) {
  return (
    <ModalBox $isActive={modalMoving}>
      <CloseButton onClick={() => ChangeState()}>
        <IoIosArrowDown />
      </CloseButton>
      {accountModalContent === "AccountBook" && (
        <AccountBook
          travel={travel}
          setAccountModalContent={setAccountModalContent}
        />
      )}
      {accountModalContent === "categories" && (
        <Categories
          travel={travel}
          setAccountModalContent={setAccountModalContent}
          ChangeState={ChangeState}
          subscribeToNewLogs={subscribeToNewLogs}
        />
      )}
    </ModalBox>
  );
}
