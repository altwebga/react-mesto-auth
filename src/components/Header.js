import headerLogo from "../images/logo-white.svg";
import React from "react";
import { Link, useLocation } from "react-router-dom";

function Header(props) {
  const location = useLocation();
  const linkName = {
    "/": "Выйти",
    "/sign-up": "Войти",
    "/sign-in": "Регистрация",
  };
  function handleLogout() {
    props.onLogout();
  }

  return (
    <header className="header">
      <img className="logo header__logo" src={headerLogo} alt="Логотип" />
      <div className="">
        {location.pathname === "/sign-in" && (
          <Link className="" to="/sign-up">
            {linkName[location.pathname]}
          </Link>
        )}
        {location.pathname === "/sign-up" && (
          <Link className="" to="/sign-in">
            {linkName[location.pathname]}
          </Link>
        )}
        {location.pathname === "/" && (
          <p className=" ">
            {props.userEmail}
          </p>
        )}
        {location.pathname === "/" && (
          <Link
            onClick={handleLogout}
            to=""
            className=" "
          >
            {linkName[location.pathname]}
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
