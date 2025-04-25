import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/useAuthContext";
import { IoReturnUpBackSharp } from "react-icons/io5";

import { fetchGames, updateAllGames } from "@/util/gamesApi";
import { convertFileToBase64, formatBase64Image } from "@/util/imageUtils";
import { LuUpload } from "react-icons/lu";

import LinkLogoNavBar from "@/components/logo/LogoNavBar";
import ImgSelection from "@/components/modals/ImgSelection";

import CsvFileUploadModal from "./csvUtil/CsvFileUploadModal";
import { parseBigBrainCSV } from "./csvUtil/csvUtils";
import Button from "@/components/button/Button";
import { TbLogout } from "react-icons/tb";

/**
 * Renders a quiz creation form with options to manually create or import via CSV
 *
 * @param {Object} props - Component props (No explicit props passed)
 * @returns {React.ReactElement} Quiz creation interface
 */
function AdminQuizCreate() {
  // State of Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const { token, email } = useAuthContext();

  React.useEffect(() => {
    if (!token) navigate("/home");
  }, [token, navigate]);

  // Auto-hide toast after 3 seconds
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Function to show toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Update any form field
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handles image change
  const handleImgChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        const fileType = file.type;
        const fileName = file.name.toLowerCase();
        const base64 = await convertFileToBase64(file, true);

        // Detect if this is an SVG file
        const isSvg = fileType === "image/svg+xml" || fileName.endsWith(".svg");

        // Update form data with image file
        setFormData({
          ...formData,
          image: file,
        });

        // Set preview image with the correct MIME type
        const mimeType = isSvg ? "image/svg+xml" : "image/jpeg";
        setPreviewImage(formatBase64Image(base64, mimeType));
      } catch (err) {
        console.error("Error converting image:", err);
        showToast("Failed to process image", "error");
      }
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null,
    });
    setPreviewImage(null);
    showToast("Image removed", "success");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gamesData = await fetchGames(token);
      console.log("Games data is", gamesData);

      // Turn the image into base64
      let base64Img = null;
      if (formData.image) {
        try {
          // Use the new async function here
          base64Img = await convertFileToBase64(formData.image);
        } catch (imgError) {
          console.error("Failed to convert image:", imgError);
        }
      }

      // Create new game
      const newGameId = Date.now();
      const newGame = {
        id: newGameId,
        owner: email,
        name: formData.title,
        questions: [],
        thumbnail: base64Img,
        description: formData.description,
        active: null,
        oldSessions: [],
      };

      // Append new game to current game data
      const updatedGames = [...gamesData, newGame];
      const updatedGamesObj = { games: updatedGames };

      // Put updated games data back to the database
      const updateResult = await updateAllGames(updatedGamesObj, token);
      if (updateResult.error) {
        throw new Error(updateResult.error);
      }

      // Success! Navigate to the dashboard
      console.log("Quiz created successfully!");
      navigate(`/dashboard`);

      // Reset the form
      setFormData({
        title: "",
        description: "",
        image: null,
      });

      // Put updated games data back to the database
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const handleCSVUpload = () => {
    setIsFileUploadModalOpen(true);
  };

  const handleFileUpload = async (file) => {
    try {
      // Parse the CSV file (values will include title and description now)
      const parsedData = await parseBigBrainCSV(file);

      // Verify questions were found
      if (!parsedData.questions || parsedData.questions.length === 0) {
        throw new Error("No valid questions found in the CSV file");
      }

      // Update form data with the title and description from CSV
      setFormData({
        ...formData,
        title: parsedData.name,
        description: parsedData.description,
      });

      // Create new game with data from CSV
      const gamesData = await fetchGames(token);

      // Create new game
      const newGameId = Date.now();
      const newGame = {
        id: newGameId,
        owner: email,
        name: parsedData.name,
        questions: parsedData.questions,
        thumbnail: "", // Default empty thumbnail
        description: parsedData.description,
        active: null,
        oldSessions: [],
      };

      // Append new game to current game data
      const updatedGames = [...gamesData, newGame];
      const updatedGamesObj = { games: updatedGames };

      // Put updated games data back to the database
      const updateResult = await updateAllGames(updatedGamesObj, token);
      if (updateResult.error) {
        throw new Error(updateResult.error);
      }

      // Show success message
      showToast(`Game "${parsedData.name}" successfully uploaded!`, "success");

      // Navigate to dashboard after short delay
      navigate("/dashboard");
    } catch (error) {
      console.error("Error processing CSV file:", error);
      showToast(error.message || "Error processing CSV file", "error");
    }
  };

  return (
    <>
      <div className="min-h-screen overflow-y-auto flex flex-col font-sans">
        {/* Navbar */}
        <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px]">
          <LinkLogoNavBar targetPath="/home" />
          <Button
            to="/auth/logout"
            icon={TbLogout}
            iconClass="text-2xl"
            color="pink"
            data-testid="logout-button-big-screen"
          >
            Logout
          </Button>
        </nav>

        {/* Toast notifications */}
        {toast && (
          <div className="toast toast-top toast-center z-50">
            <div
              className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"}`}
            >
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        {/* Quiz creation UI can go here */}
        <main className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-[#f7f7f7]">
          <div className="flex flex-row justify-between w-full sm:w-[80%] md:w-[60%] lg:w-[50%] items-center mb-3 sm:mb-5">
            <Button
              to="/dashboard"
              color="pink"
              className="h-[45px]"
              aria-label="Return to dashboard"
              title="Return to dashboard"
            >
              <IoReturnUpBackSharp size={30} />
            </Button>

            <h1 className="text-[44px] sm:text-5xl font-semibold text-pink-600 font-Nunito-ExtraBold">
              Create Quiz
            </h1>
            <div className="w-[70px] hidden [@media(min-width:500px)]:block"></div>
          </div>

          {/* Quiz creation UI */}
          <form
            onSubmit={handleSubmit}
            className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%]"
          >
            {/* Image Selection Section */}
            <div className="w-full flex flex-col bg-white border border-gray-200 drop-shadow-md/25 rounded-lg p-6 mb-6">
              <h2 className="text-gray-700 text-xl font-medium mb-4 text-left">
                Quiz Image
              </h2>

              <div className="flex flex-col">
                {previewImage ? (
                  <div className="flex flex-col justify-center mt-2 border rounded p-2 w-full">
                    <img
                      src={previewImage}
                      alt="Quiz thumbnail"
                      className="max-w-full h-auto max-h-48 object-contain"
                    />
                    <button
                      type="button"
                      className="text-xs text-red-600 mt-1"
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <ImgSelection handleImgChange={handleImgChange} />
                )}
              </div>
            </div>
            <div
              className="w-full flex flex-col bg-white border border-gray-200 drop-shadow-md/25
              rounded-lg p-8 mb-6 items-center justify-center transition-colors"
            >
              {/* Title Field */}
              <div className="mb-6 w-full">
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="title"
                    className="text-gray-700 text-2xl font-medium text-left"
                  >
                    Title <span className="text-gray-500">(required)</span>
                  </label>
                </div>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Add a descriptive title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  required
                />
              </div>

              {/* Description Field */}
              <div className="mb-6 w-full">
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="description"
                    className="text-gray-700 text-lg font-medium text-left"
                  >
                    Description
                  </label>
                </div>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell users about your question set"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-y"
                />
              </div>
              <div className="flex flex-row gap-5 w-full justify-center items-center">
                {/* CSV upload Button */}
                <Button
                  color="purple"
                  icon={LuUpload}
                  iconClass="shrink-0 hidden sm:block"
                  onClick={handleCSVUpload}
                  className="h-[45px]"
                >
                  CSV Import
                </Button>

                {/* Submit Button */}
                <div>
                  <Button type="submit" color="pink">
                    Create <span className="hidden sm:block">Quiz</span>
                  </Button>
                </div>
              </div>
            </div>
          </form>
          {/* File Upload Modal */}
          <CsvFileUploadModal
            isOpen={isFileUploadModalOpen}
            onClose={() => setIsFileUploadModalOpen(false)}
            onFileUpload={handleFileUpload}
          />
        </main>
      </div>
    </>
  );
}

export default AdminQuizCreate;
