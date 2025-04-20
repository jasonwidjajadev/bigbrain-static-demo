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












  /**
  question : {
    "answers": [
      0:{ "id": 1, "text": "4", "isCorrect": true },
      1:{ "id": 2, "text": "5", "isCorrect": false },
      2:{ "id": 3, "text": "6", "isCorrect": false },
      3:{ "id": 4, "text": "7", "isCorrect": false },
      4:{ "id": 5, "text": "8", "isCorrect": false },
      5:{ "id": 6, "text": "9", "isCorrect": false },
    duration:20,
    id:1745055052585,
    image:''
    "isoTimeLastQuestionStarted": "2025-04-19T13:00:00.000Z"
    points:10
    text: "2+2"
    type:multiple
    video:""
  }
   */


  // If the host skips during countdown, your PlayerGameView will poll a new question.
  // React.useEffect(() => {
  //   if (!question) return;
  //   if (answered) return;
  //   console.warn(" Host skipped — question changed mid-play. Resetting UI.");
  //   setAnswered(false);
  // }, [question.id]);



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
      // console.log("Player is going to submit:", selectedAnswers);
      // const res = await apiCall(`/play/${playerId}/answer`, 'PUT', { answers: selectedAnswers });
      await apiCall(`/play/${playerId}/answer`, 'PUT', { answers: selectedAnswers });
      setAnswered(true);
      setIndividualQuestionAnswerTime(new Date().toISOString());
      setIndividualQuestionAnswer(selectedAnswers);
      // console.log("Player just submitted his/her answer, response:", res);


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
        // setIndividualQuestionResult(res.answers);
        setTimeout(() => {
          setIndividualQuestionResult(res.answers);
        }, 2000);
        // console.log("The correct answer for the current question is:", res);
        clearInterval(interval);

      } catch (err) {

        if (err.message.includes('Answers are not available yet')) {
          // console.log("⏳ Waiting for host to reveal answers...");
          console.log("⏳");
        } else {
          console.error('❌ Failed to fetch answer:', err.message);
          // setError('Could not load correct answer.');
          clearInterval(interval);
        }
      }
    };

    fetchSubmittedAnswer();
    interval = setInterval(fetchSubmittedAnswer, 1000);

    return () => clearInterval(interval);
  }, [playerId, answered, gameOver]);



  // React.useEffect(() => {
  //   if (!playerId || !answered || gameOver || !question?.isoTimeLastQuestionStarted || !question?.duration) return;

  //   let interval = null;
  //   let timeout = null;

  //   const fetchSubmittedAnswer = async () => {
  //     try {
  //       const res = await apiCall(`/play/${playerId}/answer`, 'GET');
  //       setIndividualQuestionResult(res.answers);
  //       console.log("✅ Correct answer is now revealed:", res);
  //       clearInterval(interval);
  //     } catch (err) {
  //       if (err.message.includes('Answers are not available yet')) {
  //         console.log("⏳ Waiting for host to reveal answers...");
  //       } else {
  //         console.error('❌ Failed to fetch answer:', err.message);
  //         setError('Could not load correct answer.');
  //         clearInterval(interval);
  //       }
  //     }
  //   };

  //   const hostStartTime = new Date(question.isoTimeLastQuestionStarted).getTime();
  //   const now = Date.now();
  //   const revealTime = hostStartTime + question.duration * 1000 + 2000;
  //   const msUntilReveal = Math.max(0, Math.ceil(revealTime - now));

  //   timeout = setTimeout(() => {
  //     interval = setInterval(fetchSubmittedAnswer, 1000);
  //   }, msUntilReveal);

  //   return () => {
  //     clearTimeout(timeout);
  //     clearInterval(interval);
  //   };
  // }, [playerId, answered, gameOver, question]);



  //* ==========================================================================
  //* UI rendering
  //* ==========================================================================

  if (!playerId) return <div className="text-center p-6">🔐 Missing player ID. Redirecting...</div>;

  if (error) return <div className="text-red-500 p-6 text-center">{error}</div>;

  // if (!question) return <div className="text-center p-6">⏳ Waiting for next question...</div>;

  return (
    <>
      {/* The game is over, show final result of game */}
      { gameOver && results && <PlayerGameFinalResults results={results} history={answerHistory}/>}

      {/* Player just joined now they are in lobby room waiting for host to start */}
      { !hasStarted && !gameOver && <PlayerGameLobby />}

      {/* ================================================================== */}

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
      {/* If user has submitted an aswer, it shows answer has been submitted screen*/}
      {hasStarted && !gameOver && answered && !individualQuestionResult  && (
        <PlayerAnswerSubmitted />
      )}
