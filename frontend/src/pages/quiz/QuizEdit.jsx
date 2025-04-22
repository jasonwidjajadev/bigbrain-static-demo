import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiAddCircleLine } from "react-icons/ri";
import { LuSquarePlus, LuUpload } from "react-icons/lu";

import { useAuthContext } from "@/context/useAuthContext";
import { fetchGames, updateAllGames } from "@/util/gamesApi";

import LinkLogoNavBar from "@/components/logo/LogoNavBar";

import { orangeButtonClass, purpleButtonClass } from "@/components/ui/tailwind";

import EditGameInfoTile from "@/components/cards/EditGameInfoTile";
import EditQuizMetaDataModal from "@/components/modals/EditQuizMetaDataModal";
import QuestionInfoTile from "@/components/cards/QuestionInfoTile";

import CsvFileUploadModal from "./csvUtil/CsvFileUploadModal";
import { parseBigBrainCSV } from "./csvUtil/csvUtils";

function AdminQuizEdit() {
  const [allGames, setAllGames] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const { token } = useAuthContext();
  // Extract gameId from URL parameters
  const { quizId } = useParams();
  const quizIdInt = parseInt(quizId);

  React.useEffect(() => {
    if (!token) navigate("/home");
    else {
      // Fetch the specific quiz
      fetchQuizData();
    }
  }, [token, quizId, navigate]);

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

  // Functions to handle pull and pushing to the backend
  const fetchQuizData = async () => {
    try {
      setLoading(true);
      setError(null);
      const gamesData = await fetchGames(token);
      setAllGames(gamesData || []);

      // Find the specific quiz by ID
      const quiz = gamesData.find((game) => game.id === quizIdInt);
      if (quiz) {
        console.log("Current quiz is:", quiz);
        setCurrentQuiz(quiz);
      } else {
        setError("Quiz not found");
        navigate("/dashboard"); // Redirect if quiz doesn't exist
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      setError("Failed to load quiz. Please try again later.");
      showToast("Failed to load quiz. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Function to save changes
  const saveQuizChanges = async (updatedQuiz) => {
    try {
      setLoading(true);
      // Update the quiz in the allGames array
      const updatedGames = allGames.map((game) =>
        game.id === quizIdInt ? updatedQuiz : game
      );

      // Send the entire updated games array back to the server
      await updateAllGames({ games: updatedGames }, token);
      setAllGames(updatedGames);
      setCurrentQuiz(updatedQuiz);

      // Show success message as toast
      showToast("Quiz successfully updated", "success");
      console.log("Quiz successfully updated");
    } catch (error) {
      console.error("Error updating quiz:", error);
      setError("Failed to save changes. Please try again.");
      showToast("Failed to save changes. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    console.log("Edit information button clicked for game id: ", quizId);
    setIsEditModalOpen(true);
  };

  const handleOverallQuizSave = async () => {
    console.log("Save information button clicked for game id: ", quizId);

    await saveQuizChanges(currentQuiz);
    navigate("/dashboard");
  };

  const handleAddQuestion = () => {
    console.log("Add question button clicked for game id: ", quizId);
    // Navigate to the new question editor route with 'new' as the question ID
    navigate(`/quiz/edit/${quizId}/new`);
  };

  const handleEditQuestion = (questionId) => {
    // Navigate to the question editor with the specific question ID
    navigate(`/quiz/edit/${quizId}/${questionId}`);
  };

  const handleDeleteQuestion = async (questionId) => {
    // Create an updated quiz with the question filtered out
    const updatedQuiz = {
      ...currentQuiz,
      questions: currentQuiz.questions.filter(
        (question) => question.id !== questionId
      ),
    };

    try {
      // Show loading state
      setLoading(true);

      // Save the updated quiz
      await saveQuizChanges(updatedQuiz);

      // Show success toast
      showToast(`Question successfully deleted`, "success");
    } catch (error) {
      console.error("Error deleting question:", error);
      showToast("Failed to delete question. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCSVUpload = () => {
    setIsFileUploadModalOpen(true);
  };

  const handleFileUpload = async (file) => {
    try {
      // Parse the CSV file (values for name/description are ignored)
      const parsedData = await parseBigBrainCSV(file, "Temp", "Temp");

      // Verify questions were found
      if (!parsedData.questions || parsedData.questions.length === 0) {
        throw new Error("No valid questions found in the CSV file");
      }

      // Generate new IDs for imported questions
      let nextId = 1;
      if (currentQuiz.questions && currentQuiz.questions.length > 0) {
        const maxId = Math.max(
          ...currentQuiz.questions.map((q) =>
            typeof q.id === "number" ? q.id : 0
          )
        );
        nextId = maxId + 1;
      }

      // Assign new IDs to imported questions
      const newQuestions = parsedData.questions.map((question) => ({
        ...question,
        id: nextId++,
      }));

      // Create updated quiz with ONLY questions added
      const updatedQuiz = {
        ...currentQuiz, // Keep ALL existing properties
        questions: [
          ...(currentQuiz.questions || []), // Keep existing questions
          ...newQuestions, // Add new questions
        ],
      };

      // Update the quiz
      await saveQuizChanges(updatedQuiz);

      // Notify the user with toast
      showToast(
        `Successfully imported ${newQuestions.length} questions!`,
        "success"
      );
    } catch (error) {
      console.error("Error processing CSV file:", error);
      alert(error.message || "Error processing CSV file. Please try again.");
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col font-sans">
      {/* Toast notifications */}
      {toast && (
        <div className="toast toast-center z-50">
          <div
            className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"}`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px]">
        <LinkLogoNavBar targetPath="/home" />
        <div className="flex gap-3 items-center">
          <Link
            to="/quiz/create"
            className={`${orangeButtonClass} flex items-center gap-2`}
          >
            <RiAddCircleLine className="text-2xl" /> Create
          </Link>
          <Link to="/auth/logout" className={`${orangeButtonClass} px-5`}>
            Log out
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-start lg:flex-row lg:items-start lg:gap-10 text-center p-8">
        <div className="w-full md:w-[80%] flex flex-col lg:flex-2">
          <h1 className="text-4xl font-semibold text-orange-500 font-Nunito-Black mb-4">
            Quiz Edit
          </h1>
          {/* Quiz editing UI */}
          {/* Quiz information tile */}
          {loading ? (
            <div>Loading quiz information...</div>
          ) : error ? (
            <div>{error}</div>
          ) : currentQuiz ? (
            <>
              <EditGameInfoTile
                thumbnail={currentQuiz.thumbnail}
                name={currentQuiz.name}
                description={currentQuiz.description}
                onEditInfo={handleEditClick}
                onSaveQuiz={handleOverallQuizSave}
              />

              {/* Edit Quiz Modal */}
              <EditQuizMetaDataModal
                quiz={currentQuiz}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={saveQuizChanges}
              />

              {/* File Upload Modal */}
              <CsvFileUploadModal
                isOpen={isFileUploadModalOpen}
                onClose={() => setIsFileUploadModalOpen(false)}
                onFileUpload={handleFileUpload}
              />
            </>
          ) : (
            <div>No quiz data found</div>
          )}
        </div>
        {/* Add question button */}
        {/* TODO: Add number of questions heading here */}
        <div className="flex flex-col w-full md:w-[80%] lg:w-[65%] gap-4">
          <div className="lg:flex lg:flex-3 ">
            <div className="flex w-full justify-between">
              <button
                onClick={handleCSVUpload}
                className={`${purpleButtonClass} flex items-center gap-1 px-5`}
              >
                <LuUpload /> CSV Import
              </button>

              <button
                onClick={handleAddQuestion}
                className={`${orangeButtonClass} flex items-center gap-1 px-5`}
              >
                <LuSquarePlus /> Add Question
              </button>
            </div>
          </div>

          {/* Display questions for current quiz */}
          {!loading &&
            currentQuiz &&
            currentQuiz.questions &&
            currentQuiz.questions.map((question, index) => (
              <QuestionInfoTile
                key={question.id || index}
                question={question}
                index={index}
                onEdit={() => handleEditQuestion(question.id)}
                onDelete={() => handleDeleteQuestion(question.id)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
export default AdminQuizEdit;
