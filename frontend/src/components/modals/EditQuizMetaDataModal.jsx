import { useState, useEffect } from "react";
import { convertFileToBase64 } from "@/util/imageUtils";
import ImgSelection from "@/components/modals/ImgSelection";

/**
 * Modal for editing quiz metadata including title, description, and thumbnail
 *
 * @param {Object} props - Component props
 * @param {Object} props.quiz - The quiz object containing metadata to edit
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Handler for closing the modal
 * @param {Function} props.onSave - Handler for saving the updated quiz data
 * @returns {JSX.Element|null} A modal form with fields for editing quiz metadata or null when closed
 */
function EditQuizMetaDataModal({ quiz, isOpen, onClose, onSave }) {

  // State of Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize form data when modal opens and quiz prop changes
  useEffect(() => {
    if (quiz) {
      setFormData({
        title: quiz.name,
        description: quiz.description || "",
        image: null, // Initially null since we already have the thumbnail
      });
      setHasChanges(false);
    }
  }, [quiz, isOpen]);

  // Update any form field
  const handleChange = (e) => {
    const updatedFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };

    setFormData(updatedFormData);

    // Check if there are changes compared to the original quiz
    const hasFormChanges =
      updatedFormData.title !== quiz.name ||
      updatedFormData.description !== quiz.description ||
      updatedFormData.image !== null;

    setHasChanges(hasFormChanges);
  };

  // Handles image change
  const handleImgChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
      setHasChanges(true);
    }
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasChanges) {
      onClose();
      return;
    }

    setLoading(true);

    try {
      // Prepare updated quiz data
      const updatedQuiz = { ...quiz };

      // Update properties that changed
      updatedQuiz.name = formData.title;
      updatedQuiz.description = formData.description;

      // Only process image if a new one was uploaded
      if (formData.image) {
        try {
          const base64Img = await convertFileToBase64(formData.image);
          updatedQuiz.thumbnail = base64Img;
        } catch (imgError) {
          console.error("Failed to convert image:", imgError);
        }
      }
      // Save changes
      await onSave(updatedQuiz);
      onClose();
    } catch (error) {
      console.error("Error updating quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-pink-600">
            Edit Quiz Information
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Image Selection */}
          <div className="mb-4">
            <p className="text-gray-700 text-sm mb-2">Current thumbnail:</p>
            <div className="flex justify-center mb-2">
              {quiz.thumbnail ? (
                <img
                  src={quiz.thumbnail}
                  alt="Quiz thumbnail"
                  className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                />
              ) : (
                <div className="h-32 w-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>
            <ImgSelection handleImgChange={handleImgChange} />
          </div>

          {/* Title Field */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-1"
            >
              Title <span className="text-gray-500">(required)</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Quiz title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description Field */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Quiz description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!hasChanges || loading}
              className={`px-4 py-2 bg-pink-600 text-white rounded-lg ${
                hasChanges && !loading
                  ? "hover:bg-pink-400"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditQuizMetaDataModal;
