import { useState } from "react";
import { formatBase64Image } from "@/util/imageUtils";
import {
  LuPencil,
  LuPlay,
  LuTrash2,
  LuClipboardPaste,
  LuCircleStop,
  LuExternalLink,
} from "react-icons/lu";
import QuizEndedModal from "@/components/modals/QuizEndedModal";
import Button from '@/components/button/Button';

/**
 * GameDashboardTile - A card component that displays game information and controls
 *
 * This component represents an individual game as a card in the dashboard interface.
 * It displays game metadata (name, thumbnail, play count, etc.) and provides controls
 * for managing the game (edit, delete, play, stop, view previous sessions).
 * The component adapts its UI based on whether the game has an active session,
 * showing either play controls or session management controls.
 *
 * @param {Object} props - Component props
 * @param {Game} props.game - The game data to display
 * @param {Function} props.onDelete - Callback when delete button is clicked, receives (gameId, gameName)
 * @param {Function} props.onEdit - Callback when edit button is clicked, receives gameId
 * @param {Function} props.onPreviousSessionResults - Callback when previous sessions button is clicked, receives gameId
 * @param {Function} props.onPlay - Callback when play button is clicked, receives gameId
 * @param {Function} props.onStop - Callback when stop button is clicked, receives gameId
 * @param {Function} props.onGoToSession - Callback when go to session button is clicked, receives (gameId, sessionId)
 * @returns {JSX.Element} Rendered component
 */
function GameDashboardTile({
  game,
  onDelete,
  onEdit,
  onPreviousSessionResults,
  onPlay,
  onStop,
  onGoToSession,
}) {
  const [showModal, setShowModal] = useState(false);
  const [stoppedSessionId, setStoppedSessionId] = useState(null);
  const onStopClick = () => {
    setStoppedSessionId(game.active); // Store it
    handleStopClick(); // Mutate to end the session
    setShowModal(true);
  };

  // Calculate play count from oldSessions length
  const playCount = game.oldSessions?.length || 0;

  // Check if the game has an active session
  const hasActiveSession = !!game.active;

  // Handler for delete button click
  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(game.id, game.name);
    }
  };

  // Handler for edit button click
  const handleEditClick = () => {
    if (onEdit) {
      onEdit(game.id);
    }
  };

  // Handler for play/host button click
  const handlePreviousSessionResults = () => {
    if (onPreviousSessionResults) {
      onPreviousSessionResults(game.id);
    }
  };

  // Handler for play/host button click
  const handlePlayClick = () => {
    if (onPlay) {
      onPlay(game.id);
    }
  };

  // Handler for stop button click
  const handleStopClick = () => {
    if (onStop) {
      onStop(game.id);
    }
  };

  // Handler for go to session button click
  const handleGoToSessionClick = () => {
    if (onGoToSession && hasActiveSession) {
      onGoToSession(game.id, game.active);
    }
  };

  const calculateDuration = () => {
    // Sum up the duration of all questions
    const totalSeconds = game.questions.reduce((total, question) => {
      return total + (question.duration || 0);
    }, 0);

    // Convert to minutes and seconds format
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Format as "MM:SS" (e.g., "2:30" for 2 minutes and 30 seconds)
    return `${minutes} mins, ${seconds.toString().padStart(2, "0")} secs`;
  };

  return (
    <>
      {/* Modal for ending the quiz and having the option to see results */}
      <QuizEndedModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        sessionId={stoppedSessionId}
      />

      <article
        className="w-full min-h-[400px] bg-white rounded-md border border-gray-300 overflow-hidden shadow-md
        hover:scale-105 hover:shadow-lg transition duration-300"
        aria-labelledby={`game-title-${game.id}`}
      >
        {/* Thumbnail section */}
        <div className="w-full h-[180px] bg-gray-300 relative">
          {game.thumbnail && (
            <img
              src={formatBase64Image(game.thumbnail)}
              alt={`Thumbnail for ${game.name}`}
              className="w-full h-full object-cover"
            />
          )}
          {/* Duration Badge Overlay */}
          <div
            className="absolute bottom-4 left-4 bg-black/60 text-white rounded px-2 py-1 text-sm flex items-center"
            aria-label={`Game duration is ${calculateDuration()}`}
          >
            <span className="mr-1">{calculateDuration()}</span>
          </div>

          {/* Question Number Badge Overlay */}
          <div
            className="absolute bottom-4 right-4 bg-black/60 text-white rounded px-2 py-1 text-sm flex items-center"
            aria-label={`There are ${game.questions.length} ${game.questions.length === 1 ? "Question" : "Questions"}`}
          >
            <span className="mr-1">{game.questions.length}</span>
            <span>
              {game.questions.length === 1 ? "Question" : "Questions"}
            </span>
          </div>
        </div>

        {/* Game Info Section */}
        <div className="p-4">
          <h2
            id={`game-title-${game.id}`}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            {game.name}
          </h2>

          <div
            className="flex items-center mt-2 text-gray-600 text-lg font-semibold mb-1"
            aria-label={`There have been ${playCount} ${playCount === 1 ? "Play" : "Plays"}`}
          >
            <LuPlay size={20} className="mr-1" aria-hidden="true" />
            <span className="mr-1">{playCount}</span>
            <span>{playCount === 1 ? "Play" : "Plays"}</span>
          </div>

          {/* Action Buttons */}
          <div className="p-2 flex flex-col justify-end items-center gap-4">
            <div
              className={`w-full border-t border-b border-gray-300 grid grid-cols-3 ${hasActiveSession ? "hidden" : ""}`}
              role="toolbar"
              aria-label="Game management options"
            >
              <button
                className="tooltip p-2 border-r border-gray-300 flex justify-center items-center text-gray-600 hover:bg-cyan-100"
                aria-label="Edit game"
                data-tip="Edit"
                onClick={handleEditClick}
              >
                <LuPencil size={20} />
              </button>
              <button
                className="tooltip p-2 border-r border-gray-300 flex justify-center items-center text-gray-600 hover:bg-red-100"
                aria-label="Delete game"
                data-tip="Delete"
                onClick={handleDeleteClick}
              >
                <LuTrash2 size={20} aria-hidden="true" />
              </button>
              <button
                className="tooltip p-2 border-gray-300 flex justify-center items-center text-gray-600 hover:bg-gray-100"
                aria-label="View previous sessions"
                data-tip="Previous Sessions"
                onClick={handlePreviousSessionResults}
              >
                <LuClipboardPaste size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Game Mode Buttons */}
            {hasActiveSession ? (
              <div className="flex flex-col gap-4 w-full">
                {/* Go to Session button */}
                <Button
                  onClick={handleGoToSessionClick}
                  aria-label="Go to active game session"
                  className="w-full flex justify-center items-center"
                  icon={LuExternalLink} iconClass="text-2xl"
                  color='green'>
                  Go to Session
                </Button>
                <Button
                  onClick={onStopClick}
                  aria-label="Stop active game session"
                  className="w-full flex justify-center items-center"
                  icon={LuCircleStop} iconClass="text-2xl"
                  color='red'>
                  Stop
                </Button>
              </div>
            ) : (
              <Button
                onClick={handlePlayClick} aria-label="Play this game"
                icon={LuPlay} iconClass="text-2xl"
                color='blue'>
                Play
              </Button>
            )}
          </div>
        </div>
      </article>
    </>
  );
}

export default GameDashboardTile;
