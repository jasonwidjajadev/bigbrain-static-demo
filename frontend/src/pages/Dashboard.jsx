import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext";
import LogoNavBar from "../component/LogoNavBar";
import { RiAddCircleLine } from "react-icons/ri";
import { orangeButtonClass } from "../component/tailwind";
import {
  fetchGames,
  updateAllGames,
  createGameSession,
} from "../util/gamesApi";
import GameDashboardTile from "../component/GameDashboardTile";
import DeleteConfirmationModal from "../component/DeleteConfirmationModal";
import SessionStartModal from "../component/SessionStartModal";

function Dashboard() {
  /*
  TODO:
  - Figure out how to display title and description if they
    are very long
  - Get the game thumbnail to display
  */
  const navigate = useNavigate();
  const { token, email } = useAuthContext();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [error, setError] = useState(null);

  // State for session management
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [activeSessionData, setActiveSessionData] = useState(null);

  React.useEffect(() => {
    console.log("Initial token:", token);
    console.log("Initial email:", email);
    if (!token) {
      navigate("/home");
    } else {
      // If we are logged in, fetch the games and display them
      getGamesToDisplay();
    }
  }, [token, navigate]);

  // Effect to log gameToDelete state changes
  React.useEffect(() => {
    console.log("Updated gameToDelete state:", gameToDelete);
  }, [gameToDelete]);

  const getGamesToDisplay = async () => {
    try {
      setLoading(true);
      setError(null);
      const gamesData = await fetchGames(token);
      setGames(gamesData || []);
    } catch (error) {
      console.error("Error fetching games:", error);
      setError("Failed to load games. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for delete button click from a GameDashboardTile
  const handleDeleteClick = (quizId, gameName) => {
    const game = games.find((g) => g.id === quizId);
    if (game) {
      setGameToDelete({
        id: quizId,
        name: gameName || game.name,
      });
      setIsDeleteModalOpen(true);
    }
  };

  // Handler for confirming deletion
  const handleConfirmDelete = async () => {
    if (gameToDelete) {
      try {
        // Delete logic
        const updatedGames = games.filter((g) => g.id !== gameToDelete.id);
        setGames(updatedGames);

        // Close the modal
        setIsDeleteModalOpen(false);
        setGameToDelete(null);

        // Update the backend
        await updateAllGames({ games: updatedGames }, token);

        // Optional: Show success notification
        console.log(`Successfully deleted game: ${gameToDelete.name}`);
      } catch (error) {
        // Handle error case - you might want to show an error message
        console.error("Failed to delete game:", error);
        // Reload games to sync the backend
        getGamesToDisplay();
      }
    }
  };

  // Handler for edit button click
  const handleEditClick = (quizId) => {
    console.log("Edit game with ID:", quizId);
    // Navigate to edit page
    navigate(`/quiz/edit/${quizId}`);
  };

  // Handler for play/host button click
  const handleStartSession = async (quizId) => {
    console.log("Play game with ID:", quizId);
    // TODO: Implement play logic
    try {
      // Find the game to get its details
      const game = games.find((g) => g.id === quizId);
      if (!game) return;

      // TODO: Replace with actual API call to create a session
      const sessionId = await createGameSession(quizId, token);

      // Update our current state
      const updatedGames = games.map((g) => {
        if (g.id === quizId) {
          return {
            ...g,
            active: sessionId,
          };
        }
        return g;
      });

      setGames(updatedGames);

      // Set the active session data and open the modal
      setActiveSessionData({
        sessionId: sessionId,
        quizId,
        gameTitle: game.name,
      });
      setIsSessionModalOpen(true);
    } catch (error) {
      console.error("Failed to start game session:", error);
      setError("Failed to start game session. Please try again.");
    }
  };

  // Handler for closing the session modal
  const handleCloseSessionModal = () => {
    setIsSessionModalOpen(false);
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">
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

      {/* Games Feed */}
      <div className="flex-1 flex flex-col justify-start items-center text-center p-8">
        <div className="w-full max-w-6xl">
          <h1 className="text-5xl font-semibold text-left mb-6 text-orange-500 font-Nunito-Black">
            My Games
          </h1>

          {/* TODO placeholder */}
          {loading ? (
            <div className="text-center text-gray-600 py-10">
              Loading your games...
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 mb-4">
                You have not created any games yet.
              </p>
              <Link
                to="/quiz/create"
                className={`${orangeButtonClass} inline-flex items-center gap-2`}
              >
                <RiAddCircleLine className="text-xl" /> Create your first game
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {games.map((game, i) => (
                <GameDashboardTile
                  key={i}
                  game={game}
                  onDelete={handleDeleteClick}
                  onEdit={handleEditClick}
                  onPlay={handleStartSession}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        gameTitle={gameToDelete?.name}
      />

      {/* Session Start Modal */}
      <SessionStartModal
        isOpen={isSessionModalOpen}
        onClose={handleCloseSessionModal}
        sessionId={activeSessionData?.sessionId}
        gameTitle={activeSessionData?.gameTitle}
      />
    </div>
  );
}

export default Dashboard;
