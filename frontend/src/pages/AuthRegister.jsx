import React from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../backend.config.json';
import { Link } from 'react-router-dom';

function AuthRegister() {
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem('bigbrain_token');
    if (token) {
      navigate('/dashboard');
    }
  }, []);

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [emailErrors, setEmailErrors] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordErrors, setPasswordErrors] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [confirmPasswordErrors, setConfirmPasswordErrors] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function submit() {
    setLoading(true);
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const path = '/admin/auth/register';
    const url = `http://localhost:${config.BACKEND_PORT}${path}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
          name: trimmedName,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        if (data.error && data.error.toLowerCase().includes('email')) {
          setEmailErrors(data.error);
        } else {
          setErrorMessage(data.error || 'Something went wrong');
        }
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
  const clearAllErrors = () => {
    setEmailErrors('');
    setPasswordErrors('');
    setConfirmPasswordErrors('');
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setPasswordErrors('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordErrors('Passwords do not match.');
      return;
    }
    clearAllErrors();
    submit();
  };

  // const handleClickOpen = (message) => {
  //   setErrorMessage(message); // Set the error message
  //   setOpen(true);
  // };

  /**
  // TODO
  - password min 6 characters etcs
  - Choose component library
  - Clear emailErrors and passwordErrors on input change
  - Disable button while submitting
  - Add minLength to password field
  - Show success message on successful register
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
          to="/auth/login"
          style={{
            border: '2px solid grey',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            textDecoration: 'none',
            background: '#efefef',
            color: 'black',
          }}
        >
          Log in
        </Link>
      </nav>

      <form
        onSubmit={handleSubmit}
        aria-label="Registration form"
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
        <h1 style={{ marginBottom: '1rem' }}>Register ✍</h1>

        {/* Full Name */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name">Full Name:</label><br />
          <input
            type="text"
            id="name"
            name="name"
            aria-label="Full Name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrorMessage('');
            }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">Email Address:</label><br />
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
              setEmailErrors('');
            }}
          />
          {emailErrors && (
            <div style={{ color: 'red', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {emailErrors}
            </div>
          )}
        </div>
