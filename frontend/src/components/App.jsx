import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { api } from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import ProtectedRoute from "./ProtectedRoute";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import AddPlacePopup from "./AddPlacePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import DeleteCardPopup from "./DeleteCardPopup";
import ImagePopup from "./ImagePopup";
import Register from "./Register";
import Login from "./Login";
import InfoToolTip from "./InfoTooltip";
import { authorize, register, logout } from "../utils/auth";

function App() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [isConfirmeDelete, setIsConfirmeDelete] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isSelectedCard, setIsSelectedCard] = useState({});
  const [isInfoToolTipPopupOpen, setIsInfoToolTipPopupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCurrentUser, setCurrentUser] = useState({
    name: "Жак",
    about: "Доширак",
  });

  useEffect(
    () => {
      if (localStorage.getItem('login')) {
        loadPage();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  function loadPage() {
    Promise.all([api.getUserData(), api.getInitialCards()])
      .then(([{ name, about, avatar, _id, email }, cards]) => {
        setEmail(email);
        setCurrentUser({ name, about, avatar, _id });
        setCards(cards.reverse());
        setIsLoggedIn(true);
        navigate("/", { replace: true });
      })
      .catch((err) => console.log("Ошибка:", err));
  }

  function handleEditAvatarClick() {
    setIsAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddProfilePopupOpen(true);
  }
  function handleCardClick(card) {
    setIsSelectedCard(card);
  }

  function handleCardLike(card, isLiked) {
    api
      .toggleLike(isLiked, card._id)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === newCard._id ? newCard : c))
        );
      })
      .catch((err) => console.log("Ошибка:", err));
  }
  function confirmDelete() {
    setIsLoading(true);
    api
      .removeCard(isConfirmeDelete)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== isConfirmeDelete));
      })
      .catch((err) => console.log("Ошибка:", err))
      .finally(() => {
        setIsLoading(false);
        setIsDeletePopupOpen(false);
      });
  }

  function handleCardDelete(id) {
    setIsDeletePopupOpen(true);
    setIsConfirmeDelete(id);
  }

  function handleUpdateUser(user) {
    setIsLoading(true);
    api
      .setUserData(user)
      .then(({ name, about, avatar, _id }) => {
        setCurrentUser({ name, about, avatar, _id });
        setIsEditProfilePopupOpen(false);
      })
      .catch((err) => console.log("Ошибка:", err))
      .finally(() => setIsLoading(false));
  }

  function handleUpdateAvatar(link) {
    setIsLoading(true);
    api
      .setUserAvatar(link)
      .then((newUser) => {
        setCurrentUser(newUser);
        setIsAvatarPopupOpen(false);
      })
      .catch((err) => console.log("Ошибка:", err))
      .finally(() => setIsLoading(false));
  }

  function handleAddPlaceSubmit(card) {
    setIsLoading(true);
    api
      .uploadCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        setIsAddProfilePopupOpen(false);
      })
      .catch((err) => console.log("Ошибка:", err))
      .finally(() => setIsLoading(false));
  }

  function handleRegisterSubmit(data) {
    register(data.password, data.email)
      .then((newUser) => {
        if (newUser.email) {
          setIsInfoToolTipPopupOpen(true);
          setIsSuccess(true);
          navigate("/sign-in");
        } else if (newUser.message) {
          setIsInfoToolTipPopupOpen(true);
          setIsSuccess(false);
        }
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("400 - Некорректено заполнено одно из полей");
        }
        setIsInfoToolTipPopupOpen(true);
        setIsSuccess(false);
      });
  }

  function handleLoginSubmit(data) {
    authorize(data.email, data.password)
      .then((data) => {
        if (data.email) {
	localStorage.setItem('login', true);
          loadPage();
        } else {
          setIsInfoToolTipPopupOpen(true);
          setIsSuccess(false);
        }
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("400 - Не передано одно из полей");
        } else if (err.status === 401) {
          console.log("401 - Пользователь с Email не найден");
        }
        setIsInfoToolTipPopupOpen(true);
        setIsSuccess(false);
      });
  }

  function handleSignOut() {
    logout()
      .then((res) => {
        if (res.exit) {
          setIsLoggedIn(false);
          setCurrentUser({
            name: "",
            about: "",
          });
          navigate("/sign-in");
	localStorage.removeItem('login')
          document.cookie = "jwtChek=; expires=Mon, 25 Oct 1917 00:00:01 GMT;";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function closeAllPopups() {
    setIsAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddProfilePopupOpen(false);
    setIsDeletePopupOpen(false);
    setIsInfoToolTipPopupOpen(false);
    setIsSelectedCard({});
  }

  return (
    <CurrentUserContext.Provider value={isCurrentUser}>
      <Header email={email} onSignOut={handleSignOut} isLoggedIn={isLoggedIn} />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}
              loggedIn={isLoggedIn}
              element={Main}
            />
          }
        />
        <Route
          path="/sign-in"
          element={<Login onLogin={handleLoginSubmit} />}
        />
        <Route
          path="/sign-up"
          element={<Register onRegister={handleRegisterSubmit} />}
        />
      </Routes>

      {isLoggedIn && <Footer />}

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        isLoading={isLoading}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
      />

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        isLoading={isLoading}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        isLoading={isLoading}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />

      <DeleteCardPopup
        isOpen={isDeletePopupOpen}
        isLoading={isLoading}
        onClose={closeAllPopups}
        onDeleteCard={confirmDelete}
      />

      <ImagePopup card={isSelectedCard} onClose={closeAllPopups} />

      <InfoToolTip
        isOpen={isInfoToolTipPopupOpen}
        onClose={closeAllPopups}
        isSuccess={isSuccess}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
