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
// Use this syntax
export const updateAllGames = async (allGames, adminToken) => {
  // PUT implementation
  try {
    const response = await apiCall("/admin/games", "PUT", allGames, adminToken);
    return response;
  } catch (error) {
    // TODO: popup error message if we want
    throw new Error(error || "Something went wrong");
  }
};

export const getResultsForSessionId = async (sessionId, adminToken) => {
  try {
    const response = await apiCall(
      `/admin/session/${sessionId}/results`,
      "GET",
      null,
      adminToken
    );
    return response;
  } catch (error) {
    // TODO: popup error message if we want
    throw new Error(error || "Something went wrong");
  }
};

// Game Mutation Functions:
const gameMutateHelper = async (quizId, token, mutationType) => {
  try {
    const response = await apiCall(
      `/admin/game/${quizId}/mutate`,
      "POST",
      {
        mutationType: mutationType,
      },
      token
    );

    console.log("Response is: ", response);
    return response;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const createGameSession = async (quizId, token) => {
  const response = await gameMutateHelper(quizId, token, "START");
  return response.data.sessionId;
};

export const stopGameSession = async (quizId, token) => {
  const response = await gameMutateHelper(quizId, token, "END");
  return response;
};
