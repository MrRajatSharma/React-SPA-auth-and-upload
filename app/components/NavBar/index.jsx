import React from 'react';
import { Link } from 'react-router-dom';
import './nav-bar.scss';
import auth from '../../utils/auth';
import req from '../../utils/req';
import SimpleModal from '../SimpleModal';
import rootDispatcher from '../../utils/rootDispatcher';

export default class NavBar extends React.Component {
  constructor() {
    super();

    const user = auth.getUser();
    console.log("user", user);
    let admin = [];
    if (user && user.profile.role === 'admin') {
      admin = [
        {
          title: 'Manage',
          link: '/manage',
          icon: 'ios-body',
        },
      ];
    }

    const links = [
      {
        title: 'Home',
        link: '/',
        icon: 'ios-contact',
      },
      ...admin,
      {
        title: 'Settings',
        link: '/settings',
        icon: 'ios-settings',
      },
    ];

    // get user and check its role and check if it is logged in
    // if logged in then show logout message
    // if logged out then show login
    if (user) {
      this.loginLogout = {
        title: 'Log out',
        icon: 'md-log-out',
        onClick: this.toggleLogoutModal,
      };
    } else {
      // for case when cookie is present and user is not and vice versa
      auth.clear();

      // provide login
      this.loginLogout = {
        title: 'Log in',
        icon: 'md-log-in',
        onClick: this.logIn,
      };
    }

    this.state = {
      links,
      showLogoutModal: false,
    };
  }

  toggleLogoutModal = () => {
    this.setState((prevState, prevProps) => {
      return {
        showLogoutModal: !prevState.showLogoutModal,
      };
    });
  };

  logIn = () => {
    rootDispatcher.dispatch('LOGIN');
  };

  logOut = () => {
    // logout user
    req.get('/logout').then(({ success, body }) => {
      console.log(success, body);
      auth.logout();
      rootDispatcher.dispatch('NB:OPEN', {
        type: success ? 'success' : 'error',
        msg: success ? 'Logged out successfully' : body.message,
      });
    });
  };

  render() {
    return ([
      <nav className="navbar p-3">
        <h4 className="navbar__title h--no-spacing">I/O Demo</h4>
        <div className="navbar__links">
          {this.state.links.map(({ title, link, icon }, idx) => (
            <Link to={link} className="navbar__links__link" key={idx}>
              <span className={`navbar__links__link__icon ion-${icon}`} />
              <span className="navbar__links__link__title">{title}</span>
            </Link>
          ))}
          <a className="navbar__links__link" onClick={this.loginLogout.onClick}>
            <span
              className={`navbar__links__link__icon ion-${
                this.loginLogout.icon
              }`}
            />
            <span className="navbar__links__link__title">
              {this.loginLogout.title}
            </span>
          </a>
        </div>
      </nav>,

      <SimpleModal
        title='Logout'
        subTitle='Are you sure you want to logout?'
        onClose={this.toggleLogoutModal}
        open={this.state.showLogoutModal}
        >
        <button
          className="btn pull-right"
          onClick={this.logOut}
        >
          Logout
        </button>

        <button
          className="btn btn--outlined pull-right mr-2"
          onClick={this.toggleLogoutModal}
        >
          Cancel
        </button>
      </SimpleModal>
    ]);
  }
}
