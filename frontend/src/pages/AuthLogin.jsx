import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import config from '../../backend.config.json';
import logonoborder from '../assets/logonoborder.png';

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
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
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

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px]">
        <Link to="/home" className="text-orange-500 text-3xl font-bold no-underline">
          <img
            src={logonoborder}
            className="h-[43px] shrink-0 rounded-md bg-white p-1 shadow-md transition-all duration-300 ease-in-out
              hover:-translate-y-1 hover:shadow-[0_4px_0_0_#f97316] hover:bg-orange-50"
            alt="brain-logo"
          />
        </Link>
        <div className="flex gap-3 items-center">
          <Link
            to="/quiz/join"
            className="px-4 py-2.5 rounded-md bg-orange-500 text-white font-semibold no-underline shadow-[0_4px_0_0_#c2410c]
              transition-all duration-300 ease-in-out hover:bg-orange-400 hover:-translate-y-1"
          >
            Join a game
          </Link>
          <Link
            to="/auth/register"
            className="px-4 py-2.5 rounded-md bg-orange-500 text-white font-semibold no-underline shadow-[0_4px_0_0_#c2410c]
              transition-all duration-300 ease-in-out hover:bg-orange-400 hover:-translate-y-1"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        aria-label="Login form"
        className="flex-1 flex flex-col justify-center items-center text-center p-8"
      >
        <h1 className="text-4xl mb-6 font-semibold text-orange-500 font-Nunito-Black">Log in 🔑</h1>

        {/* Email */}
        <div className="mb-4 w-full max-w-sm text-left">
          <label htmlFor="email" className="block mb-1 text-sm font-medium">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage('');
            }}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Password */}
        <div className="mb-4 w-full max-w-sm text-left">
          <label htmlFor="password" className="block mb-1 text-sm font-medium">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage('');
            }}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="text-red-500 text-sm mt-2" role="alert">
            {errorMessage}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          aria-label="Login now"
          className={`mt-6 px-6 py-2.5 rounded-md font-semibold text-white shadow-[0_4px_0_0_#c2410c]
            transition-all duration-300 ease-in-out ${loading ? 'bg-orange-300 cursor-not-allowed opacity-60': 'bg-orange-500 hover:bg-orange-400 hover:-translate-y-1'}`}
        >
          {loading ? 'Logging in...' : "Let's go!"}
        </button>
      </form>
    </div>
  );
}

export default AuthLogin;
