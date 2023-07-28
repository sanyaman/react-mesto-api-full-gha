import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { api } from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
//import * as auth from "../utils/auth";
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
import { authorize, register, checkToken, logout } from "../utils/auth";

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

  /* useEffect(() => {
    if (isLoggedIn) {
      Promise.all([api.getUserData(), api.getInitialCards()])
        .then(([user, cards]) => {
          setCurrentUser(user);
          setCards(cards);
        })
        .catch((err) => console.log("Ошибка:", err));
    }
  }, [isLoggedIn]);



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          setIsLoggedIn(true);
          setEmail(res.data.email);
          navigate("/");
        })
        .catch((err) => {
          if (err.status === 400) {
            console.log("400 — Токен не передан");
          } else if (err.status === 401) {
            console.log("401 — Переданный токен некорректен");
          }
        });
    }
  }, [navigate]);
*/

  function handleCheckToken() {
    checkToken()
      .then((res) => {
        if (res._id) {
          setEmail(res.email);
          Promise.all([api.getUserData(), api.getInitialCards()])
            .then(([{ name, about, avatar, _id }, cards]) => {
              //then(([user, cards])
              setCurrentUser({ name, about, avatar, _id }); //setCurrentUser(user);
              setCards(cards);
              setIsLoggedIn(true);
              navigate("/", { replace: true });
            })
            .catch((err) => console.log("Ошибка:", err));
        }
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("400 — Токен не передан");
        } else if (err.status === 401) {
          console.log("401 — Переданный токен некорректен");
        }
      });
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
        setCards(
          (state) => state.map((c) => (c._id === newCard._id ? newCard : c)) // c.id === card._id
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
    register(data.email, data.password)
      .then(() => {
        setIsInfoToolTipPopupOpen(true);
        setIsSuccess(true);
        navigate("/sign-in");
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
      if (data) {
        handleCheckToken();
        setIsLoggedIn(true);
        //setEmail(email);
        navigate("/");
      } else {
        setIsInfoToolTipPopupOpen(false)
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

  // function handleSignOut() {
  //   logout()
  //     .then((answ) => {
  //       if (answ) {
  //         setIsLoggedIn(false);
  //         navigate("/sign-in");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }
  function handleSignOut() {
    logout()
      .then((answ) => {
        if (answ.bye) {
          sessionStorage.removeItem('loggedin');
          setIsLoggedIn(false);
          setCurrentUser({});
          navigate("/sign-in")
        }
      })
      .catch(err => { console.log(err) })
  }

  function closeAllPopups() {
    setIsAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddProfilePopupOpen(false);
    setIsDeletePopupOpen(false);
    setIsInfoToolTipPopupOpen(false);
    setIsSelectedCard({});
  }

  useEffect(() => {
    /*  handleCheckToken() */
  }, [navigate]);

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
