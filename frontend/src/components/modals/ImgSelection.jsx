import { useState } from "react";
import { LuUpload } from "react-icons/lu";

/**
* Image selection component with file upload functionality
*
* @param {Object} props - Component props
* @param {Function} props.handleImgChange - Handler function called when an image is selected
* @returns {JSX.Element} A UI component for selecting and uploading images
*/
const ImgSelection = ({ handleImgChange }) => {
  const [fileName, setFileName] = useState(null);

  // Handle file selection and update filename
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      handleImgChange(e);
    }
  };

  return (
    <>
      <div className="bg-white w-full border border-gray-500 border-dashed
        drop-shadow-md/25 rounded-lg p-8 mb-6 flex flex-col items-center justify-center  transition-colors">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          Cover Image
        </h2>
        {/* <p className="text-gray-600 mb-4">Drag and Drop or</p> */}

        {/* Show file name if available */}
        {/* TODO: Update to show image as preview*/}
        {fileName && (
          <p className="mb-4 text-sm text-gray-600">File name: {fileName}</p>
        )}

        <div className="flex space-x-4">
          {/* TODO: use image uploader if we have time for bonus */}
          {/* <button className="flex items-center px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
            <LuImage className="w-5 h-5 mr-2" />
            <span>Image Gallery</span>
          </button> */}
          <label className="flex items-center px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors cursor-pointer">
            <LuUpload className="w-5 h-5 mr-2" alt="Upload via a file icon" />
            <span>{fileName ? "Change Image" : "Upload a File"}</span>
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*"
            />
          </label>

          {/* <button className="flex items-center px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
            <LuLink className="w-5 h-5 mr-2" alt="Upload via a URL icon" />
            <span>Upload by URL</span>
          </button> */}
        </div>
      </div>
    </>
  );
};

export default ImgSelection;
