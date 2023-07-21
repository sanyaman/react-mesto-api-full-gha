import Card from "./Card.jsx";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { useContext } from "react";

function Main({
  cards,
  onEditAvatar,
  onAddPlace,
  onEditProfile,
  onCardClick,
  onCardLike,
  onCardDelete,
}) {
  const { name, about, avatar } = useContext(CurrentUserContext);

  return (
    <main>
      <section className="profile">
        <div className="profile__avatar-pen" onClick={onEditAvatar}>
          <img src={avatar} alt="Акванутый" className="profile__avatar" />
        </div>
        <div className="profile__info">
          <div className="profile__container">
            <h1 className="profile__title">{name}</h1>
            <p className="profile__subtitle">{about}</p>
          </div>
          <button
            onClick={onEditProfile}
            className="profile__button-edit"
            type="button"
            aria-label="Изменить"
            title="Редактировать Профиль"
          />
        </div>
        <button
          onClick={onAddPlace}
          className="profile__button-add"
          type="button"
          aria-label="Добавить"
          title="Добавить новое Фото"
        />
      </section>
      <ul className="element__grid">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        ))}
      </ul>
    </main>
  );
}

export default Main;
