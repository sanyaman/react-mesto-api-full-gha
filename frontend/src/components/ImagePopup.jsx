function ImagePopup({ card, onClose }) {
  return (
    <div
      className={`popup popup_full ${card.link ? "popup_opened" : ""}`}
      aria-label="fullImg"
    >
      <div className="popup__container-img">
        <figure className="popup__place-img">
          <button
            onClick={onClose}
            className="popup__close  popup__close-img"
            type="button"
          />
          <img alt={card.name} src={card.link} className="popup__modal-img" />
          <figcaption className="popup__text-img">{card.name}</figcaption>
        </figure>
      </div>
    </div>
  );
}

export default ImagePopup;
