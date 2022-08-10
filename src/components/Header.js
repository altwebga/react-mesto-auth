import headerLogo from "../images/logo-white.svg";

function Header() {
  return (
    <header className="header">
      <img className="logo header__logo" src={headerLogo} alt="Логотип" />
    </header>
  );
}

export default Header;
