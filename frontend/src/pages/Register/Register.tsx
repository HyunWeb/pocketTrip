import React, { useState } from "react";
import "./Register.css";
import Button from "../../components/Common/Button";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    emailAddr: "",
    password: "",
    passwordConfirm: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({
    emailAddrError: "",
    passwordConfirmError: "",
    phoneNumberError: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validation and API submission logic here
    console.log("Form 전송", formData);
  };

  return (
    <div className="Register-page" style={{ backgroundColor: "#ffffff" }}>
      <div className="logoSz">
        <a href="/login">
          <img
            style={{ width: "100%", height: "100%" }}
            src="/airplane.png"
            alt="로고위치"
          />
        </a>
      </div>

      <form
        action="/login/register"
        method="POST"
        id="registerForm"
        onSubmit={handleSubmit}
      >
        <div className="inD">
          <label className="formLabel">이름</label>
          <input
            type="text"
            className="username"
            name="username"
            required
            placeholder="이름을 입력해 주세요"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="inD">
          <label className="formLabel">아이디</label>
          <input
            type="text"
            className="emailAddr"
            name="emailAddr"
            required
            placeholder="이메일을 입력해 주세요"
            value={formData.emailAddr}
            onChange={handleChange}
          />
          {errors.emailAddrError && (
            <span id="emailAddrError" className="error-text">
              {errors.emailAddrError}
            </span>
          )}
        </div>

        <div className="inD">
          <label className="formLabel">비밀번호</label>
          <input
            type="password"
            className="password"
            name="password"
            required
            placeholder="비밀번호를 입력해 주세요"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="inD">
          <label className="formLabel">비밀번호확인</label>
          <input
            type="password"
            className="password_confirm"
            name="passwordConfirm"
            required
            placeholder="비밀번호를 한번 더 입력해 주세요"
            value={formData.passwordConfirm}
            onChange={handleChange}
          />
          {errors.passwordConfirmError && (
            <span id="password_confirmError" className="error-text">
              {errors.passwordConfirmError}
            </span>
          )}
        </div>

        <div className="inD">
          <label className="formLabel">전화번호</label>
          <input
            type="number"
            className="phoneNumber"
            name="phoneNumber"
            required
            placeholder="전화번호를 입력해 주세요"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumberError && (
            <span id="phoneNumberError" className="error-text">
              {errors.phoneNumberError}
            </span>
          )}
        </div>

        <div className="inD">
          <Button size="L" name="회원가입" $bgColor="blue" />
        </div>
      </form>

      <div id="successModal">
        <div className="modal">
          <h2>회원가입 완료!</h2>
          <p>회원가입이 성공적으로 완료되었습니다.</p>
          <div className="modalBtBox">
            <button className="modalOffBt">
              <a href="/login">완료</a>
            </button>
          </div>
        </div>
      </div>

      <div className="isUser">
        <p style={{ fontSize: "11px" }}>이미 계정이 있으신가요?</p>
        <a className="lostEp" href="/login">
          로그인
        </a>
      </div>
    </div>
  );
};

export default Register;
