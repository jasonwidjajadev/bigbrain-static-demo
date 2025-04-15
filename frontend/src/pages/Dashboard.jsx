import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext";
import LinkLogoNavBar from '../component/LinkLogoNavBar';
import { RiAddCircleLine } from "react-icons/ri";
import { orangeButtonClass } from "../component/tailwind";
import { fetchGames, updateAllGames } from "../util/gamesApi";
import GameDashboardTile from "../component/GameDashboardTile";

import JoinGameButton from '../component/JoinGameButton';
import { VscThreeBars } from "react-icons/vsc";
import { TbLogout } from "react-icons/tb";
import { FaPlay } from "react-icons/fa";

import DeleteConfirmationModal from "../component/DeleteConfirmationModal";


function Dashboard() {
  const navigate = useNavigate();
  const { token, email } = useAuthContext();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [error, setError] = useState(null);

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

  // Pass in function as a prop - and then the component calls the prob

  // Handler for delete button click from a GameDashboardTile
  const handleDeleteClick = (gameId, gameName) => {
    const game = games.find((g) => g.id === gameId);
    if (game) {
      setGameToDelete({
        id: gameId,
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
  const handleEditClick = (gameId) => {
    console.log("Edit game with ID:", gameId);
    // TODO: Navigate to edit page
    navigate(`/quiz/edit/${gameId}`);
  };

  // Handler for play/host button click
  const handlePlayClick = (gameId) => {
    console.log("Play game with ID:", gameId);
    // TODO: Implement play logic
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">
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
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-orange-500 rounded-box w-52 z-50 text-xl text-white">
            <li>
              <Link to="/quiz/create" className="flex items-center gap-[16px]">
                <RiAddCircleLine /> Create
              </Link>
            </li>
            <li>
              <Link to="/quiz/join" className="font-semibold flex items-center gap-[20px]">
                <FaPlay className="text-[16px]"/> Join a game
              </Link>
            </li>
            <li>
              <Link to="/auth/logout" className="flex items-center gap-3">
                <TbLogout className="text-2xl"/> Logout
              </Link>
            </li>
          </ul>
        </div>

        {/* //*NavBar Right side For Big Screen Dropdown */}
        <div className="hidden sm:block">
          <div className="flex gap-3 items-center">
            {/* Create */}
            <Link to="/quiz/create" className={`${orangeButtonClass} flex items-center gap-2`}>
              <RiAddCircleLine className="text-2xl" /> Create
            </Link>
            {/* Play */}
            <JoinGameButton />
            {/* Logout */}
            <Link to="/auth/logout" className={`${orangeButtonClass} px-5 flex items-center gap-2`}>
              <TbLogout className="text-2xl"/> Logout
            </Link>
          </div>
        </div>
      </nav>


      {/* //*Games Feed */}
      <div className="flex-1 flex flex-col justify-start items-center text-center p-8">
        <div className="w-full max-w-6xl">
          <h1 className="text-5xl font-semibold text-left mb-6 text-orange-500 font-Nunito-ExtraBold">
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
                  onPlay={handlePlayClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        gameTitle={gameToDelete?.name}
      />
    </div>
  );
}

export default Dashboard;
