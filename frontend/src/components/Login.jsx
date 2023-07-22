import React, { useState } from "react";

function Login({ onLogin }) {
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
    onLogin(email, password);
  };

  return (
    <section className="auth">
      <h2 className="auth__title">Вход</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          className="auth__form-input"
          placeholder="Email"
          name="email"
          type="email"
          required
          value={userData.email}
        ></input>
        <input
          onChange={handleChange}
          className="auth__form-input"
          placeholder="Пароль"
          name="password"
          type="password"
          required
          value={userData.password}
        ></input>

        <button className="auth__submit-button" type="submit">
          Войти
        </button>
      </form>
    </section>
  );
}

export default Login;
