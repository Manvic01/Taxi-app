import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { TextField, Button, withStyles } from 'material-ui';
import { isEmpty } from 'lodash';
import { signIn } from '../actions/signIn';
import validateRequiredFields from '../helpers/formHelper';
import '../../styles/css/components/SignInForm.css';

const styles = {
  SignInFormButton: {
    marginTop: 20
  }
};

class SignInForm extends React.Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.state = {
      inputs: {
        username: '',
        password: ''
      },
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      inputs: {
        ...this.state.inputs,
        [e.target.name]: e.target.value
      }
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ errors: {} });

    if (this.isValid()) {
      console.log('valid');
      this.props.signIn(this.state.inputs)
        .then(res => console.log('done'));
      // this.props.signUp(this.state.inputs)
      //   .then((action) => {
      //     this.props.history.push('/confirmation', {
      //       verificationEmail: action.payload.email,
      //       token: action.payload.token
      //     });
      //   });
    }
  }

  isValid() {
    const { errors, isValid } = this.validateInputs(this.state.inputs);

    if (!isValid) {
      this.setState({ errors });
    }

    return isValid;
  }

  validateInputs(data) {
    const errors = validateRequiredFields(data);

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }

  render() {
    const { errors } = this.state;

    return (
      <form className="login-form" onSubmit={this.onSubmit} noValidate autoComplete="off">
        <p className="login-form__title">
          Korzystając z poniższego formularza możesz zalogować się jako pasażer lub kierowca.
        </p>
        <TextField
          id="username"
          name="username"
          label="Nazwa użytkownika"
          margin="normal"
          fullWidth
          onChange={this.onChange}
          error={Boolean(errors.username)}
          helperText={errors.username}
        />
        <TextField
          id="password"
          name="password"
          label="Hasło"
          margin="normal"
          type="password"
          fullWidth
          onChange={this.onChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
        />
        <div className="login-form__buttons-wrapper">
          <Button className={this.classes.SignInFormButton} raised color="primary" type="submit">
            Zaloguj się
          </Button>
          <Button
            component={Link}
            to="/register"
            className={this.classes.SignInFormButton}
            raised
            color="default"
          >
            Utwórz konto
          </Button>
          <a href="/" className="login-form__forgot-password-link">Nie pamiętasz hasła?</a>
        </div>
      </form>
    );
  }
}

SignInForm = connect(state => state, { signIn })(SignInForm);

SignInForm.propTypes = {
  classes: propTypes.shape.isRequired
};

export default withStyles(styles)(SignInForm);
