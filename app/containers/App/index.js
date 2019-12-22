import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from '../Layout';
import PageNotFound from '../PageNotFound';
import User from '../User';
import Settings from '../Settings';
import Auth from '../Auth';
import auth from '../../utils/auth';
import req from '../../utils/req';

// TODO change this url
req.setApiUrl('http://localhost:8080');
auth.setUserEndpoint('/me');

export default () => (
  <Switch>
    <Route
      render={() => {
        return auth.isAuthenticated() ? (
          <Layout>
            <Switch>
              <Route exact path="/" component={User} />
              <Route path="/settings" component={Settings} />
              <Route path="*" component={PageNotFound} />
            </Switch>
          </Layout>
        ) : (
          <Auth />
        );
      }}
    />
  </Switch>
)