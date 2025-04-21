import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useAuthContext } from '@/context/useAuthContext';
import { apiCall } from '@/util/apiCall';
import Typewriter from 'typewriter-effect';

import LinkLogoNavBar from '@/components/logo/LogoNavBar';
import LogoBigRotate from '@/components/logo/LogoBigRotate';
import { orangeButtonClass } from '@/components/ui/tailwind';

/**
 * JoinGame component allows players to join a game session using a Game PIN and nickname.
 *
 * - Validates numeric-only Game PIN input.
 * - Submits the join request to the backend.
 * - Stores player ID in localStorage on success.
 * - Redirects to the player lobby on successful join.
 * - Displays helpful messages and error handling.
 *
 * @component
 * @returns {JSX.Element} The Join Game page UI
 */
function JoinGame() {
  const navigate = useNavigate();
  const { token } = useAuthContext();
  const authLink = token
    ? { path: '/dashboard', label: 'Dashboard' }
    : { path: '/auth/login', label: 'Log in' };

  const [sessionIdInput, setSessionIdInput] = React.useState('');
  const [nickName, setNickName] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isNickFocused, setIsNickFocused] = React.useState(false);

  /**
   * Sends a join request to the backend with the Game PIN and nickname.
   * On success, stores the returned player ID in localStorage and redirects to the player lobby.
   * Displays an error message on failure.
   *
   * @async
   * @function
   * @returns {Promise<void>}
   */
  async function goToLobby() {
    setLoading(true);
    try {
      const data = await apiCall(`/play/join/${sessionIdInput}`, 'POST', {
        name: nickName.trim(),
      })

      //Store in local storage
      const playerMap = JSON.parse(localStorage.getItem('playerMap') || '{}');
      playerMap[sessionIdInput] = data.playerId;
      localStorage.setItem('playerMap', JSON.stringify(playerMap));

      //Success player goes to lobby -> PlayerGameLobby
      navigate(`/play/${sessionIdInput}`, {
        state: {
          sessionId: sessionIdInput,
          nickName: nickName,
          playerId: data.playerId,
          from:'/join'
        }
      });

    } catch (err) {
      setErrorMessage(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handles form submission to join a game.
   * Prevents default page reload and triggers the join flow.
   *
   * @function
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    goToLobby();
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px] text-center">
        <LinkLogoNavBar targetPath="/home" />
        <Link to={authLink.path} className={`${orangeButtonClass} px-6`}>{authLink.label}</Link>
      </nav>

      {/* Join Game Form */}
      <form
        onSubmit={handleSubmit}
        aria-label="Join Game form"
        className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-cyan-700 pb-25"
      >
        <div className="flex items-center mb-6 gap-5" >
          <LogoBigRotate sizeClass="h-[50px] sm:h-[70px]"/>
          <div className="text-4xl sm:text-5xl text-orange-500 whitespace-nowrap font-Nunito-ExtraBold">
            <Typewriter
              options={{
                strings: ['Big Brain', 'Big Fun', 'Think Fast', 'Game On!'],
                autoStart: true,
                loop: true,
                pauseFor: 5000,
                delay: 100,
                deleteSpeed: 75,
              }}
            />
          </div>
        </div>

        {/* Game Pin */}
        <div className='px-4 pt-4 pb-5 rounded-xl bg-white'>
          <div className="mb-3">
            <input
              type="text"
              title="Please enter numbers only"
              id="sessionIdInput"
              name="sessionIdInput"
              aria-label="Game ID"
              placeholder="Enter Game PIN"
              autoComplete="off"
              required
              value={sessionIdInput}
              onChange={(e) => {
                const value = e.target.value.trimStart();
                setSessionIdInput(value);
                if (value === '') {
                  setErrorMessage('');
                } else if (!/^[0-9]+$/.test(value)) {
                  setErrorMessage('Game PIN must be numbers only');
                } else {
                  setErrorMessage('');
                }
              }}
              onFocus={() => setErrorMessage('')}
              className="placeholder:font-Nunito-Bold placeholder:text-gray-400 p-3 text-lg border-2 border-gray-200 rounded-md w-[290px] text-center focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-400 text-md font-Nunito-Bold"
            />
          </div>

          {/* Nickname */}
          <div className="mb-3">
            <input
              type="text"
              id="nickName"
              name="nickName"
              aria-label="Player Name"
              placeholder="Enter Nickname"
              autoComplete="off"
              required
              value={nickName}
              onChange={(e) => {
                setNickName(e.target.value);
              }}
              onFocus={() => {
                setErrorMessage('');
                setIsNickFocused(true);
              }}
              onBlur={() => setIsNickFocused(false)}
              className="placeholder:font-Nunito-Bold placeholder:text-gray-400 p-3 text-lg border-2 border-gray-200 rounded-md w-[290px] text-center focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-400 font-Nunito-Bold"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !(sessionIdInput && nickName)}
            aria-label="Join game now"
            className={`sm:text-xl w-full px-8 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out shadow-[0_4px_0_0_#c2410c]
              ${ loading || !(sessionIdInput && nickName) ? 'bg-orange-300 cursor-not-allowed text-white' : 'bg-orange-500 text-white hover:bg-orange-400 hover:-translate-y-1'}`}
          >
            {loading ? 'Joining...' : 'Join'}
          </button>
        </div>
      </form>
      {/^[0-9]+$/.test(sessionIdInput) && !nickName && !isNickFocused && (<div className="fixed bottom-0 left-0 right-0 z-50 bg-green-600 text-white text-lg font-Nunito-Medium flex justify-center items-center py-5 font-semibold">
        <span>Great now we just need your name!</span>
      </div>)}

      {/* Error Popup */}
      {errorMessage && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-red-600 text-white text-lg font-Nunito-Medium flex justify-center items-center py-5 font-semibold">
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

export default JoinGame;