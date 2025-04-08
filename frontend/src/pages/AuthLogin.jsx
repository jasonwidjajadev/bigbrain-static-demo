/**
2.1.1. Login Screen

A unique route must exist for this screen e.g. /login

User must be able to enter their email and password.
If the form submission fails, a reasonable error message is shown
A button must exist to allow submission of form
The form must be able to be submitted on enter key in any of the fields
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../backend.config.json';
import { Link } from 'react-router-dom';

function AuthLogin() {
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem('bigbrain_token');
    if (token) {
      navigate('/dashboard');
    }
  }, []);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function submit() {
    setLoading(true);
    const path = '/admin/auth/login';
    const url = `http://localhost:${config.BACKEND_PORT}${path}`;
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        setErrorMessage(data.error || 'Something went wrong');
        return;
      }
      localStorage.setItem('bigbrain_token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    submit();
  };

  // const handleClickOpen = (message) => {
  //   setErrorMessage(message); // Set the error message
  //   setOpen(true);
  // };

  /**
  TODO
  - Choose component library
  - Clear emailErrors and passwordErrors on input change
  - Disable button while submitting
  - Add minLength to password field
  - Show success message on successful login
  */

  return (
    <div style={{
      minHeight: '100vh',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 2rem',
        textAlign: 'center',
        alignItems: 'center',
        borderBottom: '1px solid #eee',
      }}>
        <Link to="/home"
          style={{
            textDecoration: 'none',
            color: 'purple',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}>Big Brain 🧠
        </Link>
        <Link
          to="/auth/register"
          style={{
            border: '2px solid grey',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            textDecoration: 'none',
            background: '#efefef',
            color: 'black',
          }}
        >
          Sign Up
        </Link>
      </nav>

      <form
        onSubmit={handleSubmit}
        aria-label="Login form"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <h1 style={{
          marginBottom: '1rem',
        }}>Log in 🔑
        </h1>

        {/* Email */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">Email Address:</label>
          <br />
          <input
            type="email"
            id="email"
            name="email"
            aria-label="Email Address"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage('');
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">Password:</label>
          <br />
          <input
            type="password"
            id="password"
            name="password"
            aria-label="Password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage('');
            }}
          />

        </div>

        {/* Backend Error Message */}
        {errorMessage && (
          <div style={{ color: 'red', fontSize: '0.9rem', marginTop: '0.5rem' }} role="alert">
            {errorMessage}
          </div>
        )}
