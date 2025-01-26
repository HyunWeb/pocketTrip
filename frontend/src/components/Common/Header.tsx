import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import styled, { keyframes } from "styled-components";
import Modal from "./Modal";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { IoIosArrowBack } from "react-icons/io";
import { BsPersonSquare } from "react-icons/bs";
import { FaChartPie } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface HeaderState {
  $bgColor?: string;
}

const HeaderWrap = styled.div<{ $bgColor: string }>`
  padding: 20px;
  background-color: ${(props) => props.$bgColor};
  display: flex;
  justify-content: space-between;
`;

const BackButton = styled.button`
  padding: 0;
  width: 33px;
  height: 33px;
  background-color: transparent;
  border: none;
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    background-color: transparent;
    border: none;
    width: 40px;
  }
`;

export default function Header({ $bgColor = "transparent" }: HeaderState) {
  const [pathName, setPathName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    setPathName(location.pathname);
  }, []);

  // 리덕스로 모달 상태 글로벌 참조
  const modalState = useSelector(
    (state: RootState) => state.modalControl.modalState
  );

  return (
    <HeaderWrap $bgColor={$bgColor}>
      {pathName !== "/" && pathName !== "/mypage" && (
        <BackButton onClick={() => navigate(-1)}>
          <IoIosArrowBack size={"25px"} />
        </BackButton>
      )}
      {pathName === "/Tour" && (
        <ButtonBox>
          <div>
            <Link to="/TourMembers">
              <button>
                <FaChartPie size={"25px"} />
              </button>
            </Link>
            <Link to="/MoneyChart">
              <button>
                <BsPersonSquare size={"25px"} />
              </button>
            </Link>
          </div>
        </ButtonBox>
      )}
      {modalState && <Modal />}
      <Nav />
    </HeaderWrap>
  );
}
