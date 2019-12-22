import fetch from 'isomorphic-fetch';
import auth from './auth';
import rootDispatcher from './rootDispatcher';

export default {
  _apiUrl: 'http://localhost:3004',

  _getApiUrl() {
    const url = this._apiUrl;
    return url;
  },

  setApiUrl(url) {
    this._apiUrl = url;
  },

  _base(method, endpoint, data, skipAuth = false) {
    const upperMethod = method.toUpperCase();
    const isAuthenticated = auth.isAuthenticated();
    // const tokenHeader = auth.getTokenHeader();
    // const token = auth.getToken() || {};
    const basePromise = Promise.resolve();
    const headers = {
      Accept: 'application/json',
      // withCredentials: true
    };

    let query = '';

    if (typeof data === 'object' && upperMethod === 'GET') {
      query += this._constructQueryString(data);
    } else if (typeof data === 'object') {
      headers['Content-Type'] = 'application/json';
    }

    // if (isAuthenticated && !skipAuth) {
    //   //   headers.Authorization = tokenHeader;
    //   basePromise = auth.checkToken();
    // }

    // if (typeof token.runAsUserId === 'string') {
    //   headers['X-Run-As'] = token.runAsUserId;
    // }

    const url = `${this._getApiUrl()}${endpoint}${query}`;
    let response = null;

    return basePromise
      .then(() =>
        this._fetch(url, {
          method: upperMethod,
          headers,
          credentials: 'include',
          body: method !== 'GET' ? JSON.stringify(data) : null,
        }),
      )
      .then(res => {
        if (res.status === 500) {
          rootDispatcher.dispatch({
            type: 'AUTH:INTERNAL_SERVER_ERROR',
            data: { status },
          });
          throw new Error('Request Failed (500)');
        }

        auth.checkResponseValid(res);
        response = res;

        return res.text();
      })
      .then(textBody => {
        let parsedBody;

        try {
          parsedBody = JSON.parse(textBody);
        } catch (err) {
          parsedBody = textBody;
        }

        return {
          success: response.ok,
          status: response.status,
          body: parsedBody,
        };
      })
      .catch(err => {
        rootDispatcher.dispatch({
          type: 'REQ:REQUEST_FAILED',
          data: err,
        });
        throw new Error(`${upperMethod} ${url} Request Failed`);
      });
  },

  _fetch(url, options, timeout = 5000) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('request timeout'));
      }, timeout);

      fetch(url, options).then(resolve, reject);
    });
  },

  _constructQueryString(data) {
    let query = '';

    for (const name in data) {
      const value = data[name];
      query += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
    }

    return query;
  },

  getURLParameter(name) {
    return (
      decodeURIComponent(
        (new RegExp(`[?|&]${name}=([^&;]+?)(&|#|;|$)`).exec(
          location.search,
        ) || [null, ''])[1].replace(/\+/g, '%20'),
      ) || null
    );
  },

  get(endpoint, query) {
    return this._base('GET', endpoint, query);
  },

  post(endpoint, body, skipAuth = false) {
    return this._base('POST', endpoint, body, skipAuth);
  },

  put(endpoint, body) {
    return this._base('PUT', endpoint, body);
  },

  patch(endpoint, body) {
    return this._base('PATCH', endpoint, body);
  },

  delete(endpoint, body) {
    return this._base('DELETE', endpoint, body);
  },
};
