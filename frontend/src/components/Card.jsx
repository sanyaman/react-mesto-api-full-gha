import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { useContext } from "react";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const { _id } = useContext(CurrentUserContext);
  const isOwn = card.owner._id === _id;
  const isLiked = card.likes.some((i) => i._id === _id);
  const cardLikeButtonClassName = `element__like-buttone ${
    isLiked && "element__like-active"
  }`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card, isLiked);
  }

  function handleDeleteClick() {
    onCardDelete(card._id);
  }
  return (
    <li className="element__item-grid">
      <img
        onClick={handleClick}
        className="element__image-grid"
        alt={card.name}
        src={card.link}
      />
      <div className="element__info-grid">
        <h2 className="element__title-grid">{card.name}</h2>
        <label className="element__like-label">
          <button
            onClick={handleLikeClick}
            type="button"
            className={cardLikeButtonClassName}
            aria-label="лайк"
          />
          <span className="element__counter">{card.likes.length}</span>
        </label>
      </div>
      {isOwn && (
        <button
          className="element__delete-buttone"
          onClick={handleDeleteClick}
        />
      )}
    </li>
  );
}

export default Card;
