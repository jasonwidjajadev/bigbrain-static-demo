import { formatBase64Image } from "../util/imageUtils";
import { LuPlay } from "react-icons/lu";

function GameDashboardTile({ game }) {
  console.log("Individual game data is: ", game);
  console.log("Title is", game.name);
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
          <h2 className="text-xl font-semibold text-gray-800">{game.name}</h2>

          <div className="flex items-center mt-2 text-gray-600">
            <LuPlay size={16} className="mr-1" />
            <span className="mr-1">{game.playCount || 1}</span>
            <span>Play</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default GameDashboardTile;
