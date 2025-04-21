import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '@/context/useAuthContext';
import { apiCall } from '@/util/apiCall';
import register_img from '@/assets/auth/colorful_brain.png';

import { orangeButtonClass, input } from '@/components/tailwind';
import LinkLogoNavBar from '@/components/LinkLogoNavBar';
import JoinGameButton from '@/components/button/JoinGameButton';

/**
 * AuthRegister component handles user registration.
 *
 * - Collects user name, email, password, and confirmation password.
 * - Validates input fields (password match and length).
 * - Sends registration request to `/admin/auth/register`.
 * - Stores token and email in auth context on success and navigates to the dashboard.
 * - Displays field-specific and backend error messages.
 *
 * @component
 * @returns {JSX.Element} The user registration page UI
 */
function AuthRegister() {
  /**
   * If already logged in (token exists), redirect to the dashboard immediately.
   */
  const navigate = useNavigate();
  const { token, setToken, setEmail} = useAuthContext();
  React.useEffect(() => {
    if (token) navigate('/dashboard');
  }, [token, navigate]);

  const [name, setName] = React.useState('');
  const [emailInput, setEmailInput] = React.useState('');
  const [emailErrors, setEmailErrors] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordErrors, setPasswordErrors] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [confirmPasswordErrors, setConfirmPasswordErrors] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  /**
   * Sends registration request to backend and stores auth token on success.
   * If registration fails due to email conflict, displays error below the email field.
   *
   * @async
   * @function
   * @returns {Promise<void>}
   */
  async function submit() {
    setLoading(true);
    try {
      const data = await apiCall('/admin/auth/register', 'POST', {
        email: emailInput.trim(),
        password: password.trim(),
        name: name.trim(),
      });

      setToken(data.token);
      setEmail(emailInput.trim());
      navigate('/dashboard');
    } catch (err) {
      const errMsg = err.message.toLowerCase();
      if (errMsg.includes('email')) {
        setEmailErrors(err.message);
      } else {
        setErrorMessage(err.message || 'Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  /**
   * Clears all client-side and backend validation error messages.
   *
   * @function
   */
  const clearAllErrors = () => {
    setEmailErrors('');
    setPasswordErrors('');
    setConfirmPasswordErrors('');
    setErrorMessage('');
  };

  /**
   * Handles form submission.
   * Validates password fields before sending the registration request.
   *
   * @function
   * @param {React.FormEvent<HTMLFormElement>} e - Form submission event
   */
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

  /**
   * Render UI
   */
  return (
    <div className="min-h-screen flex flex-col font-sans overflow-y-auto">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px]">
        <LinkLogoNavBar targetPath="/home" />
        <div className="flex gap-3 sm:gap-4 items-center">
          <JoinGameButton />
          <Link to="/auth/login" className={`${orangeButtonClass} px-6`}>Log in</Link>
        </div>
      </nav>

      {/* Main Content*/}
      <div className="flex-1 flex justify-center items-center px-6 py-8 bg-[#f7f7f7]">
        <div className="flex w-full max-w-5xl bg-white shadow-lg rounded-2xl overflow-hidden">

          {/* //*Left: Image */}
          <div className="hidden md:block md:w-[55%] bg-white rounded-r-2xl overflow-hidden">
            <div className="p-4 w-full h-full relative flex items-center justify-center">
              <img
                src={register_img}
                alt="Register"
                className="object-cover w-full h-full rounded-2xl"
              />
              <div className="absolute bottom-8 left-9 text-white text-2xl font-semibold drop-shadow-md">
                Your <span className="italic">journey</span><br />begins here
              </div>
            </div>
          </div>

          {/* //*Right: Form */}
          <div className="w-full md:w-[45%] px-8 sm:px-12 py-8 sm:py-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-6 font-Nunito-ExtraBold">Register ✍</h1>
            <p className="text-sm text-gray-500 mb-8 hidden sm:block">
              Welcome to Big Brain — let’s get you suited up!
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block mb-1 text-sm font-medium">Full Name</label>
                <input type="text" id="name" name="name" required autoComplete="name"
                  value={name} className={input} placeholder='Enter your name'
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrorMessage('');
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="emailInput" className="block mb-1 text-sm font-medium">Email address</label>
                <input type="email" id="emailInput" name="emailInput" required autoComplete="email"
                  value={emailInput} className={input}
                  placeholder='Enter your email'
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setEmailErrors('');
                    setErrorMessage('');
                  }}
                />
                {emailErrors && (<div className="text-red-500 text-sm mt-1" role="alert">{emailErrors}</div>)}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block mb-1 text-sm font-medium">Password</label>
                <input type="password" id="password" name="password"  required autoComplete="new-password"
                  minLength={6} value={password} className={input}
                  placeholder='Enter your password'
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordErrors('');
                    setErrorMessage('');
                  }}
                />
                {passwordErrors && (<div className="text-red-500 text-sm mt-1" role="alert">{passwordErrors}</div>)}
              </div>


              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword"  required autoComplete="new-password"
                  minLength={6}  value={confirmPassword} className={input}
                  placeholder='Confirm your password'
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordErrors('');
                    setErrorMessage('');
                  }}
                />
                {confirmPasswordErrors && (<div className="text-red-500 text-sm mt-1" role="alert">{confirmPasswordErrors}</div>)}
              </div>

              {/* Backend Error */}
              {errorMessage && (<div className="text-red-500 text-sm mt-2" role="alert">{errorMessage}</div>)}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`sm:text-xl w-full mt-4 px-6 py-2.5 rounded-md font-semibold text-white shadow-[0_4px_0_0_#c2410c]
                  transition-all duration-300 ease-in-out
                  ${loading ? 'bg-orange-300 cursor-not-allowed opacity-60' : 'bg-orange-500 hover:bg-orange-400 hover:-translate-y-1'}`}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <div className="text-sm mt-6">
              Already have an account? <Link to="/auth/login" className="text-blue-600 hover:underline">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthRegister;
