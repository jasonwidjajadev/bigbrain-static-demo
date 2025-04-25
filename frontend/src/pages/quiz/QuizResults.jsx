import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { FaPlay } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { VscThreeBars } from "react-icons/vsc";
import { RiAddCircleLine } from "react-icons/ri";

import { useAuthContext } from "@/context/useAuthContext";
import { fetchGames, getResultsForSessionId } from "@/util/gamesApi";

import LinkLogoNavBar from "@/components/logo/LogoNavBar";
import Button from "@/components/button/Button";
import TabContent from "@/pages/quiz/charts/TabContent";

/**
 * Displays results from previous sessions of a specific quiz
 *
 * @param {Object} props - Component props (No explicit props passed)
 * @returns {React.ReactElement} Quiz results interface with session tabs
 */
function QuizResults() {
  const navigate = useNavigate();
  const { token } = useAuthContext();
  const [specificGameData, setSpecificGameData] = useState({});
  const [sessionIdData, setSessionIdData] = useState([]);
  const [sessionResults, setSessionResults] = useState([]);
  const { quizId } = useParams();
  const quizIdInt = parseInt(quizId);

  useEffect(() => {
    if (!token) {
      navigate("/home");
    } else {
      // If we are logged in, fetch the games and display them
      fetchData();
    }
  }, [token, navigate]);

  const fetchData = async () => {
    try {
      // First get the old sessions
      const oldSessionData = await getOldSessionIdData();
      setSessionIdData(oldSessionData);

      // Then fetch results for each session
      await fetchSessionResults(oldSessionData);
    } catch (error) {
      if (!sessionIdData) {
        console.log("No session data saved.");
      }
      console.error("Error fetching data:", error);
    }
  };

  const getOldSessionIdData = async () => {
    try {
      // Get the games data
      const gamesData = await fetchGames(token);

      // Seach through and match the id of the game we clicked on
      const specificGame = gamesData.filter((game) => game.id === quizIdInt);
      setSpecificGameData(specificGame[0]);
      if (specificGame.length > 0) {
        const oldSessionData = specificGame[0].oldSessions;
        return oldSessionData;
      } else {
        console.error("Game not found");
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const fetchSessionResults = async (oldSessionData) => {
    try {
      const results = [];
      // Get Sessions data
      for (const sessionId of oldSessionData) {
        const sessionData = await getResultsForSessionId(sessionId, token);
        results.push({ sessionId, results: sessionData.results });
      }
      setSessionResults(results);
    } catch (error) {
      console.error("Error fetching sessionData:", error);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">
      {/* Navbar Left Side*/}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px]">
        <LinkLogoNavBar targetPath="/home" />

        {/* //* NavBar Right side For Small Screen Dropdown */}
        <div className="dropdown dropdown-bottom dropdown-end sm:hidden">
          {/* Toggle Button */}
          <Button
            tabIndex={0}
            role="button"
            icon={VscThreeBars}
            iconClass="text-3xl"
            color="pink"
          ></Button>

          {/* Dropdown Content */}
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow-lg bg-pink-600 rounded-box w-52 z-50 text-xl text-white"
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
            <Button
              to="/quiz/create"
              icon={RiAddCircleLine}
              iconClass="text-2xl"
              color="pink"
              data-testid="quiz-create-button-big-screen"
            >
              Create
            </Button>
            <Button to="/join" icon={FaPlay} color="pink">
              Join a game
            </Button>
            <Button
              to="/auth/logout"
              icon={TbLogout}
              iconClass="text-2xl"
              color="pink"
              data-testid="logout-button-big-screen"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Quiz Old Sessions Results Page */}
      <div className="flex-1 flex flex-col justify-start md:p-8">
        <div className="w-full max-w-6xl">
          <h1 className="flex justify-center text-3xl font-semibold text-left p-4 md:p-0 md:mb-4 text-pink-600 font-Nunito-ExtraBold">
            Previous Sessions for {specificGameData.name}
          </h1>
        </div>
        {sessionResults ? (
          <div className="tabs tabs-box">
            {sessionResults.map((session, index) => (
              <React.Fragment key={`session-${session.sessionId}`}>
                <input
                  key={`tab-input-${session.sessionId}`}
                  type="radio"
                  name="sessionTabs"
                  className="tab"
                  aria-label={`Session ${index + 1}`}
                  defaultChecked={index === 0}
                />
                <div
                  key={`tab-content-${session.sessionId}`}
                  className="tab-content"
                >
                  <TabContent
                    gameData={specificGameData}
                    sessionResults={session.results}
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <>Loading</>
        )}
      </div>
    </div>
  );
}

export default QuizResults;
