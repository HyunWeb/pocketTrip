# 포켓 트립 (Pocket Trip)
**포켓 트립** 은 공동으로 경비를 관리하는 여행 비용 관리 웹 어플리케이션 입니다. 

<img width="1901" alt="스크린샷 2025-02-24 오후 3 50 50" src="https://github.com/user-attachments/assets/18cc1efe-b846-456c-b5e9-f951e62dd468" />



## 🛠️ 사용한 기술 스택

### 프론트엔드
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> 
### 백엔드
<img src="https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white"> <img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white"> 
### 배포
<img src="https://img.shields.io/badge/amazonec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white"> <img src="https://img.shields.io/badge/pm2-2B037A?style=for-the-badge&logo=pm2&logoColor=white"> <img src="https://img.shields.io/badge/filezilla-BF0000?style=for-the-badge&logo=filezilla&logoColor=white">

### 디자인
<img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white">

---

## 📅 프로젝트 개요
- **기간**: 2025년 01월 16일 ~ 2025년 02월 20일
- **팀 프로젝트** (프론트엔드 2명 + 백엔드 2명)
- **개인 기여도**: **소켓, 암호화** 기능 개발,**JWT** 인증 관리, **UI/UX** 디자인 및 코드 리팩토링

---

## 🔍 프로젝트를 시작하게 된 계기
프로젝트를 시작할 당시 가계부를 활용한 **비용 관리**에 대해 고민했습니다.<br/>
그러나 기존 앱들과 비교 분석한 결과, **은행과의 연동성** 측면에서 경쟁력이 다소 부족하다는 **한계**를 발견했습니다.<br/>
이에 대한 해결책으로, **여행과 결합**한 새로운 접근 방식을 시도했습니다.<br/>
그 결과, 여러 사용자가 **소켓을 통해 실시간으로 공유**할 수 있는 **외화 가계부 애플리케이션**을 제작하게 되었습니다.

---

## 🎯 주요 타겟층 및 기대효과
### 타겟층
**여럿이 함께 해외여행을 떠나는 여행객**<br/>
→ 공동 경비를 효율적으로 관리하고 싶은 사용자<br/>

**외화를 고려하여 체계적인 가계부 작성이 필요한 사람**<br/>
→ 환율을 반영한 지출 관리가 필요한 사용자

### 기대효과
**공동 경비를 투명하고 원활하게 관리**<br/>
→ 실시간으로 정산 및 분배가 가능<br/>

**여행 중 소비 내역을 한눈에 파악 가능**<br/>
→ 개별 및 전체 지출을 직관적으로 확인

---

## 📋 주요 기능
### 1. 여행 기간별 소비금액 관리(개인 담당)
- 초대 코드 발급을 통한 유저 초대 기능
- 소켓을 통한 실시간 소비내역 공유

### 2. 다음 여행까지 남은 기간 확인(개인 담당)
- D-day 로직 구현을 통한 현재 여행 기준 다음 여행기간을 추적

### 3. 환율을 고려한 계산기 기능
- 금융 Open API데이터를 기반으로한 환율정보 기반 계산기
  
### 4. 유저 데이터 기반 인기 여행지 그래프(개인 담당)
- Cart.js를 활용한 1위부터 3위까지의 인기 여행지
---

## 🙋 개인 기여도
### 🎨 프론트엔드 개발 및 UI/UX 설계
- **프론트엔드 개발**  
    - **리덕스를 통한 글로벌 상태관리**
    - **JWT와 로컬 스토리지를 통한 인증 관리**
    - **AES를 통한 대칭키 암호화 코드 관리**
    - **싱글톤 패턴을 활용한 소켓 구현**
- **디자인 설계**: Figma를 활용한 UI 기획 및 디자인 시스템 구축  

---

## 💻 구체적인 구현 기능
### 1. Redux의 활용
- 모든 수정버튼의 상태 전달 1회로 단축, 각각 몇백줄이상의 코드들을 1줄로 축약해서 정리
### 2. JWT & 로컬스토리지 인증 관리
- **로컬스토리지**를 통한 서버 리소스 절약
- **인증 전담 컴포넌트** 제작으로 모든 라우팅 인증 한번에 관리 
### 3. AES 암호화를 통한 초대코드 관리
- 유저 초대를 위한 **초대 코드**를 **AES 암호화**를 통해 활용
- URL에 담아 안전하게 데이터 식별
- 복호화를 통해 본래 기능인 초대 코드 기능 유지
### 4. 싱글톤 패턴을 활용한 소켓
- 한번만 작성하여 모든 컴포넌트에서 소켓을 활용
- 모든 소켓 관련 함수 클래스 함수로 한번에 관리
- 생명 주기 함수를 통해 원하는 시점에 구독 함수 실행
---

## 🧩 해결 과제
### 1. 개발 방법론 변경
- **문제**: 새로운 팀원이 기존 **아토믹 디자인 방법론**을 이해하는 데 추가적인 학습 비용이 발생
- **해결**: 페이지 기반 분류(Page-Based Structure) 선정
- **성과**: 빠른 시간내에 이해 및 적용을 통한 원활한 소통 증진

### 2. 소켓 연결간 CORS 문제 발생
- **문제**: 프론트엔드의 소켓 요청이 403에러로 인해 거부당하는 문제
- **해결**: 백엔드 팀원과의 코드 리뷰 진행을 통해 **JWT 인증 문제**를 확인
- **성과**: JWT 사용법 숙달 및 소켓 코드 정상 작동 확인
- 
---

## 💭 작업 후기 및 피드백
스프링과 리액트의 연동을 통해서 백엔드와 프론트엔드간의 여러 시행착오들(cors문제, 데이터 불일치 문제 등)을 많이 겪을 수 있는 작업이었다. 
SockJS를 통한 소켓 연결 작업을 통해서 소켓 연결 방법을 배우고 숙달할 수 있은 좋은 기회가 되었다. 

### 아쉬운 점
- **컨텐츠의 추가 필요**: 가계부를 제외한 여행관련 컨텐츠를 더욱 추가하지 못한것이 아쉽다. 
- **PWA 기능의 추가**: 해외에서의 사용을 고려해 PWA 기능을 추가적으로 구현하지 못한것이 아쉽다. 

### 앞으로의 계획
백엔드 팀원과의 주기적인 소통을 통해서 PWA 기능 구현 및 최적화를 수행을 진행하고 있습니다. 

---

## 📬 문의
- **개발자:** [황종현](https://github.com/HyunWeb)
- **이메일:** jonghyun1803@naver.com
