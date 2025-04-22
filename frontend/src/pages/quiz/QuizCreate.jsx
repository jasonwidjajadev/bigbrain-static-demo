import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/useAuthContext";

import { fetchGames, updateAllGames } from "@/util/gamesApi";
import { convertFileToBase64 } from "@/util/imageUtils";
import { LuUpload } from "react-icons/lu";

import LinkLogoNavBar from "@/components/logo/LogoNavBar";
import { orangeButtonClass, purpleButtonClass } from "@/components/ui/tailwind";
import ImgSelection from "@/components/modals/ImgSelection";

import CsvFileUploadModal from "./csvUtil/CsvFileUploadModal";
import { parseBigBrainCSV } from "./csvUtil/csvUtils";

function AdminQuizCreate() {
  // State of Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);

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

  //TODO logic
  // Update any form field
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handles image change (passed to ImgSelection component)
  const handleImgChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files[0]);
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    try {
      const gamesData = await fetchGames(token);
      console.log("Games data is", gamesData);

      // Turn the image into base64
      let base64Img = null;
      if (formData.image) {
        try {
          // Use the new async function here
          base64Img = await convertFileToBase64(formData.image);
          // If you only want the base64 string without the data URL prefix:
          // base64Img = await convertFileToBase64(formData.image, true);
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
      // TODO: Update this to be edit page when we have an edit page
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
      // Set error state or show error message
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
          <Link to="/auth/logout" className={`${orangeButtonClass} px-5`}>
            Log out
          </Link>
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
        <div className="flex-1 flex flex-col justify-start items-center text-center p-8">
          <h1 className="text-4xl font-semibold text-orange-500 font-Nunito-Black mb-4">
            Create Quiz
          </h1>
          {/* Quiz creation UI can go here */}
          <form
            onSubmit={handleSubmit}
            className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%]"
          >
            {/* Pass the image handler to the child component */}
            <ImgSelection handleImgChange={handleImgChange} />
            <div className="w-full flex flex-col bg-white border-gray-500 drop-shadow-md/25 rounded-lg p-8 mb-6 items-center justify-center transition-colors">
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

              {/* CSV upload Button */}
              <button
                type="button"
                onClick={handleCSVUpload}
                className={`${purpleButtonClass} flex items-center gap-1 px-5`}
              >
                <LuUpload /> CSV Import
              </button>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-orange-500 text-white font-semibold rounded-lg shadow-[0_4px_0_0_#c2410c] hover:bg-orange-400 hover:-translate-y-1 transition-all duration-300 ease-in-out"
                >
                  Create Quiz
                </button>
              </div>
            </div>
          </form>
          {/* File Upload Modal */}
          <CsvFileUploadModal
            isOpen={isFileUploadModalOpen}
            onClose={() => setIsFileUploadModalOpen(false)}
            onFileUpload={handleFileUpload}
          />
        </div>
      </div>
    </>
  );
}

export default AdminQuizCreate;
