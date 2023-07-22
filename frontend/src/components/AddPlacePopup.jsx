import PopupWithForm from "./PopupWithForm";
import { useEffect, useState } from "react";

function AddPlacePopup({ isOpen, isLoading, onClose, onAddPlace }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    setName("");
    setLink("");
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name,
      link,
    });
  }

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeLink(e) {
    setLink(e.target.value);
  }

  return (
    <PopupWithForm
      name="add"
      title="Новое место"
      isOpen={isOpen ? "popup_opened" : ""}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isLoadingCaption="Добавление..."
      submitcaption="Добавить"
    >
      <figcaption>
        <fieldset className="popup__field popup__field-add">
          <input
            onChange={handleChangeName}
            value={name}
            type="text"
            name="name"
            id="input-placename"
            placeholder="Подпись к картинке"
            className="popup__fill popup__fill_value_title"
            required
            minLength="2"
            maxLength="30"
          />
          <span className="popup__fill-error" id="input-placename-error" />
          <input
            onChange={handleChangeLink}
            value={link}
            type="url"
            name="link"
            id="input-placelink"
            placeholder="Ссылка на картинку"
            className="popup__fill popup__fill_value_image"
            required
          />
          <span className="popup__fill-error" id="input-placelink-error" />
        </fieldset>
      </figcaption>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
