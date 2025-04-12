import { apiCall } from "./apiCall";

// Function to get all the games
export const fetchGames = async (adminToken) => {
  // GET implementation
  const data = await apiCall("/admin/games", "GET", null, adminToken);
  if (data.error) {
    // TODO: Handle error
    console.error("Error fetching games:", data.error);
    throw new Error(data.error);
  }
  return data.games;
};

// Function to push all the games
export const updateAllGames = async (allGames, adminToken) => {
  // PUT implementation
  try {
    const response = await apiCall("/admin/games", "PUT", allGames, adminToken);
    return response;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};
