import close from "../images/icon-close.svg";
import PopupWithForm from './PopupWithForm';

const PopupConfirm = ({ isOpen, onClose, container }) => {
  return (
    <PopupWithForm
      buttonText="Сохранить"
      onSubmit={() => console.log("onSubmit")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form id="form_remove" className={container}>
        <h2 className="popup__title">Вы Уверены?</h2>
        <button type="submit" className="popup__button">
          Да
        </button>
      </form>
      <button
        src={close}
        alt="Закрыть"
        type="button"
        id="close_remove"
        className="popup__closed"
        onClick={onClose}
      ></button>
    </PopupWithForm>
  );
};

export default PopupConfirm;
