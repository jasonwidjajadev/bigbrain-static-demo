import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RiAddCircleLine } from "react-icons/ri";
import { VscThreeBars } from "react-icons/vsc";
import { TbLogout } from "react-icons/tb";
import { FaPlay } from "react-icons/fa";

import { useAuthContext } from "@/context/useAuthContext";
import {
  fetchGames,
  updateAllGames,
  createGameSession,
  stopGameSession,
} from "@/util/gamesApi";

import GameDashboardTile from "@/components/cards/GameDashboardTile";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import SessionStartModal from "@/components/modals/SessionStartModal";

import LinkLogoNavBar from "@/components/logo/LogoNavBar";
import { orangeButtonClass } from "@/components/ui/tailwind";
import JoinGameButton from "@/components/button/JoinGameButton";

function Dashboard() {
  const navigate = useNavigate();
  const { token } = useAuthContext();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [error, setError] = useState(null);

  // State for session management
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [activeSessionData, setActiveSessionData] = useState([]);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(null);

  React.useEffect(() => {
    if (!token) {
      navigate("/home");
    } else {
      // If we are logged in, fetch the games and display them
      getGamesToDisplay();
    }
  }, [token, navigate]);

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
    navigate(`/quiz/edit/${quizId}`);
  };

  // Hander for previous session button click
  const handlePreviousSessionResults = (quizId) => {
    console.log("See previous sessions for game with ID:", quizId);
    navigate(`/quiz/results/${quizId}`);
  };

  // Handler for play/host button click
  const handleStartSession = async (quizId) => {
    try {
      // Find the game to get its details
      const game = games.find((g) => g.id === quizId);
      if (!game) return;

      // API call to create a session
      const sessionId = await createGameSession(quizId, token);

      // Update our current state
      const updatedGames = games.map((g) => {
        if (g.id === quizId) {
          const sessUpdate = g.oldSessions;
          sessUpdate.push(sessionId);
          return {
            ...g,
            active: sessionId,
            oldSessions: sessUpdate,
          };
        }
        return g;
      });
      setGames(updatedGames);

      // Add to activeSessionData array
      const newSession = {
        sessionId: sessionId,
        gameId: quizId,
        game: game,
        gameTitle: game.name,
      };

      setActiveSessionData((prevSessions) => [...prevSessions, newSession]);
      setSelectedSessionIndex(activeSessionData.length); // This will be the index of the new session
      setIsSessionModalOpen(true);
    } catch (error) {
      console.error("Failed to start game session:", error);
      setError("Failed to start game session. Please try again.");
    }
  };

  // Handler for closing the session model
  const handleCloseSessionModal = () => {
    setIsSessionModalOpen(false);
  };

  // Handler for pressing continue in the session modal
  const handleContinueSessionModal = () => {
    if (
      selectedSessionIndex !== null &&
      selectedSessionIndex >= 0 &&
      selectedSessionIndex < activeSessionData.length
    ) {
      const currentSession = activeSessionData[selectedSessionIndex];

      navigate(`/host/${currentSession.sessionId}`, {
        state: {
          sessionId: currentSession.sessionId,
          gameId: currentSession.gameId,
          game: currentSession.game,
          from: "/dashboard",
        },
      });
    }
    setIsSessionModalOpen(false);
  };

  // Handles stopping a session with quizId
  const handleStopSession = async (quizId) => {
    try {
      // Find the game to get its details
      const game = games.find((g) => g.id === quizId);
      if (!game) return;

      // API call to stop a session
      await stopGameSession(quizId, token);

      // Update our current state
      const updatedGames = games.map((g) => {
        if (g.id === quizId) {
          return {
            ...g,
            active: false,
          };
        }
        return g;
      });
      setGames(updatedGames);

      // Remove from activeSessionData array
      const updatedSessionData = activeSessionData.filter(
        (session) => session.gameId !== quizId
      );
      setActiveSessionData(updatedSessionData);

      // If the currently selected session was removed, reset the selection
      if (selectedSessionIndex !== null) {
        const selectedSession = activeSessionData[selectedSessionIndex];
        if (selectedSession && selectedSession.gameId === quizId) {
          setSelectedSessionIndex(null);
        }
      }
    } catch (err) {
      setError(`Failed to start game session. Please try again ${err}`);
      console.error("Failed to start game session:", error);
    }
  };

  // Handler for going to an active session
  const handleGoToSessionClick = (quizId, sessionId) => {
    // Find the game to get its details
    const game = games.find((g) => g.id === quizId);
    if (!game) return;

    // Navigate to the host page with the required state data
    navigate(`/host/${sessionId}`, {
      state: {
        sessionId: sessionId,
        gameId: quizId,
        game: game,
        from: "/dashboard",
      },
    });
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col ">
      {/* Navbar Left Side*/}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px]">
        <LinkLogoNavBar targetPath="/home" />
        {/* //* NavBar Right side For Small Screen Dropdown */}
        <div className="dropdown dropdown-bottom dropdown-end sm:hidden">
          {/* Toggle Button */}
          <div tabIndex={0} role="button" className={orangeButtonClass}>
            <VscThreeBars className="text-3xl" />
          </div>

          {/* Dropdown Content */}
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow-lg bg-orange-500 rounded-box w-52 z-50 text-xl text-white"
          >
            <li>
              <Link to="/quiz/create" className="flex items-center gap-[16px]">
                <RiAddCircleLine /> Create
              </Link>
            </li>
            <li>
              <Link
                to="/quiz/join"
                className="font-semibold flex items-center gap-[20px]"
              >
                <FaPlay className="text-[16px]" /> Join a game
              </Link>
            </li>
            <li>
              <Link to="/auth/logout" className="flex items-center gap-3">
                <TbLogout className="text-2xl" /> Logout
              </Link>
            </li>
          </ul>
        </div>

        {/* //*NavBar Right side For Big Screen Dropdown */}
        <div className="hidden sm:block">
          <div className="flex gap-3 items-center">
            {/* Create */}
            <Link
              data-testid="quiz-create-button-big-screen"
              to="/quiz/create"
              className={`${orangeButtonClass} flex items-center gap-2`}
            >
              <RiAddCircleLine className="text-2xl" /> Create
            </Link>
            {/* Play */}
            <JoinGameButton />
            {/* Logout */}
            <Link
              to="/auth/logout"
              data-testid="logout-button-big-screen"
              className={`${orangeButtonClass} px-5 flex items-center gap-2`}
            >
              <TbLogout className="text-2xl" /> Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* //*Games Feed */}
      <div className="flex-1 flex flex-col justify-start items-center text-center p-8">
        <div className="w-full md:w-[90%] xl:w-[80%]">
          <h1 className="text-5xl  text-left mb-6 text-orange-500 font-Nunito-ExtraBold">
            My Games
          </h1>
          {games ? (
            loading ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-600 py-10">
                Loading your games...
              </div>
            ) : games.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
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
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3
              [@media(min-width:1800px)]:grid-cols-4 gap-8"
              >
                {games.map((game, i) => (
                  <GameDashboardTile
                    key={i}
                    game={game}
                    onDelete={handleDeleteClick}
                    onEdit={handleEditClick}
                    onPreviousSessionResults={handlePreviousSessionResults}
                    onPlay={handleStartSession}
                    onStop={handleStopSession}
                    onGoToSession={handleGoToSessionClick}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-solid mb-4"></div>
              <p className="text-xl text-gray-600">Dashboard is loading...</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={gameToDelete?.name}
      />

      {/* Session Start Modal */}
      <SessionStartModal
        isOpen={isSessionModalOpen}
        onContinue={handleContinueSessionModal}
        onClose={handleCloseSessionModal}
        sessionId={
          selectedSessionIndex !== null
            ? activeSessionData[selectedSessionIndex]?.sessionId
            : null
        }
        gameTitle={
          selectedSessionIndex !== null
            ? activeSessionData[selectedSessionIndex]?.gameTitle
            : null
        }
      />
    </div>
  );
}

export default Dashboard;
