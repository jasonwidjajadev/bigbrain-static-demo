import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import LogoNavBar from "../component/LogoNavBar";
import { orangeButtonClass, input } from "../component/tailwind";
import { useAuthContext } from "../context/useAuthContext";
import { apiCall } from "../util/apiCall";

function AuthRegister() {
  const navigate = useNavigate();
  const { token, setToken } = useAuthContext();
  React.useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token, navigate]);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [emailErrors, setEmailErrors] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordErrors, setPasswordErrors] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [confirmPasswordErrors, setConfirmPasswordErrors] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function submit() {
    setLoading(true);
    try {
      const data = await apiCall("/admin/auth/register", "POST", {
        email: email.trim(),
        password: password.trim(),
        name: name.trim(),
      });

      setToken(data.token);

      navigate("/dashboard");
    } catch (err) {
      const errMsg = err.message.toLowerCase();
      if (errMsg.includes("email")) {
        setEmailErrors(err.message);
      } else {
        setErrorMessage(err.message || "Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const clearAllErrors = () => {
    setEmailErrors("");
    setPasswordErrors("");
    setConfirmPasswordErrors("");
    setErrorMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setPasswordErrors("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordErrors("Passwords do not match.");
      return;
    }
    clearAllErrors();
    submit();
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px]">
        <Link
          to="/home"
          className="text-orange-500 text-3xl font-bold no-underline"
        >
          <LogoNavBar />
        </Link>
        <div className="flex gap-3 items-center">
          <Link to="/quiz/join" className={orangeButtonClass}>
            Join a game
          </Link>
          <Link to="/auth/login" className={orangeButtonClass}>
            Log in
          </Link>
        </div>
      </nav>

      {/* Register Form */}
      <form
        onSubmit={handleSubmit}
        aria-label="Registration form"
        className="flex-1 flex flex-col justify-center items-center text-center p-8"
      >
        <h1 className="text-5xl mb-6 font-semibold text-orange-500 font-Nunito-Black">
          Register ✍
        </h1>

        {/* Full Name */}
        <div className="mb-4 w-full max-w-sm text-left">
          <label htmlFor="name" className="block mb-1 text-sm font-medium">
            Full Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            autoComplete="name"
            value={name}
            className={input}
            onChange={(e) => {
              setName(e.target.value);
              setErrorMessage("");
            }}
          />
        </div>

        {/* Email */}
        <div className="mb-4 w-full max-w-sm text-left">
          <label htmlFor="email" className="block mb-1 text-sm font-medium">
            Email Address:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            className={input}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage("");
              setEmailErrors("");
            }}
          />
          {emailErrors && (
            <div className="text-red-500 text-sm mt-1" role="alert">
              {emailErrors}
            </div>
          )}
        </div>

        {/* Password */}
        <div className="mb-4 w-full max-w-sm text-left">
          <label htmlFor="password" className="block mb-1 text-sm font-medium">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            autoComplete="new-password"
            minLength={6}
            value={password}
            className={input}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage("");
              setPasswordErrors("");
            }}
          />
          {passwordErrors && (
            <div className="text-red-500 text-sm mt-1" role="alert">
              {passwordErrors}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-4 w-full max-w-sm text-left">
          <label
            htmlFor="confirmPassword"
            className="block mb-1 text-sm font-medium"
          >
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            autoComplete="new-password"
            minLength={6}
            value={confirmPassword}
            className={input}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrorMessage("");
              setConfirmPasswordErrors("");
            }}
          />
          {confirmPasswordErrors && (
            <div className="text-red-500 text-sm mt-1" role="alert">
              {confirmPasswordErrors}
            </div>
          )}
        </div>

        {/* Backend Error */}
        {errorMessage && (
          <div className="text-red-500 text-sm mt-2" role="alert">
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`sm:text-xl mt-4 px-6 py-2.5 rounded-md font-semibold text-white shadow-[0_4px_0_0_#c2410c]
          transition-all duration-300 ease-in-out ${
    loading
      ? "bg-orange-300 cursor-not-allowed opacity-60"
      : "bg-orange-500 hover:bg-orange-400 hover:-translate-y-1"
    }`}
        >
          {loading ? "Registering..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default AuthRegister;
