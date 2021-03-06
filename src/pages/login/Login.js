import React, { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as AuthService from '../../services/auth';
import Button from '../../components/button/Button';
import * as ActionTypes from '../../store/actions';

const Login = (props) => {
  const { onUserLogin } = props;

  const [isAuthLoading, setAuthLoading] = useState(false);
  const [isGoogleAuthLoading, setGoogleAuthLoading] = useState(false);
  const [isFacebookAuthLoading, setFacebookAuthLoading] = useState(false);

  const history = useHistory();

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const login = (event) => {
    setAuthLoading(true);
    AuthService.loginByAuth(
      emailInputRef.current.value,
      passwordInputRef.current.value
    )
      .then((token) => {
        toast.success('Login is succeed!');
        setAuthLoading(false);
        onUserLogin(token);
        history.push('/');
      })
      .catch((error) => {
        setAuthLoading(false);
        toast.error(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            'Failed'
        );
      });

    event.preventDefault();
  };

  const loginByGoogle = () => {
    setGoogleAuthLoading(true);
    AuthService.loginByGoogle()
      .then((token) => {
        toast.success('Login is succeeded!');
        setGoogleAuthLoading(false);
        onUserLogin(token);
        history.push('/');
      })
      .catch((error) => {
        setGoogleAuthLoading(false);
        toast.error(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            'Failed'
        );
      });
  };

  const loginByFacebook = () => {
    setFacebookAuthLoading(true);

    AuthService.loginByFacebook()
      .then((token) => {
        toast.success('Login is succeeded!');
        setFacebookAuthLoading(false);
        onUserLogin(token);

        history.push('/');
      })
      .catch((error) => {
        setFacebookAuthLoading(false);
        toast.error(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            'Failed'
        );
      });
  };

  document.getElementById('root').classList = 'hold-transition login-page';

  return (
    <div className="login-box">
      <div className="login-logo">
        <Link to="/">
          <b>Admin</b>
          <span>LTE</span>
        </Link>
      </div>
      <div className="card">
        <div className="card-body login-card-body">
          <p className="login-box-msg">Sign in to start your session</p>
          <form onSubmit={login}>
            <div className="input-group mb-3">
              <input
                type="email"
                ref={emailInputRef}
                className="form-control"
                placeholder="Email"
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-envelope" />
                </div>
              </div>
            </div>
            <div className="input-group mb-3">
              <input
                type="password"
                ref={passwordInputRef}
                className="form-control"
                placeholder="Password"
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-lock" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-7">
                <div className="icheck-primary">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember Me</label>
                </div>
              </div>
              <div className="col-5">
                <Button
                  block
                  type="submit"
                  isLoading={isAuthLoading}
                  disabled={isFacebookAuthLoading || isGoogleAuthLoading}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </form>
          <div className="social-auth-links text-center mb-3">
            <p>- OR -</p>
            <Button
              block
              icon="facebook"
              onClick={loginByFacebook}
              isLoading={isFacebookAuthLoading}
              disabled={isAuthLoading || isGoogleAuthLoading}
            >
              Sign in using Facebook
            </Button>
            <Button
              block
              icon="google"
              color="danger"
              onClick={loginByGoogle}
              isLoading={isGoogleAuthLoading}
              disabled={isAuthLoading || isFacebookAuthLoading}
            >
              Sign in using Google
            </Button>
          </div>
          <p className="mb-1">
            <Link to="/forgot-password">I forgot my password</Link>
          </p>
          <p className="mb-0">
            <Link to="/register" className="text-center">
              Register a new membership
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  onUserLogin: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
  onUserLogin: (token) => dispatch({ type: ActionTypes.LOGIN_USER, token })
});

export default connect(null, mapDispatchToProps)(Login);
