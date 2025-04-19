import { formatBase64Image } from "../util/imageUtils";
import {
  LuPencil,
  LuPlay,
  LuTrash2,
  LuClipboardPaste,
  LuCircleStop,
} from "react-icons/lu";
import { cyanButtonClass, redButtonClass } from "../component/tailwind";

function GameDashboardTile({
  game,
  onDelete,
  onEdit,
  onPreviousSessionResults,
  onPlay,
  onStop,
}) {
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

  return (
    <>
      <div className="w-full h-[400px] bg-white rounded-md border border-gray-300 overflow-hidden drop-shadow-md">
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
          <div className="absolute bottom-4 right-4 bg-black/60 text-white rounded px-2 py-1 text-sm flex items-center">
            <span className="mr-1">{game.questions.length}</span>
            <span>
              {game.questions.length === 1 ? "Question" : "Questions"}
            </span>
          </div>
        </div>

        {/* Game Info Section */}
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {game.name}
          </h2>

          <div className="flex items-center mt-2 text-gray-600 text-lg font-semibold">
            <LuPlay size={20} className="mr-1" />
            <span className="mr-1">{playCount}</span>
            <span>{playCount === 1 ? "Play" : "Plays"}</span>
          </div>

          {/* Action Buttons */}
          <div className="p-2 flex flex-col justify-end items-center gap-4">
            <div className="w-full border-t border-b border-gray-300 grid grid-cols-3">
              <div
                className="tooltip p-2 border-r border-gray-300 flex justify-center items-center text-gray-600 hover:bg-cyan-100"
                data-tip="Edit"
              >
                <button onClick={handleEditClick}>
                  <LuPencil size={20} />
                </button>
              </div>
              <div
                className="tooltip p-2 border-r border-gray-300 flex justify-center items-center text-gray-600 hover:bg-red-100"
                data-tip="Delete"
              >
                <button onClick={handleDeleteClick}>
                  <LuTrash2 size={20} />
                </button>
              </div>
              <div
                className="tooltip p-2 border-gray-300 flex justify-center items-center text-gray-600 hover:bg-gray-100"
                data-tip="Previous Sessions"
              >
                <button onClick={handlePreviousSessionResults}>
                  <LuClipboardPaste size={20} />
                </button>
              </div>
            </div>

            {/* Game Mode Buttons */}
            {hasActiveSession ? (
              <button
                className={`flex justify-center items-center ${redButtonClass}`}
                onClick={handleStopClick}
              >
                <LuCircleStop size={20} className="mr-2" />
                <span>Stop</span>
              </button>
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
