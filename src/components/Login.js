import React from 'react';
import { withRouter } from 'react-router-dom';
import * as auth from '../utils/auth';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.email || !this.state.password) {
      return;
    }
    auth
      .authorize(this.state.email, this.state.password)
      .then((data) => {
        if (data === undefined) {
          this.props.setIsLoginDone(false);
          this.props.onOpen();
        }
        if (data.token) {
          this.props.setUserEmail(this.state.email);
          this.setState({ email: '', password: '' }, () => {
            this.props.handleLogin();
            this.props.history.push('/');
          });
        }
      })
      .catch((err) => console.log(err));
  }
  render() {
    return (
      <div className="login">
        <p className="login__welcome">Вход</p>
        <form onSubmit={this.handleSubmit} className="login__form">
          <input
            required
            name="email"
            type="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleChange}
            className="login__form-input"
          />
          <input
            required
            name="password"
            type="password"
            placeholder="Пароль"
            value={this.state.password}
            onChange={this.handleChange}
            className="login__form-input"
          />
          <div className="login__button-container">
            <button type="submit" onSubmit={this.handleSubmit} className="login__link">
              Войти
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(Login);
