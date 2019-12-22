import React from 'react';
import rootDispatcher from '../../utils/rootDispatcher';
import PropTypes from 'prop-types';

import './noti-banner.scss';

export default class NotiBanner extends React.Component {
  constructor(props) {
    super();

    this.state = {
      open: Boolean(props.open),
      type: props.type || '',
      msg: props.msg || '',
    };

    this.closeTimeout = null;
  }

  componentWillMount() {
    rootDispatcher.on('NB:OPEN', this.open);
    rootDispatcher.on('NB:CLOSE', this.close);
  }

  componentWillUnmount() {
    rootDispatcher.off('NB:OPEN', this.open);
    rootDispatcher.off('NB:CLOSE', this.close);
  }

  open = ({ type, msg, timeout = 5000 }) => {
    const open = () => {
      this.setState({ open: true, type, msg });
      clearTimeout(this.closeTimeout);
      this.closeTimeout = setTimeout(this.close, timeout);
    };

    if (this.state.open) {
      this.close();
      setTimeout(open.bind(this), 200);
    } else {
      open();
    }
  };

  close = () => {
    this.setState({ open: false });
  };

  render() {
    const baseClass = ['noti-banner'];

    if (this.state.type === 'success') {
      baseClass.push('noti-banner--success');
    } else {
      baseClass.push('noti-banner--error');
    }

    if (this.state.open) {
      baseClass.push('noti-banner--visible');
    }

    return (
      <div className={baseClass.join(' ')}>
        <div className="container">
          <span className="noti-banner__icon" />
          {this.state.msg}

          <a onClick={this.close} href="javascript:void(0)" className="pull-right noti-banner--close-button">
            <i className="ion-md-close"></i>
          </a>

          {this.state.type === 'error' ? (
            <a className="noti-banner__help" href="javascript:void(0)" target="_blank">
              Get Help
            </a>
          ) : null}
        </div>
      </div>
    );
  }
}

NotiBanner.propTypes = {
  open: PropTypes.bool,
};
