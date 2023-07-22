import PopupWithForm from "./PopupWithForm";
import { useRef, useEffect } from "react";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, isLoading }) {
  const linkRef = useRef();

  useEffect(() => {
    linkRef.current.value = "";
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      link: linkRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name="avatar"
      title="Обновить аватар"
      isOpen={isOpen ? "popup_opened" : ""}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isLoadingCaption="Загрузка Аватара..."
      submitcaption="Добавить"
    >
      <figcaption>
        <fieldset className="popup__field popup__field-profile">
          <input
            ref={linkRef}
            type="url"
            name="link"
            id="input-avatarlink"
            placeholder="Ссылка на Картинку"
            required
            className="popup__fill popup__fill_value_profile"
          />
          <span
            className="popup__fill-error"
            id="input-avatarlink-error"
          ></span>
        </fieldset>
      </figcaption>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
