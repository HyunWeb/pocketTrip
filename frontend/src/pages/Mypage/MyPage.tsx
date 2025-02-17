import React, { useEffect, useState } from "react";
import Header from "../../components/Common/Header";
import { useDispatch, useSelector } from "react-redux";
import OptionButton from "../../components/Common/OptionButton";
import { AppDispatch, RootState } from "../../store";
import { ChangeCurrentPage } from "../../slices/currentPageSlice";
import styled from "styled-components";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import TourCardList from "./TourCardList";
import { setTravelData } from "@/slices/travelSlice";

interface TravelPlan {
  id: string;
  encryptCode: string;
  travelCode: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  expense: number;
  profiles: string[];
  bgImg?: string;
}

export default function MyPage() {
  const token = localStorage.getItem("accessToken");
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [TourDataArr, setTourDataArr] = useState<TravelPlan[]>([]);

  const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || "default-secret-key";
  const IV = CryptoJS.enc.Utf8.parse("1234567890123456"); // 16바이트 IV

  // 암호화
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

  useEffect(() => {
    getTravelData(token!);
  }, []);

  useEffect(() => {
    dispatch(ChangeCurrentPage("mypage"));
    const token = localStorage.getItem("accessToken");

    getTravelData(token as string); // 여행 정보 요청
  }, []);

  const getTravelData = async (token: string) => {
    // 유저의 모든 여행 기록을 받아온다.
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
    if (TourData.length > 0) {
      // 암호화 코드 저장
      const updatedTourData = TourData.map(
        (item: TravelPlan, index: number) => ({
          ...item,
          encryptCode: encrypt(item.travelCode),
        })
      );
      setTourDataArr(updatedTourData);
    }
  };

  // const travelList: TravelPlan[] = [
  //   {
  //     id: "1",
  //     travelCode: "sdsdds",
  //     name: "일본여행지갑",
  //     startDate: "2025-01-18",
  //     endDate: "2025-02-20",
  //     expense: 2000000,
  //     ImgArr: [
  //       "./ProfileImage.png",
  //       "./ProfileImage.png",
  //       "./ProfileImage.png",
  //       "./ProfileImage.png",
  //       "./ProfileImage.png",
  //       "./ProfileImage.png",
  //       "./ProfileImage.png",
  //     ], // 참여인원들 프로필 이미지 주소
  //     bgImg: "/japan.jpg",
  //   },
  //   {
  //     id: "2",
  //     travelCode: "ddddddd",
  //     name: "미국 여행의 방",
  //     startDate: "2024-10-20",
  //     endDate: "2024-10-25",
  //     expense: 1000000,
  //     ImgArr: [
  //       "./ProfileImage.png",
  //       "./ProfileImage.png",
  //       "./ProfileImage.png",
  //       "./ProfileImage.png",
  //       "./ProfileImage.png",
  //       "./ProfileImage.png",
  //       "./ProfileImage.png",
  //     ], // 참여인원들 프로필 이미지 주소
  //   },
  //   {
  //     id: "3",
  //     travelCode: "sdfsdfdfdfdf",
  //     name: "프랑스 여행의 방",
  //     startDate: "2024-05-02",
  //     endDate: "2024-05-10",
  //     expense: 2500000,
  //     ImgArr: [
  //       "./ProfileImage.png",
  //       "./ProfileImage.png",
  //       "./ProfileImage.png",
  //       "./ProfileImage.png",
  //       "./ProfileImage.png",
  //       "./ProfileImage.png",
  //       "./ProfileImage.png",
  //     ], // 참여인원들 프로필 이미지 주소
  //   },
  // ];

  const formattedBudget: string[] = [];
  TourDataArr.map((item, index) => {
    formattedBudget.push(new Intl.NumberFormat().format(item.expense));
  });

  return (
    <div>
      <Header />
      <ProfileContainer>
        <OptionButton
          className="profileButton"
          remove={false}
          editType="editProfile"
        />
        <Profile>
          <img src="/profileImage.png" alt="프로필사진" />
          <span>name</span>
        </Profile>
      </ProfileContainer>
      {TourDataArr.length != 0 ? (
        <TravelListContainer>
          <TravelList>
            {TourDataArr.map((travel, index) => {
              return (
                <TourCardList
                  key={index}
                  travel={travel}
                  formattedBudget={formattedBudget}
                  index={index}
                />
              );
            })}

            <AddTravel onClick={() => navigate("/where1")}>
              <div>+</div>
            </AddTravel>
          </TravelList>
        </TravelListContainer>
      ) : (
        <NoTravelList>
          <svg
            width="172"
            height="268"
            viewBox="0 0 172 268"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M58.1718 178.562C58.1718 147.384 66.6618 130.063 89.6161 112.743C108.168 98.5711 118.23 89.1234 118.23 74.0071C118.23 58.2609 106.91 48.4982 87.1005 48.4982C66.0329 48.4982 54.713 63.2997 54.713 79.3608H0C0 34.0117 35.8464 0 86.7861 0C141.185 0 172 31.1775 172 74.0071C172 97.3114 160.68 115.892 140.241 131.638C117.287 149.589 110.055 160.926 110.055 178.562H58.1718ZM85.8428 268C66.6618 268 52.5119 254.143 52.5119 234.933C52.5119 215.723 66.6618 201.551 85.8428 201.551C105.024 201.551 119.174 215.723 119.174 234.933C119.174 254.143 105.024 268 85.8428 268Z"
              fill="#E8E8E8"
              fill-opacity="0.45"
            />
          </svg>
          <div>
            <p>등록된 여행이 없습니다.</p>
            <span>아직 떠날 준비가 안 되셨나요?</span>
            <span>새로운 여행을 추가해보세요!</span>
            <button onClick={() => navigate("/where1")}>여행 추가</button>
          </div>
        </NoTravelList>
      )}
    </div>
  );
}

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  & .profileButton {
    position: absolute;
    top: 0;
    right: 0;
    margin: 10px;
  }
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  // margin: 20px 0 0 0;

  & img {
    border-radius: 100%;
    width: 150px;
    height: 150px;
  }

  & span {
    text-align: center;
    font-size: 20px;
    margin: 20px;
  }
`;

const TravelListContainer = styled.div`
  width: 100%;
  height: 60vh;
  // background: black;
  overflow: scroll;
`;

const NoTravelList = styled.div`
  display: flex;
  justify-content: center;
  position: relative;

  & svg {
    position: absolute;
    top: 140px;
    z-index: -1;
  }

  & div {
    position: relative;
    z-index: 1;
    background-color: #eaf6ff;
    width: 85vw;
    height: 500px;
    margin: 20px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  & p {
    font-size: 24px;
    font-weight: 700;
    margin: 20px;
  }

  & span {
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    margin: 5px;
  }

  & button {
    background-color: #0077cc;
    color: white;
    width: 110px;
    height: 35px;
    margin: 20px;
    border-radius: 8px;
    border: 0;
    font-size: 16px;
  }
`;

const TravelList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AddTravel = styled.div`
  width: 85vw;
  height: 100px;
  background-color: #dfdfdf;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;

  & div {
    background-color: #6e6e6e66;
    border-radius: 100%;
    width: 28px;
    height: 28px;
    color: white;
    font-size: 25px;
    text-align: center;
    line-height: 30px;
  }
`;
