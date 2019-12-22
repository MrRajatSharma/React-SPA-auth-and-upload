import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import './alert-modal.scss';

export default class AlertModal extends React.Component {

  constructor(props) {
    super();

    this.state = {
      open: Boolean(props.open) || false,
      dismissable: Boolean(props.dismissable) || false,
      center: props.center !== false,
    };
  }

  componentDidMount() {
    if (this.props.open) {
      this.animateIn();
    } else {
      const node = ReactDOM.findDOMNode(this);
      node.style.visibility = 'hidden';
      this.didAnimateInAlready = false;
    }
  }

  componentWillReceiveProps(props) {
    if (props.open) {
      if (!this.didAnimateInAlready) {
        // Double check modal not animated in yet
        this.animateIn();
      }
    }

    // Apply remove animation if it is mounted
    if (!props.open && this.props.open) {
      this.didAnimateInAlready = false;

      const node = ReactDOM.findDOMNode(this);

      node.classList.remove('alert-modal--visible');
      setTimeout(() => {
        node.style.visibility = 'hidden';
      }, 300);
    }
  }

  animateIn() {
    this.didAnimateInAlready = true;

    // Animate this node once it is mounted
    const node = ReactDOM.findDOMNode(this);

    node.classList.add('alert-modal--visible');
    node.style.visibility = 'visible';
  }

  getBaseClass() {
    let baseClass = 'alert-modal';

    if (this.state.center) {
      baseClass += ' alert-modal--center';
    }

    return baseClass;
  }

  render() {
    const {rejectAction, acceptAction, rejectText, acceptText, children, title, subTitle} = this.props;
    return (
      <section
        className={this.getBaseClass()}
      >
        <div
          className="alert-modal__box"
          onClick={(evt) => evt.stopPropagation()}
        >
          <div className="alert-modal__body">
            <h4 className="h--spacing-sm h--lower text-center">
              {title}
            </h4>
            <p className="alert-modal__body__subtitle text-center">{subTitle}</p>
            {children}
          </div>
          <div className="alert-modal__footer">
            {
              rejectAction ? <a className="btn btn--text-lower btn--block" onClick={rejectAction}>{rejectText || 'Cancel'}</a> : null
            }
            {
              acceptAction ? <a className="btn btn--text-lower btn--block" onClick={acceptAction}>{acceptText || 'Confirm'}</a> : null
            }
          </div>
        </div>
      </section>
    );
  }
}

AlertModal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  rejectText: PropTypes.string,
  acceptText: PropTypes.string,
};
