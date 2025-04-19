import React from 'react';
// import { useLocation } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall } from '../../util/apiCall';
import Countdown from './component/Countdown'
import PlayerGameLobby from './component/PlayerGameLobby'
import PlayerGamePlay  from './component/PlayerGamePlay'
import PlayerAnswerSubmitted from './component/PlayerAnswerSubmitted'
import PlayerGameQuestionResult from './component/PlayerGameQuestionResult'
import PlayerGameFinalResults from './component/PlayerGameFinalResults'

// 1. POST    /play/join/:sessionid - join an active session as a new player
// 2. GET     /play/:playerid/status
// 4. GET     /play/:playerid/question
// 5. GET     /play/:playerid/answer
// 6. PUT     /play/:playerid/answer
// 7. GET     /play/:playerid/results

/**
 *
 * Countdown
 * PlayerGameLobby             // Waiting for host to start
 * PlayerGamePlay              // Active gameplay question screen
 * PlayerGameQuestionResult    // Shows result after each question
 * PlayerGameFinalResults      // Final scoreboard & stats
 *
 * @returns
 */
function PlayerGameView() {
  // const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = useParams();

  // PlayerId
  const [playerId, setPlayerId] = React.useState(null);
  // const [playerProfile, setPlayerProfile] = React.useState(null);

  // Lobby
  const [hasStarted, setHasStarted] = React.useState(false);

  // Question
  const [question, setQuestion] = React.useState(null);

  // Answer
  // const [selectedAnswers, setSelectedAnswers] = React.useState([]);
  const [answered, setAnswered] = React.useState(false);
  const [submittedAnswer, setSubmittedAnswer] = React.useState(null);

  // Result
  const [gameOver, setGameOver] = React.useState(false);
  const [results, setResults] = React.useState(null);
  const [error, setError] = React.useState(null);

  //* ==========================================================================
  //* Retrieve/ Validate playerId
  //* ==========================================================================

  // origin = protocol + domain + port
  // Store playerId after successful join, localStorage.setItem('playerMap')
  // Retrieve it at playergameview, localStorage.getItem('playerMap')
  // Remove it After final results screen is shown, clear local storage, delete playerMap[sessionId]
  React.useEffect(() => {
    const playerMap = JSON.parse(localStorage.getItem('playerMap') || '{}');
    const id = playerMap[sessionId];
    if (!id) {
      navigate('/join');
    } else {
      setPlayerId(id);
    }
  }, [sessionId, navigate]);

  // React.useEffect(() => {
  //   if (location.state?.from === '/join') {
  //     setPlayerProfile(location.state);
  //   }
  // }, [location.state]);

  //* ==========================================================================
  //* Lobby, check if game has started
  //* ==========================================================================
  // GET, /play/:playerid/status

  React.useEffect(() => {
    if (!playerId || (hasStarted === true)) return;
    const checkStatus = async () => {
      try {
        const res = await apiCall(`/play/${playerId}/status`, 'GET');
        setHasStarted(res.started);
      } catch (err) {
        console.error('❌ Failed to check game status:', err.message);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, [playerId, hasStarted]);

  //* ==========================================================================
  //* Poll question or detect game over
  //* ==========================================================================
  // GET, /play/:playerid/question

  React.useEffect(() => {
    if (!playerId || !hasStarted) return;

    const fetchQuestion = async () => {
      try {
        const res = await apiCall(`/play/${playerId}/question`, 'GET');
        console.log(res);
        if (res?.gameOver) {
          setGameOver(true);
        } else {
          setQuestion(res);
          setAnswered(false);
        }
      } catch (err) {
        console.warn('⚠️ No question available yet:', err.message);
      }
    };

    fetchQuestion();
    const interval = setInterval(fetchQuestion, 1000);
    return () => clearInterval(interval);
  }, [playerId, hasStarted]);

  //* ==========================================================================
  //* Fetch results after game over
  //* ==========================================================================
  // GET, /play/:playerid/results
  //TODO Do we calculate results by ourself for host and player

  // fetch results and clear playerId when game ends
  React.useEffect(() => {
    if (!playerId || !gameOver) return;

    const cleanup = async () => {
      try {
        const res = await apiCall(`/play/${playerId}/results`, 'GET');
        setResults(res);
      } catch (err) {
        console.warn('⚠️ Could not fetch results:', err.message);
      }

      // Remove playerId from local storage
      const playerMap = JSON.parse(localStorage.getItem('playerMap') || '{}');
      delete playerMap[sessionId];
      localStorage.setItem('playerMap', JSON.stringify(playerMap));
    };
    // if (gameOver && playerId) {
    //   cleanup();
    // }
    cleanup();
  }, [gameOver, playerId, sessionId]);


  //* ==========================================================================
  //* Submit Answers
  //* ==========================================================================
  // PUT, /play/:playerid/answer

  const submitAnswer = async (selectedAnswers) => {
    try {
      await apiCall(`/play/${playerId}/answer`, 'PUT', { answers: selectedAnswers });
      setAnswered(true);
    } catch (err) {
      console.error('❌ Error submitting answer:', err.message);
      setError('Could not submit your answer.');
    }
  };


  //* ==========================================================================
  //* Show Individual Question results
  //* ==========================================================================

  // GET, /play/:playerid/answer
  React.useEffect(() => {
    if (!playerId || !answered) return;

    const fetchSubmittedAnswer = async () => {
      try {
        const res = await apiCall(`/play/${playerId}/answer`, 'GET');
        setSubmittedAnswer(res);
      } catch (err) {
        console.error('❌ Failed to fetch submitted answer:', err.message);
      }
    };

    fetchSubmittedAnswer();
  }, [playerId, answered]);



  //* ==========================================================================
  //* UI rendering
  //* ==========================================================================

  if (!playerId) return <div className="text-center p-6">🔐 Missing player ID. Redirecting...</div>;

  if (error) return <div className="text-red-500 p-6 text-center">{error}</div>;

  if (!question) return <div className="text-center p-6">⏳ Waiting for next question...</div>;

  return (
    <>
      { !hasStarted && <PlayerGameLobby />}

      { gameOver && results && <PlayerGameFinalResults results={results} />}

      {/* Countdown before each question */}
      { hasStarted && !gameOver && question?.countdown && (
        <Countdown question={question} />
      )}

      {/* Show question screen */}
      {hasStarted && !gameOver && question && !answered && (
        <PlayerGamePlay
          question={question}
          onSubmit={submitAnswer}
        />
      )}

      {/* Answer has been submitted */}
      {hasStarted && !gameOver && answered && (
        <PlayerAnswerSubmitted />
      )}

      {/* Show if player got an answer right or wrong after each question */}
      {hasStarted && !gameOver && answered && (
        <PlayerGameQuestionResult
          answer={submittedAnswer}
          question={question}
        />
      )}
    </>
  );
}

export default PlayerGameView;