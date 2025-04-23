import { formatBase64Image } from "@/util/imageUtils";
import {
  LuPencil,
  LuPlay,
  LuTrash2,
  LuClipboardPaste,
  LuCircleStop,
  LuExternalLink,
} from "react-icons/lu";
import { cyanButtonClass, redButtonClass } from "@/components/ui/tailwind";

function GameDashboardTile({
  game,
  onDelete,
  onEdit,
  onPreviousSessionResults,
  onPlay,
  onStop,
  onGoToSession,
}) {
  console.log("Game is", game);
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
      <div
        className="w-full h-[400px] bg-white rounded-md border border-gray-300 overflow-hidden shadow-md
        hover:scale-105 hover:shadow-lg transition duration-300"
      >
        {/* Thumbnail section */}
        <div className="w-full h-[180px] bg-gray-300 relative">
          {game.thumbnail && (
            <img
              src={formatBase64Image(game.thumbnail)}
              alt={game.title || "Game thumbnail"}
              className="w-full h-full object-cover"
              // TODO: handle default thumbnail
            />
          )}
          {/* Questions Badge Overlay */}
          <div className="absolute bottom-4 left-4 bg-black/60 text-white rounded px-2 py-1 text-sm flex items-center">
            <span className="mr-1">{calculateDuration()}</span>
            <span>
              {/* {game.questions.length === 1 ? "Question" : "Questions"} */}
            </span>
          </div>

          {/* Duration Badge Overlay */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white rounded px-2 py-1 text-sm flex items-center">
            <span className="mr-1">{game.questions.length}</span>
            <span>
              {game.questions.length === 1 ? "Question" : "Questions"}
            </span>
          </div>
        </div>

        {/* Game Info Section */}
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">
            {game.name}
          </h2>

          <div className="flex items-center mt-2 text-gray-600 text-lg font-semibold">
            <LuPlay size={20} className="mr-1" />
            <span className="mr-1">{playCount}</span>
            <span>{playCount === 1 ? "Play" : "Plays"}</span>
          </div>

          {/* Action Buttons */}
          <div className="p-2 flex flex-col justify-end items-center gap-4">
            <div
              className={`w-full border-t border-b border-gray-300 grid grid-cols-3 ${hasActiveSession ? "hidden" : ""}`}
            >
              <div
                className="tooltip p-2 border-r border-gray-300 flex justify-center items-center text-gray-600 hover:bg-cyan-100"
                data-tip="Edit"
                onClick={handleEditClick}
              >
                <button>
                  <LuPencil size={20} />
                </button>
              </div>
              <div
                className="tooltip p-2 border-r border-gray-300 flex justify-center items-center text-gray-600 hover:bg-red-100"
                data-tip="Delete"
                onClick={handleDeleteClick}
              >
                <button>
                  <LuTrash2 size={20} />
                </button>
              </div>
              <div
                className="tooltip p-2 border-gray-300 flex justify-center items-center text-gray-600 hover:bg-gray-100"
                data-tip="Previous Sessions"
                onClick={handlePreviousSessionResults}
              >
                <button>
                  <LuClipboardPaste size={20} />
                </button>
              </div>
            </div>

            {/* Game Mode Buttons */}
            {hasActiveSession ? (
              <div className="flex flex-col gap-4">
                {/* Go to Session button */}
                <button
                  className={`flex justify-center items-center ${cyanButtonClass}`}
                  onClick={handleGoToSessionClick}
                >
                  <LuExternalLink size={20} className="mr-2" />
                  <span>Go to Session</span>
                </button>

                {/* Stop Session button */}
                <button
                  className={`flex justify-center items-center ${redButtonClass}`}
                  onClick={handleStopClick}
                >
                  <LuCircleStop size={20} className="mr-2" />
                  <span>Stop</span>
                </button>
              </div>
            ) : (
              <button
                className={`flex justify-center items-center ${cyanButtonClass}`}
                onClick={handlePlayClick}
              >
                <LuPlay size={20} className="mr-2" />
                <span>Play</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default GameDashboardTile;
