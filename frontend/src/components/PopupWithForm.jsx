function PopupWithForm({
  name,
  title,
  isOpen,
  onClose,
  onSubmit,
  children,
  isLoadingCaption,
  submitcaption,
  isLoading,
}) {
  return (
    <div className={`popup popup_${name} ${isOpen} `} aria-label={name}>
      <div className={`popup__container popup__container-${name} ${isOpen}`}>
        <button onClick={onClose} className="popup__close" type="button" />
        <form
          onSubmit={onSubmit}
          className={`popup__form popup__form-${name}`}
          name={`popupForm${name}`}
        >
          <h2 className="popup__profile-name">{title}</h2>
          {children}
          <button
            className={`popup__sumbit popup__sumbit-${name}`}
            aria-label="Отправить"
            type="submit"
          >
            {isLoading ? isLoadingCaption : submitcaption}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;


