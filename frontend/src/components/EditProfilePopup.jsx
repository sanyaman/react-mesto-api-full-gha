import PopupWithForm from "./PopupWithForm";
import { useState, useContext, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) {
  const [name, setName] = useState("Name");
  const [description, setDescription] = useState("About");
  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);
  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      name="edit"
      title="Редактировать профиль"
      isOpen={isOpen ? "popup_opened" : ""}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitcaption="Сохранить"
      isLoadingCaption="Сохранение..."
    >
      <figcaption>
        <fieldset className="popup__field popup__field-edit">
          <input
            onChange={handleChangeName}
            type="text"
            name="name"
            id="input-username"
            placeholder="Имя профиля"
            className="popup__fill popup__fill_value_name"
            required
            minLength="2"
            maxLength="40"
            value={name}
          />
          <span className="popup__fill-error" id="input-username-error" />
          <input
            onChange={handleChangeDescription}
            type="text"
            name="about"
            id="input-useractivity"
            placeholder="Информация профиля"
            className="popup__fill popup__fill_value_description"
            required
            minLength="2"
            maxLength="200"
            value={description}
          />
          <span className="popup__fill-error" id="input-useractivity-error" />
        </fieldset>
      </figcaption>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
