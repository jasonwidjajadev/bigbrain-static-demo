import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import config from '../../backend.config.json';
import { Link } from 'react-router-dom';
import logonoborder from '../assets/logonoborder.png';

function QuizJoin() {
  const [gameId, setGameId] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function joinGame() {
    setLoading(true);

    // TODO: Add validation here if needed
    try {
      console.log('Joining game with ID:', gameId);
    } catch (err) {
      setErrorMessage(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    joinGame();
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px] text-center">
        <Link to="/home" className="text-orange-500 text-3xl font-bold no-underline">
          <img
            src={logonoborder}
            className="h-[43px] shrink-0 rounded-md bg-white p-1 shadow-md transition-all duration-300 ease-in-out
              hover:-translate-y-1 hover:shadow-[0_4px_0_0_#f97316] hover:bg-orange-50"
            alt="brain-logo"
          />
        </Link>
      </nav>

      {/* Join Game Form */}
      <form
        onSubmit={handleSubmit}
        aria-label="Join Game form"
        className="flex-1 flex flex-col justify-center items-center text-center p-8"
      >
        <h1 className="text-4xl sm:text-6xl text-orange-500 font-Nunito-Black mb-8">
          Join a Game
        </h1>

        <div className="mb-6">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id="gameId"
            name="gameId"
            aria-label="Game ID"
            placeholder="Game PIN"
            autoComplete="off"
            required
            value={gameId}
            onChange={(e) => {
              setGameId(e.target.value);
              setErrorMessage('');
            }}
            className="p-3 text-lg border border-gray-300 rounded-md w-64 text-center focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4" role="alert">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !gameId}
          aria-label="Join game now"
          className={`sm:text-xl px-6 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out shadow-[0_4px_0_0_#c2410c]
            ${ loading || !gameId ? 'bg-orange-300 cursor-not-allowed text-white' : 'bg-orange-500 text-white hover:bg-orange-400 hover:-translate-y-1'}`}
        >
          {loading ? 'Joining...' : 'Join'}
        </button>
      </form>

      {/* Footer */}
      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between items-center text-sm text-gray-400 text-center absolute bottom-1 w-full py-2 sm:px-8">
        <p className="mb-0 hover:text-orange-400">© Copyright 2025. All Rights Reserved.</p>
        <p className="hidden sm:block mb-0 hover:text-orange-400">🚀&nbsp; Powered by neurons & nonsense</p>
      </div>
    </div>
  );
}

export default QuizJoin;