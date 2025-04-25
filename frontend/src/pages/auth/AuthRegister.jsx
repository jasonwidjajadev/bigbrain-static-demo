import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '@/context/useAuthContext';
import { apiCall } from '@/util/apiCall';
import register_img from '@/assets/colorful_brain.png';

import LinkLogoNavBar from '@/components/logo/LogoNavBar';
import FormInput from '@/components/inputs/FormInput';
import Button from '@/components/button/Button';
import { FaPlay } from "react-icons/fa";

import { validateEmail } from '@/util/inputValidation';
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

    let hasError = false;

    // Email validation
    if (!validateEmail(emailInput.trim())) {
      setEmailErrors('Your email should look like: example@email.com');
      hasError = true;
    }

    // Password validation
    if (password.length < 6) {
      setPasswordErrors('Password must be at least 6 characters.');
      hasError = true;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordErrors('Passwords do not match.');
      hasError = true;
    }

    if (hasError) return;

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
          <Button to="/join" icon={FaPlay} color='pink'>Join a game</Button>
          <Button to="/auth/login" color='pink'>Log in</Button>
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
          <div className="w-full md:w-[50%] px-8 sm:px-12 py-8 sm:py-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-6 font-Nunito-ExtraBold">Register ✍</h1>
            <p className="text-sm text-gray-500 mb-8 hidden sm:block">
              Welcome to Big Brain — let’s get you suited up!
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Full Name */}
              <FormInput
                id="registerName"
                labelContent="Full Name"          placeholder="Enter your name"
                type="text"                       autoComplete="name"
                name="name"                       value={name}
                autoFocus={true}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMessage('');
                }}
              />
              {/* Email */}
              <FormInput
                id="registerEmail"
                labelContent="Email address"      placeholder="Enter your email"
                type="email"                      autoComplete="email"
                name="email"                      value={emailInput}
                autoFocus={false}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setEmailErrors('');
                  setErrorMessage('');
                }}
                errorMessage={emailErrors}
              />

              {/* Password */}
              <FormInput
                id="registerPassword"
                labelContent="Password"           placeholder="Enter your password"
                type="password"                   autoComplete="new-password"
                name="password"                   value={password}
                autoFocus={false}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordErrors('');
                  setErrorMessage('');
                }}
                errorMessage={passwordErrors}
              />

              {/* Confirm Password */}
              <FormInput
                id="registerConfirmPassword"
                labelContent="Confirm Password"   placeholder="Confirm your password"
                type="password"                   autoComplete="new-password"
                name="confirmPassword"            value={confirmPassword}
                autoFocus={false}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordErrors('');
                  setErrorMessage('');
                }}
                errorMessage={confirmPasswordErrors}
              />

              {/* Backend Error */}
              {errorMessage && (<div className="text-red-500 text-sm mt-2" role="alert">{errorMessage}</div>)}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`sm:text-xl w-full mt-4 px-6 py-2.5 rounded-md font-semibold text-white shadow-[0_4px_0_0_#9c004e]
                  transition-all duration-300 ease-in-out
                  ${loading ? 'bg-pink-500 cursor-not-allowed opacity-60' : 'bg-pink-600 hover:bg-pink-400  hover:-translate-y-1'}`}
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