import { Link } from 'react-router-dom';
import { FaPlay } from "react-icons/fa";
import { FaStop } from "react-icons/fa6";
import { LuCopy } from "react-icons/lu";
import { IoPerson } from "react-icons/io5";

import classroom from '@/assets/classroom_overlay.png';
import lobby_music from '@/assets/positive-orchestral-loop-287417.mp3';
import MusicPlayer from '@/components/music/MusicPlayer';

import { orangeButtonClass, lobbyNameClass } from '@/components/ui/tailwind';
import LinkLogoNavBar from '@/components/logo/LogoNavBar';

/**
 * HostGameLobby component displays the waiting lobby before a quiz starts.
 *
 * - Shows the session ID and a copy-to-clipboard feature.
 * - Displays a list of player nicknames who have joined.
 * - Allows the host to start the game or end the session.
 * - Responsive layout adapts to both small and large screens.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.sessionId - The unique game session ID
 * @param {Function} props.showResults - Callback to end the session and show results
 * @param {string[]} props.players - Array of player nicknames who have joined
 * @param {Function} props.onStart - Callback to start the quiz
 * @returns {JSX.Element} The rendered host lobby interface
 */
function HostGameLobby({sessionId, showResults, players, onStart}) {

  /**
   * Copies the session join URL to the user's clipboard.
   *
   * @function
   */
  const handleCopyToClipboard = () => {
    const sessionUrl = `${window.location.origin}/join/${sessionId}`;
    navigator.clipboard.writeText(sessionUrl);
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px] text-center">
        <LinkLogoNavBar targetPath="/home" />

        {/* For Small Screen */}
        <div className="flex gap-3 sm:gap-4 items-center">
          <MusicPlayer src={lobby_music} className="mb-5"/>
          <button
            className={`${orangeButtonClass} flex items-center gap-3 px-2`}
            onClick={showResults}
          >
            <FaStop className="text-[22px]"/>End
          </button>
          <div className='block sm:hidden'>
            <div className='flex items-center gap-4 text-cyan-800'>
              <button
                className={`${orangeButtonClass} flex items-center gap-2 px-5`}
                onClick={onStart}
              >
                <FaPlay className="text-[16px]"/>Start
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main
        className="flex-1 flex flex-col items-center text-center p-6 bg-cover bg-center h-screen"
        style={{ backgroundImage: `url(${classroom})` }}
      >

        {/* //*Quiz ID + Start Game */}
        <div className='mb-8 flex gap-5 mx-auto justify-between items-center'>
          <div className='py-4 px-4 rounded-md bg-cyan-800 text-white flex flex-col items-center'>
            <p className="text-md sm:text-xl font-Nunito-Medium mb-3"><span className='text-xl'>Join at&nbsp;&nbsp;</span>
              <Link to={`/quiz/join/${sessionId}`} className='font-bold underline'>www.bigbrain.com/join</Link>
            </p>
            <button
              onClick={handleCopyToClipboard}
              title="Click to copy game PIN"
              aria-label="Copy to clipboard"
              className="text-5xl sm:text-6xl font-Nunito-Black hover:cursor-pointer flex gap-2">
              {sessionId} <LuCopy size={25} />
            </button>
          </div>
          <div className='hidden sm:block'>
            <div className='flex flex-col gap-5 items-center'>
              <div className='flex items-center gap-3 text-cyan-800'>
                <IoPerson className='text-4xl'/>
                <span className='text-3xl sm:text-4xl font-Nunito-ExtraBold'>
                  {players.length}
                </span>
              </div>
              <button
                id="start-button-main"
                onClick={onStart}
                className={`${orangeButtonClass} flex items-center gap-2 px-5`}>
                <FaPlay className="text-[16px]"/>Start
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <div className='flex flex-wrap gap-3 sm:gap-4 max-w-7xl mx-auto justify-center'>
            {!players?.length && (
              <div className={lobbyNameClass}>Waiting for players...</div>
            )}
            {players?.map((name, index) => (
              <div key={index} className={lobbyNameClass}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default HostGameLobby;