import React from "react";
import { Link, withRouter } from "react-router-dom";
import headerLogo from "../images/logo-white.svg";

function Header({ loggedIn, email, signOut }) {
  const redirectButton = () => {
    if (window.location.pathname === "/sign-in") {
      return (
        <Link to="/sign-up" className="header__link">
          Зарегистрироваться
        </Link>
      );
    } else {
      return (
        <Link to="/sign-in" className="header__link">
          Войти
        </Link>
      );
    }
  };

  const link = () => {
    if (loggedIn) {
      return (
        <>
          <p className="header__email">{email}</p>
          <button
            to="/sign-in"
            className="header__link header__link_logged-in"
            onClick={signOut}
          >
            Выйти
          </button>
        </>
      );
    } else {
      return redirectButton();
    }
  };

  return (
    <header className="header">
      <img className="logo header__logo" src={headerLogo} alt="Логотип" />
      <div className="header__user-area">{link()}</div>
    </header>
  );
}

export default withRouter(Header);
