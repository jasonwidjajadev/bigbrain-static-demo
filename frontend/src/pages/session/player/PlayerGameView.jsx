import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall } from '@/util/apiCall';

import PlayerGameLobby from './PlayerGameLobby'
import PlayerGamePlay  from './PlayerGamePlay'
import PlayerAnswerSubmitted from './PlayerAnswerSubmitted'
import PlayerGameQuestionResult from './PlayerGameQuestionResult'
import PlayerGameFinalResults from './PlayerGameFinalResults'

/**
 * Main player-side game view.
 * Handles all phases of the quiz for a single player: lobby, question, answer submission, result per question, and final results.
 *
 * - Retrieves player ID from localStorage using session ID from the URL.
 * - Polls game status to determine whether the game has started.
 * - Polls for the current question and handles answer submission.
 * - Fetches result for each submitted answer and displays feedback.
 * - Cleans up localStorage when the game ends.
 * - Renders the appropriate screen based on the quiz stage.
 *
 * Internal UI stages:
 *    1. <PlayerGameLobby />            – Waiting room while game hasn't started
 *    2. <PlayerGamePlay />             – Main question view with timer and answer options
 *    3. <PlayerAnswerSubmitted />      – Shown after submission before feedback is ready
 *    4. <PlayerGameQuestionResult />   – Feedback showing correctness and score
 *    5. <PlayerGameFinalResults />     – Final results screen at the end of the game
 *
 * @component
 * @returns {JSX.Element} The full player-side quiz flow UI
 */
