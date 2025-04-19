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
      const response = await apiCall(`/admin/game/${currQuiz.id}/mutate`, 'POST', {
        mutationType: 'ADVANCE'
      }, token);
      console.log("Game started!");
      console.log("Advancing to first question response is: ", response);
    } catch (err) {
      console.error("Failed to start game:", err.message);
      // throw new Error(err || "Network error something went wrong");
    }
  };

  //* ==========================================================================
  //* End Game
  //* ==========================================================================
  // how do we determine if a game is over? what is the condition? position = length -1 ?  and state 'ANSWER'
  // API call for stage answer