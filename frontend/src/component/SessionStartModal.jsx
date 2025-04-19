import { useState, useEffect } from "react";
import { LuCopy, LuCopyCheck, LuX } from "react-icons/lu";
import { orangeButtonClass } from "./tailwind";

function SessionStartModal({
  isOpen,
  onClose,
  onContinue,
  sessionId,
  gameTitle,
}) {
  const [copied, setCopied] = useState(false);
  const sessionUrl = `${window.location.origin}/quiz/play/${sessionId}`;

  useEffect(() => {
    // Reset copied state when modal opens with new sessionId
    if (isOpen) {
      setCopied(false);
    }
  }, [isOpen, sessionId]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(sessionUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <LuX size={20} />
        </button>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Game Session Started!
          </h3>
          <p className="text-gray-600 mb-4">
            Share this link with players to join "{gameTitle}"
          </p>

          {/* Session URL display */}
          <div className="flex items-center mb-6 bg-gray-100 p-3 rounded-md">
            <div className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap mr-3 font-mono text-sm">
              {sessionUrl}
            </div>
            <button
              onClick={handleCopyToClipboard}
              className="flex items-center justify-center p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
              aria-label="Copy to clipboard"
            >
              {copied ? (
                <LuCopyCheck className="text-green-600" size={20} />
              ) : (
                <LuCopy size={20} />
              )}
            </button>
          </div>

          {/* Session ID display */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">Session ID:</p>
            <p className="text-xl font-mono font-bold tracking-wider">
              {sessionId}
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onContinue}
              className={`${orangeButtonClass} w-full`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionStartModal;
