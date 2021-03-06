import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import axios from '../../utils/axios';
import Header from './header/Header';
import Footer from './footer/Footer';
import MenuSidebar from './menu-sidebar/MenuSidebar';
import Dashboard from '../../views/Dashboard';
import PageLoading from '../../components/page-loading/PageLoading';
import * as ActionTypes from '../../store/actions';

const Main = (props) => {
  const { onUserLoad } = props;
  const [appLoadingState, updateAppLoading] = useState(false);

  const [menusidebarState, updateMenusidebarState] = useState({
    isMenuSidebarCollapsed: false
  });

  const toggleMenuSidebar = () => {
    updateMenusidebarState({
      isMenuSidebarCollapsed: !menusidebarState.isMenuSidebarCollapsed
    });
  };

  useEffect(() => {
    updateAppLoading(true);
    axios
      .get('/v1/users/profile')
      .then((response) => {
        updateAppLoading(false);
        onUserLoad({ ...response.data });
      })
      .catch(() => {
        updateAppLoading(false);
      });

    return () => {};
  }, [onUserLoad]);

  document.getElementById('root').classList.remove('register-page');
  document.getElementById('root').classList.remove('login-page');
  document.getElementById('root').classList.remove('hold-transition');

  document.getElementById('root').className += ' sidebar-mini';

  if (menusidebarState.isMenuSidebarCollapsed) {
    document.getElementById('root').classList.add('sidebar-collapse');
    document.getElementById('root').classList.remove('sidebar-open');
  } else {
    document.getElementById('root').classList.add('sidebar-open');
    document.getElementById('root').classList.remove('sidebar-collapse');
  }

  let template;

  if (appLoadingState) {
    template = <PageLoading />;
  } else {
    template = (
      <>
        <Header toggleMenuSidebar={toggleMenuSidebar} />

        <MenuSidebar />

        <div className="content-wrapper">
          <div className="pt-3" />
          <section className="content">
            <Switch>
              <Route exact path="/" component={Dashboard} />
            </Switch>
          </section>
        </div>
        <Footer />
        <div
          id="sidebar-overlay"
          role="presentation"
          onClick={toggleMenuSidebar}
          onKeyDown={() => {}}
        />
      </>
    );
  }

  return <div className="wrapper">{template}</div>;
};

Main.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    picture: PropTypes.string
  }).isRequired,
  onUserLoad: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  user: state.auth.currentUser
});

const mapDispatchToProps = (dispatch) => ({
  onUserLoad: (user) =>
    dispatch({ type: ActionTypes.LOAD_USER, currentUser: user })
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
