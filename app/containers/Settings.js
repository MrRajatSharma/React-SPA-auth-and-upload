import React from 'react';
import { reduxForm, Field } from 'redux-form';
import rootDispatcher from '../utils/rootDispatcher';
import auth from '../utils/auth';
import inputField from '../utils/inputField';
import { email, required } from '../utils/validation';
import Avatar1 from '../assets/images/avatars/avatar-1.png';

class Settings extends React.Component {
  constructor() {
    super();

    this.avatars = [];
    for (let i = 1; i <= 8; i += 1) {
      this.avatars.push({
        img: `avatar-${i}.png`,
      });
    }
  }

  componentWillMount() {
    const user = auth.getUser();

    if (!user) {
      rootDispatcher.dispatch('LOGIN');
    }
  }

  submitForm = () => {
    const user = auth.getUser();

    if (!user) {
      rootDispatcher.dispatch('LOGIN');
    }
  };

  render() {
    return (
      <div className="card p-3">
        <div className="row row--push-btm-xs" />
        <div className="row">
          <div className="col-12">
            <h5 className="h--lower h--normalize-weight">Update Details</h5>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <form onSubmit={this.props.handleSubmit(this.submitForm)}>
              <div className="row mb-2">
                <div className="col-6">
                  <label>Choose Avatar</label>
                  {this.avatars.map(({ img }, idx) => (
                    <div className="avatar" key={`${idx}-avatar`}>
                      <img height="100%" src={Avatar1} alt="avatar" />
                    </div>
                  ))}
                </div>
                <div className="col-6">
                  <div className="row mb-2">
                    <Field
                      className="col-6"
                      component={inputField}
                      label="First Name"
                      name="firstName"
                      placeholder="eg. John"
                      validate={[required]}
                    />
                    <Field
                      className="col-6"
                      component={inputField}
                      label="Last Name"
                      name="lastName"
                      placeholder="eg. Doe"
                      validate={[required]}
                    />
                  </div>

                  <div className="row mb-2">
                    <Field
                      className="col-12"
                      component={inputField}
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="eg. johndoe@demo.com"
                      validate={[required, email]}
                    />
                  </div>

                  <div className="row mb-3">
                    <Field
                      className="col-12"
                      component={inputField}
                      label="Phone"
                      name="phone"
                      type="number"
                      placeholder="eg. 9796021164"
                      validate={[required]}
                    />
                  </div>
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-12">
                  <button
                    className="btn btn--push pull-right"
                    disabled={this.props.submitting}
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'update',
})(Settings);
