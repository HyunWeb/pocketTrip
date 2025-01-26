import React from "react";
import Button from "../../components/Common/Button";
import styled from "styled-components";

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

export default function MoneyInfo() {
  return (
    <MoneyInfoWrap>
      <h2>현재예산</h2>
      <strong>2,000,000</strong>
      {/* <span>₩</span> */}
      <Button size="M" name="가계부 작성" />
    </MoneyInfoWrap>
  );
}
