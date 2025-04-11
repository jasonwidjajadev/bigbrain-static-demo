import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LogoNavBar from '../component/LogoNavBar';
import { useAuthContext } from '../context/useAuthContext';
import { apiCall } from '../util/apiCall';
import { orangeButtonClass, input } from '../component/tailwind';

function AuthLogin() {
  const navigate = useNavigate();
  const { token, setToken, setEmail } = useAuthContext();
  React.useEffect(() => {
    if (token) navigate('/dashboard');
  }, [token, navigate]);

  const [emailInput, setEmailInput] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const data = await apiCall('/admin/auth/login', 'POST', {
        email: emailInput.trim(),
        password: password.trim(),
      });

      setToken(data.token);
      setEmail(emailInput.trim());
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px]">
        <Link to="/home" className="text-orange-500 text-3xl font-bold no-underline">
          <LogoNavBar />
        </Link>
        <div className="flex gap-3 items-center">
          <Link to="/quiz/join" className={orangeButtonClass}>Join a game</Link>
          <Link to="/auth/register" className={orangeButtonClass}>Sign up</Link>
        </div>
      </nav>

      {/* Login Form */}
      <form onSubmit={handleSubmit} aria-label="Login form"
        className="flex-1 flex flex-col justify-center items-center text-center p-8"
      >
        <h1 className="text-5xl mb-6 font-semibold text-orange-500 font-Nunito-Black">Log in 🔑</h1>

        {/* Email */}
        <div className="mb-4 w-full max-w-sm text-left">
          <label htmlFor="emailInput" className="block mb-1 text-sm font-medium">Email Address:</label>
          <input type="email" id="emailInput" name="emailInput" required autoComplete="email" value={emailInput} className={input}
            onChange={(e) => {
              setEmailInput(e.target.value);
              setErrorMessage('');
            }}
          />
        </div>

        {/* Password */}
        <div className="mb-4 w-full max-w-sm text-left">
          <label htmlFor="password" className="block mb-1 text-sm font-medium">Password:</label>
          <input type="password" id="password" name="password" required autoComplete="new-password" value={password} className={input}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage('');
            }}
          />
        </div>

        {/* Error */}
        {errorMessage && (<div className="text-red-500 text-sm mt-2" role="alert">{errorMessage}</div>)}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          aria-label="Login now"
          className={`sm:text-xl mt-6 px-6 py-2.5 rounded-md font-semibold text-white shadow-[0_4px_0_0_#c2410c]
            transition-all duration-300 ease-in-out
            ${loading ? 'bg-orange-300 cursor-not-allowed opacity-60': 'bg-orange-500 hover:bg-orange-400 hover:-translate-y-1'}`}
        >
          {loading ? 'Logging in...' : "Let's go!"}
        </button>
      </form>
    </div>
  );
}

export default AuthLogin;
