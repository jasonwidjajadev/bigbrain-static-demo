import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext";
import LogoNavBar from "../component/LogoNavBar";
import { fetchGames } from "../util/gamesApi";
import { orangeButtonClass } from "../component/tailwind";
import { RiAddCircleLine } from "react-icons/ri";
import { LuSquarePlus } from "react-icons/lu";
import EditGameInfoTile from "../component/EditGameInfoTile";

function AdminQuizEdit() {
  const [allGames, setAllGames] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        setCurrentQuiz(quiz);
      } else {
        setError("Quiz not found");
        navigate("/dashboard"); // Redirect if quiz doesn't exist
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      setError("Failed to load quiz. Please try again later.");
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
        game.id === quizId ? updatedQuiz : game
      );

      // Send the entire updated games array back to the server
      await updateAllGames({ games: updatedGames }, token);
      setAllGames(updatedGames);
      setCurrentQuiz(updatedQuiz);

      // Optional: Show success message
      console.log("Quiz successfully updated");
    } catch (error) {
      console.error("Error updating quiz:", error);
      setError("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    console.log();
  };

  //TODO logic
  const handleAddQuestion = () => {
    console.log("Add question button clicked for game id: ", quizId);
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px]">
        <Link
          to="/home"
          className="text-orange-500 text-3xl font-bold no-underline"
        >
          <LogoNavBar />
        </Link>
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
      <div className="flex-1 flex flex-col justify-start items-center text-center p-8">
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
          <EditGameInfoTile
            thumbnail={currentQuiz.thumbnail}
            name={currentQuiz.name}
            description={currentQuiz.description}
          />
        ) : (
          <div>No quiz data found</div>
        )}
        {/* Add question button */}
        <div className="flex w-full ">
          <button
            onClick={handleAddQuestion}
            className={`${orangeButtonClass} flex items-center gap-1 px-5`}
          >
            <LuSquarePlus /> Add Question
          </button>
        </div>
      </div>
    </div>
  );
}
export default AdminQuizEdit;
