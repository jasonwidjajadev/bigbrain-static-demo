import { apiCall } from "./apiCall";

// Function to get all the games
export const fetchGames = async (adminToken) => {
  // GET implementation
  const data = await apiCall("/admin/games", "GET", null, adminToken);
  return data.games;
};

// Function to push all the games
export const updateAllGames = async (allGames) => {
  // PUT implementation
};
