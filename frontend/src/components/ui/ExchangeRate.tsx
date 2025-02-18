import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 300px;

  & span {
    font-weight: 900;
  }

  #exchange {
    width: 150px;
    margin-bottom: 0;
  }
`;

export default function ExchangeRate({ pound }: { pound: string }) {
  return (
    <Container>
      <div>
        1 <span>{pound}</span>
      </div>
      =
      <input type="number" id="exchange" placeholder="환율을 입력하세요" />
    </Container>
  );
}
