"use client";

import { GoHomeFill } from "react-icons/go";
import classroom from "@/assets/classroom_overlay.png";
import { TbLogout } from "react-icons/tb";

import { ConfettiSideCannons } from "@/components/confetti/ConfettiSideCannons";
import MusicPlayer from '@/components/music/MusicPlayer';
import final_music from '@/assets/happy-runner-fast-paced-kids-game-music-loop-248099.mp3';

import LinkLogoNavBar from "@/components/logo/LogoNavBar";
import ResultsDisplay from "@/pages/quiz/charts/ResultsDisplay";
import Button from '@/components/button/Button';

/**
 * HostGameResults component displays the final results after a quiz ends, from the host's perspective.
 *
 * - Renders celebration effects (confetti cannons).
 * - Shows the final scoreboard and statistics via `ResultsDisplay`.
 * - Displays a music player and navigation button to return to the dashboard.
 * - Background and layout are styled to match the quiz theme.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.quiz - The quiz metadata (e.g., title, questions)
 * @param {Array<Object>} props.hostFinalResults - The final results of the game (e.g., player scores, ranks)
 * @returns {JSX.Element} The rendered host results page
 */
function HostGameResults({ quiz, hostFinalResults }) {

  return (
    <div className="relative">
      {<ConfettiSideCannons />}
      <div
        className="min-h-screen overflow-y-auto flex flex-col bg-cover bg-center w-full overflow-hidden"
        style={{ backgroundImage: `url(${classroom})` }}
      >
        {/* NavBar */}
        <nav className=" flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px] text-center">
          <LinkLogoNavBar targetPath="/dashboard" />
          <div className="flex gap-3 items-center">
            <MusicPlayer src={final_music} className="mb-5"/>
            <Button to="/dashboard"
              icon={GoHomeFill} iconClass="text-2xl"
              color='pink'>
              Dashboard
            </Button>
            <div className="hidden sm:block">
              <Button to="/auth/logout" icon={TbLogout} iconClass="text-2xl"
                color='pink' data-testid="logout-button-big-screen">
                Logout
              </Button>
            </div>
          </div>
        </nav>

        {/* Main */}
        <main className="flex-1 flex justify-center items-center text-center p-6">
          <div className="w-full sm:w-[90%]">
            <ResultsDisplay gameData={quiz} sessionResults={hostFinalResults} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default HostGameResults;
