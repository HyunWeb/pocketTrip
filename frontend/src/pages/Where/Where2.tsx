import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Common/Button";
import "./Where2.css";
import { countryNamesInKorean } from "../Data/countryNames";
import styled from "styled-components";

const Buttons = styled(Button)`
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #0056b3;
  }
`;

export default function Where2() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<string[]>([]); // 나라 목록
  const [search, setSearch] = useState<string>(""); // 검색어
  const [selectedCountry, setSelectedCountry] = useState<string>(""); // 선택된 나라
  const [isEditing, setIsEditing] = useState<boolean>(false); // 드롭다운 활성화 여부
  const isButtonDisabled = !selectedCountry;

  // 페이지 이동 함수
  const goToWhere1 = () => {
    navigate("/where1");
  };
  const goToWhere3 = () => {
    navigate("/where3");
  };

  // API 호출로 나라 목록 불러오기
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countryNames = response.data.map((country: any) => {
          const englishName: string = country.name.common;
          return countryNamesInKorean[englishName] || englishName;
        });
        setCountries(countryNames); // 나라 목록 상태 업데이트
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
      }
    };

    fetchCountries();
  }, []);

  // 검색어로 필터링된 나라 목록
  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(search.toLowerCase())
  );

  // 한글 순으로 정렬
  const sortedCountries = filteredCountries.sort((a, b) =>
    a.localeCompare(b, "ko")
  );

  return (
    <div className="where-container2">
      {/* 뒤로가기 화살표 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="left"
        viewBox="0 0 16 16"
        onClick={goToWhere1}
      >
        <path
          fillRule="evenodd"
          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
        />
      </svg>

      <div className="where-title2">
        어느 나라로 <br />
        떠날 계획인가요?
      </div>

      {/* 나라 선택 드롭다운 */}
      <div className="where-option2" onClick={() => setIsEditing(!isEditing)}>
        <div className="country-selector">
          {isEditing ? (
            <input
              type="text"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="나라를 검색하세요"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && filteredCountries.length > 0) {
                  setSelectedCountry(filteredCountries[0]);
                  setSearch(""); // 입력창 비우기
                  setIsEditing(false); // 드롭다운 닫기
                }
              }}
            />
          ) : (
            <span
              style={{
                fontWeight: selectedCountry ? "bold" : "normal",
                color: selectedCountry ? "black" : "#b0b0b0",
              }}
            >
              {selectedCountry || "나라 선택"}
            </span>
          )}
        </div>

        {/* 화살표 아이콘 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
          className="dropdown-arrow"
        >
          <path
            fillRule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
          />
        </svg>
      </div>

      {/* 드롭다운 메뉴 */}
      {isEditing && (
        <div className="dropdown-menu">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country, index) => (
              <div
                key={index}
                className="dropdown-option"
                onClick={() => {
                  setSelectedCountry(country);
                  setSearch("");
                  setIsEditing(false);
                }}
              >
                {country}
              </div>
            ))
          ) : (
            <div className="no-results">검색 결과가 없습니다.</div>
          )}
        </div>
      )}

      {/* 확인 버튼 */}
      <div className="button-container">
        <Buttons
          size="S"
          name="확인"
          $bgColor="blue"
          onClick={goToWhere3}
          disabled={!selectedCountry}
        />
      </div>
    </div>
  );
}
