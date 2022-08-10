import { useState, useEffect } from "react";
import api from "../utils/Api";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import userContext from "../contexts/CurrentUserContext";
import avatarDefault from "../images/сousteau-min.jpg";

function App() {
  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImgPopupOpen, setIsImgPopupOpen] = useState(false);
  const [selectedCard, setselectedCard] = useState({});
  const [currentUser, setcurrentUser] = useState({
    userName: "Жак-Ив Кусто",
    userDescription: "Исследователь океана",
    userAvatar: avatarDefault,
  });

  useEffect(() => {
    api
      .getUserInfo()
      .then((res) => {
        setcurrentUser({
          name: `${res.name}`,
          description: `${res.about}`,
          avatar: `${res.avatar}`,
          id: `${res._id}`,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    api
      .getInitialCards()
      .then((res) => {
        setCards(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function handleCardClick({ name, link }) {
    setselectedCard({ name, link });
    setIsImgPopupOpen(!isImgPopupOpen);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);

    setIsAddPlacePopupOpen(false);

    setIsEditAvatarPopupOpen(false);

    setIsImgPopupOpen(false);

    setselectedCard({});
  }

  function handleUpdateUser(params) {
    api
      .sendProfileInfo(params.name, params.about)
      .then((res) => {
        setcurrentUser({
          name: `${res.name}`,
          description: `${res.about}`,
          avatar: `${res.avatar}`,
          id: `${res._id}`,
        });
				closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
   
  }

  function handleUpdateAvatar(params) {
    api
      .sendProfilePhoto(params.avatar)
      .then((res) => {
        setcurrentUser({
          name: `${res.name}`,
          description: `${res.about}`,
          avatar: `${res.avatar}`,
          id: `${res._id}`,
        });
				closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
   
  }

  function handleDeleteCard(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser.id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(card) {
    api
      .postNewCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
				closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
    
  }

  return (
    <div className="page">
      <div className="content">
        <userContext.Provider value={currentUser}>
          <Header />
          <Main
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            cards={cards}
            onDeleteCard={handleDeleteCard}
            onLikeCard={handleCardLike}
          />
          <Footer />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />

          <PopupWithForm
            name="delete"
            title="Вы уверены?"
            buttonText="Да"
          ></PopupWithForm>

          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            isOpen={isImgPopupOpen}
            onCardClick={handleCardClick}
          />
        </userContext.Provider>
      </div>
    </div>
  );
}

export default App;
