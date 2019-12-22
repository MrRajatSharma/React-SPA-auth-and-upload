import React from 'react';
import PropTypes from 'prop-types';

import './simple-modal.scss';

export default class SimpleModal extends React.Component {

  constructor(props) {
    super();

    this.state = {
      open: Boolean(props.open) || false,
      dismissable: Boolean(props.dismissable) || false,
      center: props.center !== false,
    };
  }

  componentWillReceiveProps(props) {
    this.setState(props);
  }

  close = () => {
    if (!this.state.dismissable) {
      return;
    }

    this.setState({open: false});

    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  }

  getBaseClass() {
    let baseClass = 'modal';

    if (this.state.open) {
      baseClass += ' modal--visible';
    }

    if (this.state.center) {
      baseClass += ' modal--center';
    }

    return baseClass;
  }

  getContentComponent() {
    if (this.props.title && this.props.subTitle) {
      return (
        <div>
          <header className="modal__header">
            <div className="modal__header__title-group row">
              <div className="col-12">
                <h5 className="h--no-spacing">{ this.props.title }</h5>
                <h6 className="h--normalize-weight">{ this.props.subTitle }</h6>
              </div>
            </div>
          </header>
          <div className="modal__body">
            { this.props.children }
          </div>
        </div>
      );
    }
    return this.props.children;
  }

  render() {
    return (
      <section
        className={this.getBaseClass()}
        onClick={this.close}
      >
        <div
          className="modal__box"
          onClick={(evt) => evt.stopPropagation()}
        >
          {this.getContentComponent()}
        </div>
      </section>
    );
  }

}

SimpleModal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  children: PropTypes.any,
};
