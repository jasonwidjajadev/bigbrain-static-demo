import { Link } from "react-router-dom";

function QuizEndedModal({ isOpen, onClose, sessionId }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md px-6 py-8 text-center">
        <h3 className="text-2xl font-bold mb-2">The Quiz has ended early!</h3>
        <p className="mb-10">Would you like to view the results?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 text-black font-bold no-underline
              shadow-[0_4px_0_0_#6b7283] transition-all duration-300 ease-in-out
              hover:bg-gray-200 hover:-translate-y-1 w-[125px]"
          >
            Close
          </button>
          <Link
            to={`/host/${sessionId}`}
            className="px-4 py-2 rounded-md bg-green-500 text-white font-bold no-underline
              shadow-[0_4px_0_0_#166534] transition-all duration-300 ease-in-out
              hover:bg-green-400 hover:-translate-y-1"
          >
            View Results
          </Link>
        </div>
      </div>
    </div>
  );
}

export default QuizEndedModal;
