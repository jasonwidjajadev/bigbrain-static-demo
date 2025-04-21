import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '@/context/useAuthContext';
import { apiCall } from '@/util/apiCall';
import register_img from '@/assets/auth/door.jpg';

import { orangeButtonClass, input } from '@/components/tailwind';
import LinkLogoNavBar from '@/components/LinkLogoNavBar';
import JoinGameButton from '@/components/button/JoinGameButton';

/**
 * AuthLogin component handles user authentication via email and password.
 *
 * - Redirects authenticated users to the dashboard.
 * - Sends login request to the backend via `/admin/auth/login`.
 * - Stores JWT token and email in global auth context.
 * - Displays loading state and backend error messages.
 *
 * @component
 * @returns {JSX.Element} The login page UI
 */
function AuthLogin() {
  /**
   * If already logged in (token exists), redirect to the dashboard immediately.
   */
  const navigate = useNavigate();
  const { token, setToken, setEmail } = useAuthContext();
  React.useEffect(() => {
    if (token) navigate('/dashboard');
  }, [token, navigate]);

  const [emailInput, setEmailInput] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  /**
   * Handles form submission for login.
   * Sends email/password to backend and stores token in auth context.
   * Redirects to `/dashboard` on success or shows an error on failure.
   *
   * @async
   * @function
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event
   */
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

  /**
   * Render UI
   */
  return (
    <div className="min-h-screen overflow-y-auto flex flex-col font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px]">
        <LinkLogoNavBar targetPath="/home" />
        <div className="flex gap-3 sm:gap-4 items-center">
          <JoinGameButton />
          <Link to="/auth/register" className={`${orangeButtonClass} px-5`}>Sign up</Link>
        </div>
      </nav>

      {/* Main Content*/}
      <div className="flex-1 flex justify-center items-center px-6 py-8 bg-[#f7f7f7]">
        <div className="flex w-full max-w-5xl bg-white shadow-lg rounded-2xl overflow-hidden min-h-[500px] max-h-[630px]">
          {/* //*Left: Image */}
          <div className="hidden md:block md:w-[55%] bg-white rounded-r-2xl overflow-hidden">
            <div className="p-4 w-full h-full relative flex items-center justify-center">
              <img
                src={register_img}
                alt="Register"
                className="object-cover w-full h-full rounded-2xl"
              />
              <div className="absolute top-8 left-9 text-white text-2xl font-semibold drop-shadow-md">
                Your <span className="italic">adventure</span><br />awaits
              </div>
            </div>
          </div>

          {/* //*Right: Login Form */}
          <div className="w-full md:w-[45%] px-8 sm:px-12 py-8 sm:py-10 flex justify-center items-center">
            <div className="w-full">
              <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-6 font-Nunito-ExtraBold">Welcome back!</h1>
              <p className="text-sm text-gray-500 mb-8 hidden sm:block">
                Log in with your credentials and start creating legendary games
              </p>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">

                {/* Email */}
                <div>
                  <label htmlFor="emailInput" className="block mb-1 text-sm font-medium">Email address</label>
                  <input type="email" id="emailInput" name="emailInput" required autoComplete="email" value={emailInput} className={input}
                    placeholder='Enter your email'
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setErrorMessage('');
                    }}
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block mb-1 text-sm font-medium">Password</label>
                  <input type="password" id="password" name="password" required autoComplete="password" value={password} className={input}
                    placeholder='Enter your password'
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMessage('');
                    }}
                  />
                </div>

                {/* Backend Error */}
                {errorMessage && (<div className="text-red-500 text-sm mt-2" role="alert">{errorMessage}</div>)}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  aria-label="Login now"
                  className={`sm:text w-full mt-4 px-6 py-2.5 rounded-md font-semibold text-white shadow-[0_4px_0_0_#c2410c]
                    transition-all duration-300 ease-in-out
                    ${loading ? 'bg-orange-300 cursor-not-allowed opacity-60' : 'bg-orange-500 hover:bg-orange-400 hover:-translate-y-1'}`}
                >
                  {loading ? 'Logging in...' : "Let's go!"}
                </button>
              </form>

              <div className="text-sm mt-6">
                Don&apos;t have account? <Link to="/auth/register" className="text-blue-600 hover:underline">Sign up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLogin;
