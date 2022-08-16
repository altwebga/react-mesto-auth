const MobileMenu = ({ email, signOut, isMobileMenuOpen }) => {
  return (
    <div className={`mobile-menu ${isMobileMenuOpen && "mobile-menu_opened"}`}>
      <h2 className="mobile-menu__user-area">{email}</h2>
      <button
        className="mobile-menu__exit"
        type="button"
        onClick={signOut}
      >
        Выйти
      </button>
    </div>
  );
};

export default MobileMenu;