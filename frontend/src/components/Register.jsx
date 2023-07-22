import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register({ onRegister }) {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = userData;
    onRegister(email, password);
  };

  return (
    <section className="auth">
      <h2 className="auth__title">Регистрация</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          className="auth__form-input"
          placeholder="Email"
          name="email"
          type="email"
          required
          minLength="5"
          maxLength="40"
          onChange={handleChange}
          value={userData.email}
        ></input>
        <input
          className="auth__form-input"
          placeholder="Пароль"
          minLength="6"
          maxLength="20"
          name="password"
          type="password"
          autoComplete="on"
          required
          onChange={handleChange}
          value={userData.password}
        ></input>
        <button
          className="auth__submit-button auth__submit-button_margin"
          type="submit"
        >
          Зарегистрироваться
        </button>
        <div className="auth__path">
          <p className="auth__path-text">Уже зарегистрированы?</p>
          <Link to="/sign-in" className="auth__path-link">
            Войти
          </Link>
        </div>
      </form>
    </section>
  );
}

export default Register;
