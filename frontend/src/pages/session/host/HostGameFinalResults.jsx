"use client";

import { Link } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import classroom from "@/assets/classroom_overlay.png";

import { ConfettiSideCannons } from "@/components/confetti/ConfettiSideCannons";
import MusicPlayer from '@/components/music/MusicPlayer';
import final_music from '@/assets/happy-runner-fast-paced-kids-game-music-loop-248099.mp3';
// import final_music from '@/assets/fun-game-upbeat-happy-video-game-music-249646.mp3';

import LinkLogoNavBar from "@/components/logo/LogoNavBar";
import { orangeButtonClass } from "@/components/ui/tailwind";
import ResultsDisplay from "@/pages/quiz/charts/ResultsDisplay";

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
            <Link
              to="/dashboard"
              className={`${orangeButtonClass} flex items-center gap-3 px-5`}
            >
              <GoHomeFill />
              Dashboard
            </Link>
          </div>
        </nav>

        {/* Main */}
        <main className="flex-1 flex flex-col justify-center items-center text-center p-4 sm:p-8">
          <ResultsDisplay gameData={quiz} sessionResults={hostFinalResults} />
        </main>

      </div>
    </div>
  );
}

export default HostGameResults;
