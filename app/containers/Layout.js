import React from 'react';

import NotiBanner from '../components/NotiBanner';
import NavBar from '../components/NavBar';
export default class App extends React.Component {
  render() {
    return (
      <div className="container">
        <NotiBanner />
        <NavBar />
        {this.props.children}
      </div>
    );
  }
}