function PlayerGameView() {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const [playerId, setPlayerId] = React.useState(null);
  const [hasStarted, setHasStarted] = React.useState(false);
  const [question, setQuestion] = React.useState(null);

  const [answered, setAnswered] = React.useState(false);
  const [individualQuestionAnswer, setIndividualQuestionAnswer] = React.useState(null);
  const [individualQuestionAnswerTime, setIndividualQuestionAnswerTime] = React.useState(null);
  const [individualQuestionResult, setIndividualQuestionResult] = React.useState(null);

  const [gameOver, setGameOver] = React.useState(false);
  const [results, setResults] = React.useState(null);
  const [answerHistory, setAnswerHistory] = React.useState([]);
  const [error, setError] = React.useState(null);

  //* ==========================================================================
  //* 1. Retrieve/ Validate playerId
  //* ==========================================================================

  React.useEffect(() => {
    const playerMap = JSON.parse(localStorage.getItem('playerMap') || '{}');
    const id = playerMap[sessionId];
    if (!id) {
      navigate('/join');
    } else {
      setPlayerId(id);
    }
  }, [sessionId, navigate]);

  //* ==========================================================================
  //* 2. Lobby, check if game has started, GET, /play/:playerid/status
  //* ==========================================================================

  React.useEffect(() => {
    if (!playerId || gameOver) return;

    const interval = setInterval(async () => {
      try {
        const res = await apiCall(`/play/${playerId}/status`, 'GET');
        if (res.started === true) {
          setHasStarted(true);
          clearInterval(interval);
          console.log('🚀 Game has started!');
        }
      } catch (err) {
        console.error('❌ Failed to check game status:', err.message);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [playerId, gameOver]);

  //* ==========================================================================
  //* 2. Poll question, GET, /play/:playerid/question
  //* ==========================================================================

  const prevQuestionId = React.useRef(null);

  React.useEffect(() => {
    if (!playerId || !hasStarted || gameOver) return;

    const fetchQuestion = async () => {
      try {
        const res = await apiCall(`/play/${playerId}/question`, 'GET');

        const newQuestion = res.question;
        if (prevQuestionId.current !== newQuestion.id) {
          console.warn('⚠️ New question detected!');
          console.warn(newQuestion);
          prevQuestionId.current = newQuestion.id;
          setQuestion(newQuestion);
          setAnswerHistory((prev) => [...prev, newQuestion]);
          setAnswered(false);
          setIndividualQuestionAnswer(null);
          setIndividualQuestionResult(null);
        }
      } catch (err) {
        const msg = err?.message || '';
        if (msg.includes('Session ID is not an active session')) {
          console.warn('Session ended, showing final results...');
          try {

            /**
             * API call when game is over
             */
            const res2FinalResult = await apiCall(`/play/${playerId}/results`, 'GET');
            console.log("The current is now over the result is:", res2FinalResult);

            setResults(res2FinalResult);
            setGameOver(true);
          } catch (resErr) {
            const resultErrMsg = resErr?.message || '';
            if (resultErrMsg.includes('Session is ongoing')) {
              console.log('⏳ Game still in progress — ignore premature session close.');
            } else {
              console.error('❌ Failed to fetch results after session ended:', resultErrMsg);
              setError('Could not load final results.');
            }
          }
        } else {
          console.warn('⚠️ No question available yet:', msg);
        }
      }
    };

    fetchQuestion();
    const interval = setInterval(fetchQuestion, 1000);
    return () => clearInterval(interval);
  }, [playerId, hasStarted, gameOver]);

  React.useEffect(() => {
    if (!sessionId) return;
    if (gameOver && playerId) {
      const playerMap = JSON.parse(localStorage.getItem('playerMap') || '{}');
      delete playerMap[sessionId];
      localStorage.setItem('playerMap', JSON.stringify(playerMap));
      console.log('✅ Cleaned up playerId from localStorage');
    }
  }, [gameOver, playerId, sessionId]);

  //* ==========================================================================
  //* Submit Answers, PUT, /play/:playerid/answer
  //* ==========================================================================

  const submitAnswer = async (selectedAnswers) => {
    if (answered) return;
    if (!Array.isArray(selectedAnswers) || selectedAnswers[0] === -1) {
      setAnswered(true);
      setIndividualQuestionAnswerTime(new Date().toISOString());
      setIndividualQuestionAnswer(selectedAnswers || []);
      return;
    }
    try {
      await apiCall(`/play/${playerId}/answer`, 'PUT', { answers: selectedAnswers });
      setAnswered(true);
      setIndividualQuestionAnswerTime(new Date().toISOString());
      setIndividualQuestionAnswer(selectedAnswers);
    } catch (err) {
      console.error('❌ Error submitting answer:', err.message);
    }
  };

  //* ==========================================================================
  //* Show Individual Question results, GET, /play/:playerid/answer
  //* ==========================================================================

  React.useEffect(() => {
    if (!playerId || !answered || gameOver) return;
    let interval = null;

    const fetchSubmittedAnswer = async () => {
      try {
        const res = await apiCall(`/play/${playerId}/answer`, 'GET');
        setTimeout(() => {
          setIndividualQuestionResult(res.answers);
        }, 2000);
        clearInterval(interval);

      } catch (err) {

        if (err.message.includes('Answers are not available yet')) {
          console.log("⏳");
        } else {
          console.error('❌ Failed to fetch answer:', err.message);
          clearInterval(interval);
        }
      }
    };

    fetchSubmittedAnswer();
    interval = setInterval(fetchSubmittedAnswer, 1000);

    return () => clearInterval(interval);
  }, [playerId, answered, gameOver]);

  //* ==========================================================================
  //* UI rendering
  //* ==========================================================================

  if (!playerId) return <div className="text-center p-6">🔐 Missing player ID. Redirecting...</div>;

  if (error) return <div className="text-red-500 p-6 text-center">{error}</div>;

  return (
    <>
      {/* The game is over, show final result of game */}
      { gameOver && results && <PlayerGameFinalResults results={results} history={answerHistory}/>}

      {/* Player just joined now they are in lobby room waiting for host to start */}
      { !hasStarted && !gameOver && <PlayerGameLobby />}

      {/* Show question screen */}
      {hasStarted && !gameOver && question && !answered && (
        <PlayerGamePlay
          question={question}
          onSubmit={submitAnswer}
          onComplete={submitAnswer}
          answered={answered}
        />
      )}

      {/* Intermidary before showing result of answer, showing player has submitted answer*/}
      {hasStarted && !gameOver && answered && !individualQuestionResult  && (
        <PlayerAnswerSubmitted />
      )}

      {/* Show if player got an answer right or wrong after each question */}
      {hasStarted && !gameOver && answered && individualQuestionResult && (
        <PlayerGameQuestionResult
          playerAnswer={individualQuestionAnswer}
          correctAnswer={individualQuestionResult}
          currQuestion={question}
          individualQuestionAnswerTime={individualQuestionAnswerTime}
        />
      )}
    </>
  );
}

export default PlayerGameView;