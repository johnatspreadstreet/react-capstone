import React from 'react';
import { Field, reduxForm, focus } from 'redux-form';
import { registerUser } from '../actions/users';
import { login } from '../actions/auth';
import { required, nonEmpty, matches, length, isTrimmed, email } from '../validators';
import RenderField from '../components/RenderField';
import Error from '../components/Error';
import API_BASE_URL from '../config';

const passwordLength = length({ min: 10, max: 72 });
const matchesPassword = matches('password');

const Registration = props => {
  const { error, handleSubmit, pristine, submitting } = props;
  return (
    <div className="w-full max-w-xs">
      <h2 className="text-center p-6">Disrupting the world, one API at a time.</h2>
      <form
        className="login-form bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <Field
            name="fullname"
            type="text"
            component={RenderField}
            validate={[required, nonEmpty]}
            label="Full Name"
          />
        </div>
        <div className="mb-4">
          <Field
            name="email"
            type="text"
            component={RenderField}
            label="Email"
            validate={[required, nonEmpty, isTrimmed, email]}
            autocomplete="email"
          />
        </div>
        <div className="mb-4">
          <Field
            name="password"
            type="password"
            component={RenderField}
            label="Password"
            validate={[required, passwordLength, isTrimmed]}
            autocomplete="new-password"
          />
        </div>
        <div className="mb-4">
          <Field
            name="confirmPassword"
            type="password"
            component={RenderField}
            label="Confirm Password"
            validate={[required, nonEmpty, matchesPassword]}
            autocomplete="new-password"
          />
        </div>
        {error && (
          <div className="mb-4">
            <Error error={error} />
          </div>
        )}
        <div className="flex items-center justify-between">
          <button
            className="btn btn-green hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline"
            type="submit"
            disabled={pristine || submitting}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default reduxForm({
  form: 'registration',
  onSubmit: (values, dispatch) => {
    const { email, password, confirmPassword, fullname } = values;
    const user = { email, password, confirmPassword, fullname };
    return dispatch(registerUser(user)).then(() => dispatch(login(email, password)));
  },
  onSubmitFail: (errors, dispatch) => dispatch(focus('registration', Object.keys(errors)[0]))
})(Registration);
