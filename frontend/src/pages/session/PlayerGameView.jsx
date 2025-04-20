import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall } from '../../util/apiCall';
import PlayerGameLobby from './component/PlayerGameLobby'
import PlayerGamePlay  from './component/PlayerGamePlay'
import PlayerAnswerSubmitted from './component/PlayerAnswerSubmitted'
import PlayerGameQuestionResult from './component/PlayerGameQuestionResult'
import PlayerGameFinalResults from './component/PlayerGameFinalResults'
// import { useLocation } from 'react-router-dom';

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
  // const [countdownDone, setCountdownDone] = React.useState(false);
  const [question, setQuestion] = React.useState(null);

  // Answer
  // const [selectedAnswers, setSelectedAnswers] = React.useState([]);
  const [answered, setAnswered] = React.useState(false);
  const [individualQuestionAnswer, setIndividualQuestionAnswer] = React.useState(null);
  const [individualQuestionAnswerTime, setIndividualQuestionAnswerTime] = React.useState(null);
  const [individualQuestionResult, setIndividualQuestionResult] = React.useState(null);

  // Result
  const [gameOver, setGameOver] = React.useState(false);
  const [results, setResults] = React.useState(null);
  const [error, setError] = React.useState(null);

  const [answerHistory, setAnswerHistory] = React.useState([]);


  //* ==========================================================================
  //* 1. Retrieve/ Validate playerId
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
  //* 2. Check if Game is over + fetch results after game over
  //* ==========================================================================
  // GET, /play/:playerid/results

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
  //* 3. Lobby, check if game has started, GET, /play/:playerid/status
  //* ==========================================================================

  /* Initially
  playerId = null -> set playerId
  gameOver = false
  hasStarted = false
  */
  React.useEffect(() => {
    if (!playerId || gameOver) return;

    const interval = setInterval(async () => {
      try {
        const res = await apiCall(`/play/${playerId}/status`, 'GET');
        // console.log(res);
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
  //* Poll question, GET, /play/:playerid/question
  //* ==========================================================================

  const prevQuestionId = React.useRef(null);

  // React.useEffect(() => {
  //   if (!question) return;

  //   setAnswered(false);
  //   setIndividualQuestionAnswer(null);
  //   setIndividualQuestionResult(null);
  // }, [question?.id]);

  React.useEffect(() => {
    if (!playerId || !hasStarted || gameOver) return;

    const fetchQuestion = async () => {
      try {
        const res = await apiCall(`/play/${playerId}/question`, 'GET');
        // console.log("Fetching question from host: response", res);

        // if (prevQuestionId.current && prevQuestionId.current !== res.id) {
        //   console.warn('⚠️ Host skipped mid-question. Question was changed!');
        //   // TODO toast, animation, cancel timer, etc
        // }
        // prevQuestionId.current = res.id;

        // setQuestion(res.question);
        // setAnswered(false);
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
        } else {
          // console.log('⏳ Same question, no state change.');
          // console.log('.');
        }


      } catch (err) {
        const msg = err?.message || '';
        if (msg.includes('Session ID is not an active session')) {
          console.warn('Session ended, showing final results...');
          try {
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
