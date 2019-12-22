import store from 'store';
import Cookies from 'js-cookie';

import req from './req';
import rootDispatcher from './rootDispatcher';

const STORE_KEYS = {
  user: 'auth__user',
  token: 'auth__token',
};

const topDomain = (function topDomain() {
  const match = location.hostname.match(/(\.\w+.\.\w+$|localhost)/);
  if (!match) {
    return null;
  }
  return match[0];
}());

const auth = {
  _userEndpoint: '/me',
  _appId: null,

  authenticate(email, password) {
    let postData = null;
    postData = {
      email,
      password,
    };

    return req.post('/login', postData)
      .then((details) => {
        console.log("details", details);
        this.updateUser(details.body);
        return details;
      })
      .catch((err) => {
        this.clear();
        throw new Error(err);
      });
  },

  setAppId(appId) {
    this._appId = appId;
  },

  getAppId() {
    return this._appId;
  },

  getLoginURL(registerPath = null) {
    const domain = (topDomain === 'localhost' ? topDomain : `account${topDomain}`);
    const currentAppUrl = location.href.replace(/\/$/, '');
    let url = `//${domain}?redirect-url=${currentAppUrl}`;
    if (registerPath) {
      const registerUrl = `${currentAppUrl}${registerPath}`;
      url += `&register-url=${registerUrl}`;
    }
    return url;
  },

  isAuthenticated() {
    return this.getUser();
  },

  checkResponseValid({status}) {
    switch (status) {
      case 401:
        rootDispatcher.dispatch('AUTH:UNAUTHORIZED', {status});
        this.logout();
        return false;
      case 403:
        rootDispatcher.dispatch('AUTH:FORBIDDEN', {status});
        return false;
    }

    return true;
  },

  logout() {
    this.clear();
    location.href = "/";
  },

  clear() {
    store.remove('api-url'); // TODO remove this, only temp so no-one has this in their store anymore
    store.remove(STORE_KEYS.user);
    console.log("cookies" ,Cookies.get(STORE_KEYS.user));
  },

  getUser() {
    return store.get(STORE_KEYS.user);
  },

  setUserEndpoint(endpoint) {
    this._userEndpoint = endpoint;
  },

  getUserEndpoint() {
    return this._userEndpoint;
  },

  updateUser(user) {
    store.set(STORE_KEYS.user, user);
  },
};

// for debug purposes
window.clearAuth = () => {
  auth.clear();
};

export default auth;

