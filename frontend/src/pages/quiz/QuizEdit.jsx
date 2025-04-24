import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TbLogout } from "react-icons/tb";
import { RiAddCircleLine } from "react-icons/ri";
import { LuSquarePlus } from "react-icons/lu";
import { IoReturnUpBackSharp } from "react-icons/io5";

import { useAuthContext } from "@/context/useAuthContext";
import { fetchGames, updateAllGames } from "@/util/gamesApi";

import LinkLogoNavBar from "@/components/logo/LogoNavBar";
import Button from '@/components/button/Button';

import EditGameInfoTile from "@/components/cards/EditGameInfoTile";
import EditQuizMetaDataModal from "@/components/modals/EditQuizMetaDataModal";
import QuestionInfoTile from "@/components/cards/QuestionInfoTile";

/**
 * @typedef {Object} Question
 * @property {number} id - Unique identifier for the question
 * @property {string} [text] - The question text
 * @property {number} [duration] - Time allowed for the question in seconds
 * @property {Array} [answers] - Possible answers for the question
 * @property {string} [image] - Optional image for the question, typically base64 encoded
 */

/**
 * @typedef {Object} Quiz
 * @property {number} id - Unique identifier for the quiz
 * @property {string} name - Display name of the quiz
 * @property {string} [description] - Description of the quiz
 * @property {Question[]} questions - Array of questions in the quiz
 * @property {string} [thumbnail] - Base64 encoded image for the quiz thumbnail
 * @property {Array} [oldSessions] - Array of previous quiz sessions
 * @property {string|null} [active] - ID of the active session, or null if no active session
 */

/**
 * @typedef {Object} Toast
 * @property {string} message - The message to display in the toast
 * @property {'success'|'error'} type - The type of toast, affecting its styling
 */

/**
 * AdminQuizEdit - Quiz editing interface component
 *
 * This component provides a comprehensive interface for editing an existing quiz.
 * It handles fetching quiz data, editing quiz metadata, and managing questions
 * (adding, editing, deleting). The component also provides feedback to the user
 * through toast notifications.
 *
 * The page is structured with:
 * - A navigation bar with links to home and quiz creation
 * - A main content section showing quiz metadata and allowing edits
 * - A questions section displaying all questions and allowing for management
 *
 * Authentication is required - unauthenticated users are redirected to the home page.
 *
 * @returns {JSX.Element} Rendered component
 */
function AdminQuizEdit() {
  const [allGames, setAllGames] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col font-sans bg-[#f7f7f7]">
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
          <Button
            to="/quiz/create" icon={RiAddCircleLine} iconClass="text-2xl"
            color='pink' data-testid="quiz-create-button-big-screen">
            Create
          </Button>
          <Button to="/auth/logout" icon={TbLogout} iconClass="text-2xl"
            color='pink' data-testid="logout-button-big-screen">
            Logout
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-start items-center text-center p-8">
        <div className="w-full xl:w-[90%]">
          <main className="flex flex-col items-center lg:flex-row lg:items-start lg:gap-10 text-center">
            <section className="w-full md:w-[80%] flex flex-col lg:flex-2">
              <div className="flex flex-row justify-between w-full mb-3 sm:mb-5 items-center">
                <Button to="/dashboard" color='pink' className="h-[45px] mr-3"
                  aria-label="Return to dashboard" title="Return to dashboard">
                  <IoReturnUpBackSharp size={30} />
                </Button>

                <h1 className="text-[44px] sm:text-5xl font-semibold text-pink-600 font-Nunito-ExtraBold whitespace-nowrap">
                  Quiz Edit
                </h1>
                <div className="w-[70px]"></div>
              </div>

              {/* Quiz editing UI */}
              {/* Quiz information tile */}
              {loading ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-600 py-10">
                  Loading quiz information...
                </div>
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
                </>
              ) : (
                <div>No quiz data found</div>
              )}
            </section>

            {/* TODO: Add number of questions heading here */}
            <section className="flex flex-col w-full md:w-[80%] lg:w-[65%] gap-4">
              <div className="lg:flex lg:flex-3 gap-2 mb-2">
                <Button
                  onClick={handleAddQuestion} aria-label="Play this game" className="h-[47px]"
                  icon={LuSquarePlus} iconClass="text-2xl"
                  color='pink'>
                  Add Question
                </Button>
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
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminQuizEdit;
