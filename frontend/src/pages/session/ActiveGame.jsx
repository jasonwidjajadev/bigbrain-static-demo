import React from 'react';
// import { useLocation } from 'react-router-dom';
import HostGameLobby from './component/HostGameLobby'
import HostGamePlay from './component/HostGamePlay'
import HostGameQuestionResult from './component/HostGameQuestionResult'
import HostGameFinalResults from './component/HostGameFinalResults'

import PlayerGameLobby from './component/PlayerGameLobby'
import PlayerGamePlay  from './component/PlayerGamePlay'
import PlayerAnswerSubmitted from './component/PlayerAnswerSubmitted'
import PlayerGameQuestionResult from './component/PlayerGameQuestionResult'
import PlayerGameFinalResults from './component/PlayerGameFinalResults'

import data from "../../__test__/session_example_1_4_inactive";
/**
 * <Route path='/session/:sessionId' element={ <GameActive/>} />
 *
 * Components:
 * HostGameLobby              // Waiting for players
 * HostGamePlay               // Question screen (active play)
 * HostGameQuestionResult     // Per-question results
 * HostGameFinalResults       // Final game results
 *
 * PlayerGameLobby             // Waiting for host to start
 * PlayerGamePlay              // Active gameplay question screen
 * PlayerGameQuestionResult    // Shows result after each question
 * PlayerGameFinalResults      // Final scoreboard & stats
 *
 * @returns
 */
function ActiveGame() {
  //TODO 1.user effect to call game status

  //TODO 2. token check if admin or not

  //TODO 3, token + game status => redirects user or logic

  //TODO Polling to find players coming in

  //TODO Mutate = ADVANCE
  let questionState = ['COUNTDOWN','QUESTION', 'ANSWER']
  // const isGameOver = currentQuestion >= questions.length;
  let isGameOver  = false;

  //TODO Mutate = END



  // const location = useLocation();
  // const sessionId = location.state.sessionId;
  // const nickname = location.state?.nickname || '';
  // const isAdmin = location.state.isAdmin;


  const [currGame, setCurrGame] = React.useState({
    position: -1,
    // seconds: -1,
    // defaultTimeout: 20,
    // question: "",
  });




  //TODO Host
  // - disable host playing their own game
  // - ountdown 3 seconds

  //TODO Player

  //!Mock Admin Lobby ==========================================================
  let isAdmin = true;
  let position = -1;
  const sessionId = 6813761;
  const handleShowFinalResults = () => {
    console.log('Result of game is....');
  }
  const handleAdvance = () => {
    console.log('Advancing position to 0');
  }
  const playerList = [
    'Mark', 'A', 'Jennie', 'Lisa', 'Rose', 'B', 'Beyonce', 'Moon Monkey',
    'Dubai 1', 'C', '!', 'F', 'Final', 'Santiago 5', 'Moon Monkey',
    'Dubai 3', 'bali', 'Canary', 'Blue', 'Bird of Paradise', 'Ozzy',
    'Karina', 'A 丽 敏', 'Jennie', 'Lisa', 'Rose', 'B', 'Beyonce', 'Moon Monkey',
    'Dubai 1', 'C', 'E', 'F', 'Final', 'Santiago 5', 'Moon Monkey',
    'Dubai 3', 'bali', 'Canary', 'Blue', 'Bird of Paradise', 'Ozzy',
    'Francis', 'Cory', 'David', '姓',
  ]
  //! ==========================================================================
  position = 0;

  position = 1;

  position = 2;

  //! ==========================================================================
  // That is correct, if the admin advances to the next question while the timer is still going, then you do not have to show the correct answers for that question.

  //* Mock Player ==============================================================
  isAdmin = false;
  // isGameOver  = true;


  //* ==========================================================================


  return (
    <>
      {/* ADMIN ============================================================ */}
      {/* {isAdmin &&
        position === -1 &&
        <HostGameLobby
          sessionId={sessionId}
          players={playerList}
          showResults={handleShowFinalResults}
          advancePosition={handleAdvance}
        />
      }*/}

      {/* {isAdmin &&
        position >= 0 &&
        !isGameOver &&
        <HostGamePlay
        />} */}

      {/* {isAdmin && <HostGameQuestionResult/>} */}

      {/* {isAdmin &&
        data.active === false &&
        isGameOver &&
        <HostGameFinalResults/>
      } */}


      {/* ================================================================== */}
      {/* USER */}
      {/* {!isAdmin && position === -1 && <PlayerGameLobby/>} */}

      {!isAdmin && <PlayerGamePlay />}

      {/* {!isAdmin && <PlayerAnswerSubmitted />} */}

      {/* { !isAdmin && <PlayerGameQuestionResult />} */}

      {/* Player Final Result */}
      {!isAdmin &&
        data.active === false &&
        isGameOver &&
        <PlayerGameFinalResults/>
      }


    </>
  )
}
export default ActiveGame;

/*
Discuss url changes App.jsx
print out question.json
for 2.5.1 should a unique url exists?
when to use get/admins/session/:sessionId status?


Polling is for what?

Do we calculate results by ourself for host and player

Talk dashboard redesign for incoportaing past game sessions


every game state - is this managed internally


how do we determine if a game is over? what is the condition? position = length -1 ?  and state 'ANSWER'
API call for stage answer

Start
Question stage countdown, question, answer
End


Question
GET     /admin/session/:sessionid/status + GET     /admin/games
GET     /admin/session/:sessionid/results

PUT     /play/:playerid/answer
GET     /play/:playerid/answer
GET     /play/:playerid/results
*/