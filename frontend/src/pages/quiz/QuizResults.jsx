import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/context/useAuthContext";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchGames, getResultsForSessionId } from "@/util/gamesApi";

import LinkLogoNavBar from "@/component/LinkLogoNavBar";
import { RiAddCircleLine } from "react-icons/ri";
import { orangeButtonClass } from "@/component/tailwind";
import { VscThreeBars } from "react-icons/vsc";
import { FaPlay } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import JoinGameButton from "@/component/JoinGameButton";
import TabContent from "./component/TabContent";

/* 
Session results data structure looks as follows:
[
  {
    sessionId: "num",
    data: {
      results: [
        {
          name: "jason",
          answers: [
            {
              questionStartedAt: '2025-04-20T23:41:12.525Z',
              answeredAt: '2025-04-20T23:41:23.226Z',
              answers: [], // Some answer content
              correct: true
            },
            {
              questionStartedAt: '2025-04-20T23:41:47.078Z',
              answeredAt: '2025-04-20T23:42:03.912Z',
              answers: [], // Answer 1, Answer 2
              correct: true
            },
            {
              questionStartedAt: '2025-04-20T23:42:19.661Z',
              answeredAt: '2025-04-20T23:42:26.192Z',
              answers: [], // Some answer content
              correct: true
            }
          ]
        },
        {
          name: "mik",
          answers: [
            {
              questionStartedAt: '2025-04-20T23:41:12.525Z',
              answeredAt: '2025-04-20T23:41:26.522Z',
              answers: [], // Some answer content
              correct: true
            },
            {
              questionStartedAt: '2025-04-20T23:41:47.078Z',
              answeredAt: '2025-04-20T23:41:58.942Z',
              answers: [], // Answer 1, Answer 2, Answer 3
              correct: false
            },
            {
              questionStartedAt: '2025-04-20T23:42:19.661Z',
              answeredAt: '2025-04-20T23:42:28.363Z',
              answers: [], // Some answer content
              correct: false
            }
          ]
        },
      ]
    }
  }
]

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
              className={`${orangeButtonClass} px-5 flex items-center gap-2`}
            >
              <TbLogout className="text-2xl" /> Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* Quiz Old Sessions Results Page */}
      <div className="flex-1 flex flex-col justify-start md:p-8">
        <div className="w-full max-w-6xl">
          <h1 className="flex justify-center text-3xl font-semibold text-left p-4 md:p-0 md:mb-4 text-orange-500 font-Nunito-ExtraBold">
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
