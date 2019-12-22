import React from 'react';
import autobind from '../../utils/autobind'; // eslint-disable-line no-unused-vars

import './switch.scss';

export default class Switch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      on: props.on || false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.on !== nextProps.on) {
      this.state = {
        on: nextProps.on || false,
      };
    }
  }

  onChange = () => {
    if (this.props.onChange) {
      this.props.onChange(!this.state.on);
    }
    this.setState({
      on: !this.state.on,
    });
  }

  getBaseClass = () => {
    let baseClass = 'switch';

    if (this.state.on) {
      baseClass += ' switch--on';
    }

    return baseClass;
  }

  render() {
    return (
      <span className={this.getBaseClass()} onClick={this.onChange}>
        <span className={ this.state.on ? 'switch__btn ion-checkmark-round' : 'switch__btn ion-close-round'}>
        </span>
      </span>
    );
  }
}
