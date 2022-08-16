import { useState, useEffect } from 'react';
import { Route, Switch, Redirect, withRouter, useHistory } from 'react-router-dom';
import api from '../utils/Api';
import * as auth from '../utils/auth';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import userContext from '../contexts/CurrentUserContext';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import Login from './Login';
import InfoTooltip from './InfoTooltip';

function App() {
  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImgPopupOpen, setIsImgPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState();
  const [selectedCard, setSelectedCard] = useState({});
  const [userEmail, setUserEmail] = useState('');
  const [currentUser, setCurrentUser] = useState({
    userName: 'Жак Фреско',
    userDescription: 'Ладно',
    userAvatar: 'https://i.pinimg.com/originals/25/88/a5/2588a573f8801981e4c0a902a980284b.jpg',
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();

  useEffect(() => {
    api
      .getUserInfo()
      .then((res) => {
        setCurrentUser({
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
    setSelectedCard({ name, link });
    setIsImgPopupOpen(!isImgPopupOpen);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);

    setIsAddPlacePopupOpen(false);

    setIsEditAvatarPopupOpen(false);

    setIsImgPopupOpen(false);

    setIsInfoTooltipOpen(false);

    setSelectedCard({});
  }

  function handleUpdateUser(params) {
    api
      .sendProfileInfo(params.name, params.about)
      .then((res) => {
        setCurrentUser({
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
        setCurrentUser({
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
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddcardubmit(card) {
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

  function handleTokenCheck() {
    if (localStorage.getItem('jwt')) {
      const jwt = localStorage.getItem('jwt');
      auth
        .checkToken(jwt)
        .then((res) => {
          if (res) {
            setUserEmail(res.data.email);
            setLoggedIn(true);
            history.push('/');
          }
        })
        .catch((err) => console.log(err));
    }
  }

  useEffect(() => {
    handleTokenCheck();
    // eslint-disable-next-line
  }, []);

  function handleLogin() {
    setLoggedIn(true);
  }

  function signOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    history.push('/sign-in');
  }

  function openInfoTooltip() {
    setIsInfoTooltipOpen(true);
  }

  return (
    <div className="page">
			<div className="content">
      <userContext.Provider value={currentUser}>
        <Header loggedIn={loggedIn} email={userEmail} signOut={signOut} />
        <Switch>
          <ProtectedRoute exact path="/" loggedIn={loggedIn} component={Footer}>
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
            <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddcardubmit} />
            <PopupWithForm name="delete" title="Вы уверены?" buttonText="Да"></PopupWithForm>
            <ImagePopup
              card={selectedCard}
              onClose={closeAllPopups}
              isOpen={isImgPopupOpen}
              onCardClick={handleCardClick}
            />
          </ProtectedRoute>
          <Route exact path="/sign-up">
            <Register setIsRegisterSuccess={setIsSuccess} onOpen={openInfoTooltip} />
          </Route>
          <Route exact path="/sign-in">
            <Login
              handleLogin={handleLogin}
              onOpen={openInfoTooltip}
              setIsLoginDone={setIsSuccess}
              setUserEmail={(email) => setUserEmail(email)}
            />
          </Route>
          <Route exact path="/">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>
        <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} isSuccess={isSuccess} />
      </userContext.Provider>
    </div>
		</div>
  );
}

export default withRouter(App);
