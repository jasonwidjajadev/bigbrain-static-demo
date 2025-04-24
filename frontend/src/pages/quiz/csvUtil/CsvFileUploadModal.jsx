import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { LuUpload } from "react-icons/lu";
// import { orangeButtonClass } from "@/components/ui/tailwind";
import Button from '@/components/button/Button';

function CsvFileUploadModal({ isOpen, onClose, onFileUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    setError("");

    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // Check if the file is a CSV file
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please select a CSV file.");
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    onFileUpload(selectedFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6 sm:px-0">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Import Quiz Data
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
            title="Close"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        <div className="form-control w-full max-w-xs mx-auto mb-4">
          <label htmlFor="csv-file-selector" className="label">
            <span className="label-text">Upload CSV file</span>
          </label>
          <input
            id="csv-file-selector"
            type="file"
            accept=".csv"
            className="file-input file-input-bordered w-full max-w-xs"
            onChange={handleFileSelect}
          />
          <label className="label">
            <span className="label-text-alt text-gray-500 text-wrap">
              Only CSV files following the BigBrain template format
            </span>
          </label>
        </div>

        {selectedFile && (
          <div className="alert alert-success mb-4">
            <div className="flex items-center gap-2">
              <LuUpload />
              <span>Selected: {selectedFile.name}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button onClick={onClose} color='gray'>
            Cancel
          </Button>
          <Button id="csv-import" onClick={handleSubmit}
            color='purple'  disabled={!selectedFile}>
            Import
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CsvFileUploadModal;
