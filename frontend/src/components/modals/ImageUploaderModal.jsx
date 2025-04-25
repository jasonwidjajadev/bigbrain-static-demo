import { useState } from "react";
import { LuUpload, LuX } from "react-icons/lu";

/**
* A modal component for uploading images
* 
* @param {Object} props - Component props
* @param {boolean} props.isOpen - Controls modal visibility
* @param {Function} props.onClose - Handler for closing the modal
* @param {Function} props.onImageSelect - Handler called when an image file is selected
* @returns {JSX.Element|null} A modal with file input for image uploading or null when closed
*/
const ImageUploaderModal = ({ isOpen, onClose, onImageSelect }) => {
  const [fileName, setFileName] = useState(null);

  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      onImageSelect(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Modal backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

      {/* Modal content */}
      <div className="bg-white rounded-lg w-full max-w-md mx-4 z-10">
        {/* Header */}
        <div className="bg-cyan-500 text-white text-center py-4 px-6 rounded-t-lg relative">
          <h2 className="text-2xl font-bold">Image Uploader</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
          >
            <LuX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex flex-col items-center justify-center gap-4">
            {/* File input */}
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Choose a file</span>
              </label>
              <input
                type="file"
                className="file-input file-input-bordered file-input-neutral w-full"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 w-full mt-4">
              <button className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-neutral"
                onClick={onClose}
                disabled={!fileName}
              >
                <LuUpload />
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploaderModal;
