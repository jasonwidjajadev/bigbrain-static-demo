import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { TbArrowsShuffle } from "react-icons/tb";

function QuestionInfoTile({ question, index, onEdit, onDelete }) {
  return (
    <div className="w-full bg-white rounded-md shadow-md mb-4 overflow-hidden">
      <div className="flex flex-col">
        {/* Question header with number and edit button */}
        <div className="flex justify-between items-center bg-gray-300 p-3 px-4">
          <h3 className="text-lg font-semibold">Question {index + 1}</h3>
          <button
            onClick={() => onEdit && onEdit(question.id)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white py-1 px-3 rounded-md flex items-center gap-1"
          >
            <FaEdit /> Edit
          </button>
        </div>

        {/* Question content */}
        <div className="p-3 px-6 flex justify-start">
          <p className="text-lg text-gray-800">
            {question.text || "How tall am I?"}
          </p>
        </div>

        {/* Footer with buttons */}
        <div className="flex justify-between items-center p-3 px-4 border-t border-gray-200">
          <div>
            <button
              onClick={() => onDelete && onDelete(question.id)}
              className="p-2 text-gray-500 hover:text-red-500"
              title="Delete question"
            >
              <FaTrash />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <TbArrowsShuffle className="text-gray-500" />
            <span className="bg-gray-700 text-white px-2 py-1 rounded text-sm">
              {question.duration || 20} sec
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionInfoTile;
