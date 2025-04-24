import { FaEdit } from "react-icons/fa";
import { LuSave } from "react-icons/lu";
import { cyanButtonWFullClass } from "@/components/ui/tailwind";

/**
 * Displays a quiz info card with thumbnail, name, description and action buttons
 *
 * @param {string} thumbnail - Base64 or URL for the quiz thumbnail image
 * @param {string} name - Quiz title, displays "Untitled Game" if not provided
 * @param {string} description - Quiz description, displays default text if not provided
 * @param {Function} onEditInfo - Callback when Edit Info button is clicked
 * @param {Function} onSaveQuiz - Callback when Save Quiz button is clicked
 * @returns {JSX.Element}
 */
function EditGameInfoTile({
  thumbnail,
  name,
  description,
  onEditInfo,
  onSaveQuiz,
}) {
  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      {/* Game preview card with image */}
      <div className="relative">
        {/* Thumbnail image */}
        <div className="h-44 bg-gray-200 overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={`${name} thumbnail`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <span className="text-gray-500">No thumbnail image</span>
            </div>
          )}
        </div>
      </div>

      {/* Game info section */}
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {name || "Untitled Game"}
          </h2>
          <p className="text-gray-600">{description || "Testing out a game"}</p>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onEditInfo}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded flex items-center"
          >
            <FaEdit className="mr-2" /> Edit Info
          </button>
        </div>

        {/* Save Set button */}
        <div className="mt-6">
          <button
            className={`${cyanButtonWFullClass} flex items-center justify-center gap-2`}
            onClick={onSaveQuiz}
          >
            <LuSave />
            Save Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditGameInfoTile;
