/**
                quizzes:
                  "994004996": {
                  "name": "monkeyfriday",
                  "owner": "kaws@gmail.com",
                  "questions": [],
                  "thumbnail": null,
                  "active": null,
                  "createdAt": "2025-04-13T16:29:17.563Z"
                }
              session:
                  gamepin generated "982370": {
              "quizId": "994004996",
              "position": -1,
              "isoTimeLastQuestionStarted": null,
              "players": {},
              "questions": [],
              "active": true,
              "answerAvailable": false
            },
HOST
dashboard,
    0.
    1.host click play -> this automatically start quiz (ui card has automatically stop quiz and view quiz)
    2 generate ID, Join here 431288, OR copy link with the url
      -> copylink and (backend generates new number each time)
      -> open quiz  -> quiz/play/431288, music, animation, text moving
                    -> option to start quiz
                    -> option to end quiz
                    -> option to go back and have multiple quiz happenign at the same time
              -> host can got back to dashboard where there is a stop
              -> or view quiz back to previous state
      -> start or END (end shows leaderboard on host side, on player side shows incorrect answer should have a default host ended game early)

  THE LOBBY
  -> automatically host, populates of users who joined: https://classic.blooket.com/host/join
  -> https://classic.blooket.com/play/lobby
            -> chosen avatar by default, if user change avatar it gets updates in host page
            -> shows a message waiting for host, (can play game if want to)
            -> if user disconnect, host page removes the user
  -> host start hgame

PLAYER
  -> 1.quiz/join, enter invalid quizID regardless brings into part 2 -> where it fails if invalid quizId
  -> 2.enter valid pin, quiz/join/sessionid bring into please enter name
      -> msut enter a name,
              -> this is where the error is invalid quiz ID, popup on the bottom
                    -> error message invalid game id or no game id
                        - Invalid game ID
                        - Please enter a game ID
              -> OR quizId is not active
  -> 3. enters into lobby, quiz/play/431288 waiting for HOST

 */

// TODO can an admin play its own game? i.e should disable clicking
// TODO: Should have an error if invalid game ID

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LogoNavBar from '../component/LogoNavBar';
import { orangeButtonClass } from '../component/tailwind';
import { useAuthContext } from '../context/useAuthContext';
import LogoBigRotate from '../component/LogoBigRotate';
import { apiCall } from '../util/apiCall';
import Typewriter from 'typewriter-effect';

function QuizJoin() {
  //Show on navbar wether its dashboard or login
  const { token } = useAuthContext();
  const authLink = token ? { path: '/dashboard', label: 'Dashboard' } : { path: '/auth/login', label: 'Log in' };

  //Game Id and Nickname
  const [sessionId, setSessionId] = React.useState('');
  const [nickName, setNickName] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Api Call
  const navigate = useNavigate();
  async function joinGame() {
    setLoading(true);
    try {
      console.log('Attempting to join game with ID:', sessionId);
      console.log('Attempting to join game with nickName:', nickName);
      const data = await apiCall(`/play/join/${sessionId}`, 'POST', {
        name: nickName.trim(),
      })

      //Success player goes to lobby -> PlayerGameLobby
      localStorage.setItem('playerId', data.playerId);
      navigate(`/quiz/lobby/${sessionId}`, {
        state: {
          nickname: nickName,
          isAdmin: false,
        }
      });
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
          <LogoNavBar />
        </Link>
        <Link to={authLink.path} className={`${orangeButtonClass} px-6`}>{authLink.label}</Link>
      </nav>

      {/* Join Game Form */}
      <form
        onSubmit={handleSubmit}
        aria-label="Join Game form"
        className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-[#fabf24] pb-25"
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
        <div className='px-4 pt-4 pb-5 rounded-xl bg-white'>
          <div className="mb-3">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              title="Please enter numbers only"
              id="sessionId"
              name="sessionId"
              aria-label="Game ID"
              placeholder="Enter Game PIN Number"
              autoComplete="off"
              required
              value={sessionId}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, '');
                setSessionId(onlyNums);
                setErrorMessage('');
              }}

              className="placeholder:font-Nunito-Bold placeholder:text-gray-400 p-3 text-lg border border-gray-300 rounded-md w-[290px] text-center focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          {errorMessage && (<div className="text-red-500 text-sm mb-4" role="alert"> {errorMessage} </div>)}

          <div className="mb-3">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              title="Please enter numbers only"
              id="sessionId"
              name="sessionId"
              aria-label="Game ID"
              placeholder="Enter Nickname"
              autoComplete="off"
              required
              value={sessionId}
              onChange={(e) => {
                // const onlyNums = e.target.value.replace(/\D/g, '');
                setSessionId(e.target.value);
                setErrorMessage('');
              }}

              className="placeholder:font-Nunito-Bold placeholder:text-gray-400 p-3 text-lg border border-gray-300 rounded-md w-[290px] text-center focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !sessionId}
            aria-label="Join game now"
            className={`sm:text-xl w-full px-8 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out shadow-[0_4px_0_0_#c2410c]
              ${ loading || !sessionId ? 'bg-orange-300 cursor-not-allowed text-white' : 'bg-orange-500 text-white hover:bg-orange-400 hover:-translate-y-1'}`}
          >
            {loading ? 'Joining...' : 'Join'}
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between items-center text-sm text-white text-center absolute bottom-1 w-full py-2 sm:px-8">
        <p className="mb-0 hover:text-black">© Copyright 2025. All Rights Reserved.</p>
        <p className="hidden sm:block mb-0 hover:text-black">🚀&nbsp; Powered by neurons & nonsense</p>
      </div>
    </div>
  );
}

export default QuizJoin;