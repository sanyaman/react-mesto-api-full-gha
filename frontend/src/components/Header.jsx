import React from 'react';
import logo from '../images/Vector.svg';
import { Routes, Route, Link } from 'react-router-dom';

function Header(props) {
  return (
    <div>
      <header className="header">
        <img className="header__logo" src={logo} alt="Логотип" />
        <Routes>
          <Route path="/sign-in"
            element = {<Link to="/sign-up" className="header__link">
              Регистрация
            </Link>}
          />
          <Route path="/sign-up"
            element = {<Link to="/sign-in" className="header__link">
              Войти
            </Link>}
          />
          <Route path="/"
            element = {<div className="header__user-info">
              <p className="header__email">{props.email}</p>
              <Link
                to="/sign-in"
                className="header__link"
                onClick={props.onSignOut}>
                Выйти
              </Link>
            </div>}
          />
        </Routes>
      </header>
    </div >
  );
}

export default Header;