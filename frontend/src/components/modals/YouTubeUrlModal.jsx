import { useState } from "react";
import { LuLink, LuX } from "react-icons/lu";

/**
 * Modal component for attaching YouTube videos via URL
 * Follows the same pattern as ImageUploaderModal but for YouTube links
 */
const YouTubeUrlModal = ({ isOpen, onClose, onVideoSelect }) => {
  // State for the YouTube URL input
  const [youtubeUrl, setYoutubeUrl] = useState("");
  // State for validation errors
  const [validationError, setValidationError] = useState("");

  // Handle YouTube URL input changes
  const handleUrlChange = (e) => {
    setYoutubeUrl(e.target.value);
    setValidationError(""); // Clear any existing errors when input changes
  };

  // Validate YouTube URL format
  const validateYouTubeUrl = (url) => {
    // Various YouTube URL formats:
    // - https://www.youtube.com/watch?v=VIDEO_ID
    // - https://youtu.be/VIDEO_ID
    // - https://youtube.com/watch?v=VIDEO_ID
    // - www.youtube.com/watch?v=VIDEO_ID
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S*)?$/;
    return youtubeRegex.test(url);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!youtubeUrl) {
      setValidationError("Please enter a YouTube URL");
      return;
    }

    if (!validateYouTubeUrl(youtubeUrl)) {
      setValidationError("Please enter a valid YouTube URL");
      return;
    }

    // Call the parent component's callback with the URL and video ID
    onVideoSelect(youtubeUrl);

    // Reset the form
    setYoutubeUrl("");

    // Close the modal
    onClose();
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Modal container */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Add YouTube Video</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="mb-4">
            <label
              htmlFor="youtube-url"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              YouTube URL
            </label>
            <div className="flex items-center">
              <div className="flex-shrink-0 text-gray-400 mr-2">
                <LuLink size={18} />
              </div>
              <input
                type="text"
                id="youtube-url"
                className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={handleUrlChange}
              />
            </div>
            {validationError && (
              <p className="mt-1 text-sm text-red-600">{validationError}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2 mt-4 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              type="button"
            >
              Add Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeUrlModal;
