import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';

import SimpleModal from '../components/SimpleModal';
import NotiBanner from '../components/NotiBanner';
import rootDispatcher from '../utils/rootDispatcher';
import req from '../utils/req';
import auth from '../utils/auth';
import inputField from '../utils/inputField';
import {
  passwordsMatch as passwordsMatchValidation,
  email as emailValidation,
  minLength8 as minLength8Validation,
  required as requiredValidation,
} from '../utils/validation';

class Auth extends Component {
  constructor() {
    super();

    this.state = {
      showModal: true,
      showSignUp: false,
    };
  }

  componentDidMount() {
    rootDispatcher.on('LOGIN', this.toggleModal);
  }

  componentWillUnmount() {
    rootDispatcher.off('LOGIN', this.toggleModal);
  }

  submitForm = data => {
    const { email, password } = data;
    const { showSignUp } = this.state;

    const registerRoute = '/signup';
    if (!showSignUp) {
      // user login
      auth
        .authenticate(email, password)
        .then(({ success, body }) => {
          console.log(success, body);
          if (!success) {
            this.setState({
              submitting: false,
            });

            rootDispatcher.dispatch('NB:OPEN', {
              type: 'error',
              msg: body.message,
            });
            return;
          }

          location.reload();
        })
        .catch(err => {
          this.setState({
            submitting: false,
          });

          rootDispatcher.dispatch('NB:OPEN', {
            type: 'error',
            msg: `Whoops! Looks like something went wrong on our side.
                Our support team has been notified. Try again later.`,
          });
        });
      return;
    }

    // sign up user
    req.post(registerRoute, data).then(({ success, body }) => {
      console.log(success, body);
      rootDispatcher.dispatch('NB:OPEN', {
        type: success ? 'success' : 'error',
        msg: success
          ? 'Account Created. You can sign in using credentials'
          : body.message,
      });

      if (!success) {
        this.toggleModal();
        return;
      }
      this.toggleSignUp();
    });
  };

  toggleModal = () => {
    this.setState((prevState, prevProps) => {
      return {
        showModal: !prevState.showModal,
      };
    });
  };

  toggleSignUp = () => {
    this.setState((prevState, prevProps) => {
      return {
        showSignUp: !prevState.showSignUp,
      };
    });
  };

  render() {
    const { showSignUp } = this.state;

    return [
      <NotiBanner />,

      <SimpleModal
        title={showSignUp ? 'Create User Account' : 'Login'}
        subTitle={
          showSignUp
            ? 'Create Account to access advance features.'
            : "Login into app to use all it's features."
        }
        onClose={this.toggleModal}
        open={this.state.showModal}
      >
        <form onSubmit={this.props.handleSubmit(this.submitForm)}>
          {showSignUp ? (
            <div className="row mb-2">
              <Field
                className="col-6"
                component={inputField}
                label="First Name"
                name="firstName"
                placeholder="eg. John"
                validate={[requiredValidation]}
              />
              <Field
                className="col-6"
                component={inputField}
                label="Last Name"
                name="lastName"
                placeholder="eg. Doe"
                validate={[requiredValidation]}
              />
            </div>
          ) : null}

          <div className="row mb-2">
            <Field
              className="col-12"
              component={inputField}
              label="Email"
              name="email"
              type="email"
              placeholder="eg. johndoe@demo.com"
              validate={[requiredValidation, emailValidation]}
            />
          </div>
          <div className="row mb-2">
            <Field
              className="col-12"
              component={inputField}
              label="Password"
              name="password"
              type="password"
              placeholder="eg. password"
              validate={[requiredValidation, minLength8Validation]}
            />
          </div>
          {showSignUp
          ? <React.Fragment>
              <div className="row mb-2">
                <Field
                  className="col-12"
                  component={inputField}
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="eg. password"
                  validate={[
                    requiredValidation,
                    minLength8Validation,
                    passwordsMatchValidation,
                  ]}
                />
              </div>
              <div className="row mb-2">
                <Field
                  className="col-12"
                  component={inputField}
                  label="Phone"
                  name="phone"
                  type="number"
                  placeholder="eg. 9796021164"
                  validate={[requiredValidation]}
                />
              </div>
              <div className="row mb-2">
                <Field
                  className="col-12"
                  component={inputField}
                  formType="select"
                  label="role"
                  name="role"
                  validate={[requiredValidation]}
                  options={[
                    'User',
                    'Admin',
                    'Researcher',
                    'Content manager',
                    'Product manager',
                  ]}
                />
              </div>
            </React.Fragment>
          : null}

          <div className="row mb-2 mt-4">
            <div className="col-2" />
            <div className="col-8">
              <button
                className="btn btn--block"
                disabled={this.props.submitting}
              >
                {showSignUp ? 'Sign-up' : 'Login'}
              </button>
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-3" />
            <div className="col-6">
              <a
                className="btn btn--push btn--light btn--block"
                onClick={this.toggleSignUp}
              >
                {showSignUp ? 'Login' : 'Sign-up'}
              </a>
            </div>
          </div>
        </form>
      </SimpleModal>,
    ];
  }
}

export default reduxForm({
  form: 'join',
})(Auth);
