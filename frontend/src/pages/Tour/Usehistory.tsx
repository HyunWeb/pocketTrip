import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MoneyLog from "./MoneyLog";
interface MoneyLogProps {
  LogState: "plus" | "minus";
  title: string;
  detail: string;
  profile: string;
  type: "카드" | "현금";
  money: string;
}

interface logsProps {
  logs: MoneyLogProps[];
}

const ButtonsWrap = styled.div`
  display: flex;
  justify-content: space-around;
  max-width: 700px;
  margin: 30px auto;
`;
const Buttons = styled.button<{ $selected: boolean }>`
  width: 110px;
  background-color: ${(props) => (props.$selected ? "#051e31" : "transparent")};
  color: ${(props) => (props.$selected ? "white" : "#051e31")};
  border: 2px solid #051e31;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
  font-family: inherit;
  padding: 5px;
`;
const ListWrap = styled.div`
  overflow: scroll;
`;
const LogList = styled.ul`
  .LogItem:last-child {
    padding-bottom: 70px;
  }
`;

export default function Usehistory({ logs }: logsProps) {
  const [filteringLogs, setFilteringLogs] = useState<MoneyLogProps[]>([]); // 탭 전환에 따른 목록
  const [tabState, setTabState] = useState("종합"); // 현재 선택된 탭

  // 탭에 따라서 보이는 목록 필터링
  useEffect(() => {
    if (tabState === "종합") {
      const data = logs.filter(
        (log) => log.type === "카드" || log.type === "현금"
      );
      setFilteringLogs(data);
    } else if (tabState === "카드") {
      const data = logs.filter((log) => log.type === "카드");
      setFilteringLogs(data);
    } else {
      const data = logs.filter((log) => log.type === "현금");
      setFilteringLogs(data);
    }
  }, [tabState, logs]);

  return (
    <div>
      <ButtonsWrap>
        {["종합", "카드", "현금"].map((tab, index) => (
          <Buttons
            key={index}
            $selected={tabState === tab}
            onClick={() => setTabState(tab)}
          >
            {tab}
          </Buttons>
        ))}
      </ButtonsWrap>
      <ListWrap>
        <LogList>
          {filteringLogs.map((log, index) => (
            <MoneyLog
              className="LogItem"
              key={index}
              LogState={log.LogState}
              title={log.title}
              detail={log.detail}
              profile={log.profile}
              type={log.type}
              money={log.money}
            />
          ))}
        </LogList>
      </ListWrap>
    </div>
  );
}
