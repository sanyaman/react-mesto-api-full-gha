import SuccessIcon from "../images/Check.png";
import FailIcon from "../images/Error.png";

function InfoToolTip(props) {
  const icon = props.isSuccess ? SuccessIcon : FailIcon;
  const message = props.isSuccess
    ? "Вы успешно зарегистрировались!"
    : "Что-то пошло не так! Попробуйте ещё раз.";
  const alt = props.isSuccess
    ? "Вы успешно зарегистрировались!"
    : "Не удалось зарегестрироваться.";
  return (
    <div
      className={`popup popup_tooltip  ${props.isOpen ? "popup_opened" : ""}`}
    >
      <div className="popup__container-auth">
        <img className="popup__tooltip-img" src={icon} alt={alt} />
        <p className="popup__tooltip-message">{message}</p>
        <button
          className="popup__close"
          type="button"
          aria-label="Закрыть всплывающее окно"
          onClick={props.onClose}
        ></button>
      </div>
    </div>
  );
}

export default InfoToolTip;
