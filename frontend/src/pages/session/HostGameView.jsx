import React from 'react';
// import { useLocation} from 'react-router-dom';
import { useNavigate,  useParams } from 'react-router-dom';
import { useAuthContext } from "../../context/useAuthContext";
import { apiCall } from '../../util/apiCall';
import Countdown from './component/Countdown'
import HostGameLobby from './component/HostGameLobby'
import HostGamePlay from './component/HostGamePlay'
import HostGameQuestionResult from './component/HostGameQuestionResult'
import HostGameFinalResults from './component/HostGameFinalResults'

/**
 *
 * Components:
 * Countdown
 * HostGameLobby              // Waiting for players
 * HostGamePlay               // Question screen (active play)
 * HostGameQuestionResult     // Per-question results
 * HostGameFinalResults       // Final game results
 *
 * @returns
 */

function HostGameView() {

  // const location = useLocation();
  const navigate = useNavigate();
  const { token, tokenReady } = useAuthContext();

  // SessionId
  // const [sessionIdFromURL, setSessionFromURL] = React.useState('');
  const { sessionId } = useParams();
  const [currSession, setCurrSession] = React.useState(null); //* gets dynamically updated, currSession.position === -1

  // Current Quiz, doesn't change, React mounts a new currQuiz each time its rendering a page
  const [currQuiz, setCurrQuiz] = React.useState(null); //* has currQuiz.id
  // const [isQuizOwner, setIsQuizOwner] = React.useState(false);


  // LOBBY → [COUNTDOWN → QUESTION → RESULT] * N → FINAL RESULT
  const [stage, setStage] = React.useState('lobby');     // 'lobby' | 'countdown' | 'question' | 'answer' | 'final'
  const [position, setPosition] = React.useState(-1);     // -1 = not started
  const [questions, setQuestions] = React.useState([]);   // full list from backend
  const [hostFinalResults, setHostFinalResults] = React.useState(null); // only when final stage
  // const isGameOver = position >= questions.length;

  //* ==========================================================================
  //* Session loading & game ownership
  //* ==========================================================================


  React.useEffect(() => {
    if (!tokenReady || !token) return;

    const fetchSessionAndVerifyOwnership = async () => {
      try {
        const trimmedSessionId = sessionId?.trim() || '';

        // Step 1: Get session status
        const response = await apiCall(`/admin/session/${trimmedSessionId}/status`, 'GET', null, token);
        const sessionStatus = response.results;
        if (!sessionStatus) {
          console.warn('Session not found or invalid');
          navigate('/session/inactive');
          return;
        }

        setCurrSession(sessionStatus);
        // setSessionFromURL(trimmedSessionId);

        const sessionQuestions = sessionStatus.questions || [];
        setQuestions(sessionQuestions);

        // Step 2: If session is over, get results
        if (!sessionStatus.active || sessionStatus.position >= sessionQuestions.length) {
          // try {
          const results = await apiCall(`/admin/session/${trimmedSessionId}/results`, 'GET', null, token);
          setHostFinalResults(results);
          setStage('final');
          return;
          // } catch (err) {
          //   console.error('Failed to fetch results:', err.message);
          // }
        }

        // Step 3: Verify user is the quiz owner
        const allGameData = await apiCall('/admin/games', 'GET', null, token);
        const matchingGame = allGameData.games.find(
          (game) => Number(game.active) === Number(sessionId)
        );

        if (!matchingGame) {
          console.warn("You are not the quiz owner or game doesn't exist");
          navigate('/session/inactive');
          return;
        }

        setCurrQuiz(matchingGame);
        // setIsQuizOwner(true);

        // Step 4: Set initial stage and position
        const pos = sessionStatus.position;
        setPosition(pos);
        setStage(pos === -1 ? 'lobby' : 'countdown');

        console.log('✅ Game initialized:', {
          token,
          sessionStatus,
          position: pos,
          questions: sessionQuestions.length,
        });

        console.log('token:', token);
        console.log('sessionId:', sessionId);
        console.log('sessionStatus:', sessionStatus);
        console.log('allGameData:', allGameData);
        console.log('matchingGame:', matchingGame);
      } catch (err) {
        console.error('Error loading host game view:', err.message);
        navigate('/session/inactive');
      }
    };

    fetchSessionAndVerifyOwnership();
  }, [tokenReady, token, sessionId, navigate]);

  React.useEffect(() => {
    console.log('Updated hostFinalResults:', hostFinalResults);
  }, [hostFinalResults]);

  //* ==========================================================================
  //* Lobby + Verify that game has started
  //* ==========================================================================
  React.useEffect(() => {
    if (!currQuiz || !currSession || currSession.position !== -1) return;

    const interval = setInterval(async () => {
      try {
        const response = await apiCall(`/admin/session/${sessionId}/status`, 'GET', null, token);
        const updatedSession = response.results;

        setCurrSession(updatedSession);
        if (updatedSession.position > -1) {
          setPosition(updatedSession.position);
          setStage('countdown');
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Failed to poll session:', err.message);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currQuiz, currSession?.position, sessionId, token]);

  //* ==========================================================================
  //* Countdown
  //* ==========================================================================
  const questionTimerRef = React.useRef(null);

  React.useEffect(() => {
    if (stage === 'lobby') return;

    // if (stage === 'countdown') {
    //   const timer = setTimeout(() => setStage('question'), 3000);
    //   return () => clearTimeout(timer);
    // }

    if (stage === 'question') {
      const duration = questions[position]?.duration || 10;
      questionTimerRef.current = setTimeout(() => {
        setStage('answer');
      }, duration * 1000);
      return () => clearTimeout(questionTimerRef.current);
    }
  }, [stage, position, questions]);

  //* ==========================================================================
  //* Start Game
  //* ==========================================================================

  const handleStartGame = async () => {
    try {
      // No questions, end game immediately
      if (questions.length === 0) {
        console.warn("No questions available — ending game immediately.");

        // End the game
        await apiCall(`/admin/game/${currQuiz.id}/mutate`, 'POST', {
          mutationType: 'END'
        }, token);

        // Get results
        const resultRes = await apiCall(`/admin/session/${sessionId}/results`, 'GET', null, token);
        setHostFinalResults(resultRes);
        setStage('final');
        return;
      }

      // Otherwise, advance to first question
      const response = await apiCall(`/admin/game/${currQuiz.id}/mutate`, 'POST', {
        mutationType: 'ADVANCE'
      }, token);

      console.log("Game started!");
      console.log("Advancing to first question response is: ", response);
    } catch (err) {
      console.error("Failed to start game:", err.message);
    }
  };

  //* ==========================================================================
  //* End Game
  //* ==========================================================================
  // how do we determine if a game is over? what is the condition? position = length -1 ?  and state 'ANSWER'
  // API call for stage answer

  const handleEndGame = async () => {
    try {

      // Step 1: End the game
      const response = await apiCall(`/admin/game/${currQuiz.id}/mutate`, 'POST', {
        mutationType: 'END'
      }, token);
      console.log("Just ended the game the response is: ", response);

      // Step 2: Fetch final results
      const resultRes = await apiCall(`/admin/session/${sessionId}/results`, 'GET', null, token);
      setHostFinalResults(resultRes);
      setStage('final');
    } catch (err) {
      console.error('❌ Failed to end game or fetch results:', err.message);
      throw new Error(err || "Network error something went wrong");
    }
  };

  //* ==========================================================================
  //* [COUNTDOWN → QUESTION → ANSWER] * N
  //* ==========================================================================

  /**
  Scenario Example: 3 questions, question.length = 3
  Start quiz -> Stage: lobby, position: - 1
  Press Next -> (stage countdown automatic 3 seconds, position: 0, question 1), (stage question, position: 0, question 1, automatic ends when timer end unless press next), (stage answer, position: 0, question 1, not automatic, host need to press next to get to the next question countdown)
  Press Next -> (stage countdown, position: 1, question 2), (stage question, position: 1, question 2), (stage answer, position: 1, question 2)
  Press Next/skip -> (stage countdown, position: 2, question 3), (stage question, position: 2, question 3)
  but Press Next during (stage question, position: 2, question 3) timer not finished -> got straight to show (final result)
   */

  // if the admin advances to the next question while the timer is still going, then you do not have to show the correct answers for that question.
  // Skip the current question and go straight to next countdown or final

  const handleNext = async () => {
    try {
      await apiCall(`/admin/game/${currQuiz.id}/mutate`, 'POST', {
        mutationType: 'ADVANCE'
      }, token);

      if (stage === 'question') {
        console.log('Handling skip question ...');
        clearTimeout(questionTimerRef.current);

        if (position + 1 < questions.length) {
          setPosition(pos => pos + 1);
          setStage('countdown');
        } else {
          setStage('final');
        }
        return;
      }

      //TODO Do we calculate results by ourself for host and player
      if (stage === 'answer') {
        console.log('Going onto the next question , coutdown now...');
        if (position + 1 < questions.length) {
          setPosition(pos => pos + 1);
          setStage('countdown');
        } else {
          setStage('final');
        }
      }
    } catch (err) {
      console.error('❌ Failed to advance question:', err.message);
    }
  };
  //* ==========================================================================
  //* Game UI
  //* ==========================================================================

  if (!tokenReady) {
    return <div className="text-center p-8">🔐 Loading authentication...</div>;
  }

  if (!currSession) {
    return <div className="text-center p-8">📡 Loading session info...</div>;
  }

  return (
    <>
      {stage === 'final' && hostFinalResults && (
        <HostGameFinalResults results={hostFinalResults}/>
      )}

      { stage === 'lobby' && currSession.position === -1 && (
        <HostGameLobby
          sessionId={sessionId}
          players={currSession.players || {}}
          showResults={handleEndGame}
          onStart={handleStartGame}
        />
      )}

      {stage === 'countdown' && (
        <Countdown
          question={questions[position]}
          onComplete={() => setStage('question')}
        />
      )}

      {questions.length === 0 && (stage === 'question' || stage === 'answer') && (
        <div className="text-center p-6 text-gray-500">Loading question...</div>
      )}

      {stage === 'question' && questions[position] && (
        <HostGamePlay
          question={questions[position]}
          onNext={handleNext}/>
      )}

      {stage === 'answer' && questions[position] && (
        <HostGameQuestionResult
          question={questions[position]}
          onNext={handleNext}/>
      )}
    </>
  )
}

export default HostGameView;



/* Scenario to find quiz owner?
  Enter URL
    - can be quiz owner
    - can be a not quiz owner
  Coming from dashboard as admin
  Coming from /join as admin, but he/she is coincidentally the owner, owner needs to log
  out first to play their own quiz otherwise they are host
  Coming from /join as player
*/
/**
 session: id: 259637
  results: {
  "active": true,
  "answerAvailable": false,
  "isoTimeLastQuestionStarted": null,
  "players": {},
  "position": -1,
  "questions": [
    {
      "id": 1744972867568,
      "type": "multiple",
      "text": "1+1",
      "duration": 20,
      "points": 10,
      "video": "",
      "image": "",
      "answers": [
        {
          "id": 1,
          "text": "2",
          "isCorrect": true
        },
        {
          "id": 2,
          "text": "3",
          "isCorrect": false
        },
        {
          "id": 3,
          "text": "",
          "isCorrect": false
        },
        {
          "id": 4,
          "text": "",
          "isCorrect": false
        },
        {
          "id": 5,
          "text": "",
          "isCorrect": false
        },
        {
          "id": 6,
          "text": "",
          "isCorrect": false
        }
      ],
      "correctAnswers": [
        1
      ]
    }
  ]
},
  */