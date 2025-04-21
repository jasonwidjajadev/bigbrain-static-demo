import React from 'react';
import { useNavigate,  useParams } from 'react-router-dom';

import { useAuthContext } from "@/context/useAuthContext";
import { apiCall } from '@/util/apiCall';

import HostGameLobby from './HostGameLobby'
import HostGamePlay from './HostGamePlay'
import HostGameQuestionResult from './HostGameQuestionResult'
import HostGameFinalResults from './HostGameFinalResults'

/**
 * HostGameView is the main controller component for hosting a live quiz session.
 *
 * Orchestrate and renders different host-facing screens based on quiz state:
 *  - Lobby screen before the game starts.
 *  - Question screen during active gameplay.
 *  - Per-question result screen showing correct answers.
 *  - Final results screen showing overall rankings.
 *
 * Key responsibilities:
 *  - Fetch and verify the host's session and game ownership.
 *  - Poll the server to detect when the game starts (position > -1).
 *  - Progress through game stages: `lobby` → `question` → `answer` → `final`.
 *  - Trigger appropriate API calls to mutate game state (e.g. `ADVANCE`, `END`).
 *
 * @component
 * @returns {JSX.Element} Rendered view of the game for the host.
 */
function HostGameView() {

  const navigate = useNavigate();
  const { token, tokenReady } = useAuthContext();
  const { sessionId } = useParams();

  const [currSession, setCurrSession] = React.useState(null);
  const [currQuiz, setCurrQuiz] = React.useState(null);

  // LOBBY → [(COUNTDOWN + QUESTION) → RESULT] * N → FINAL RESULT
  const [stage, setStage] = React.useState('lobby');
  const [position, setPosition] = React.useState(-1);
  const [questions, setQuestions] = React.useState([]);
  const [hostFinalResults, setHostFinalResults] = React.useState(null);

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
        const sessionQuestions = sessionStatus.questions || [];
        setQuestions(sessionQuestions);

        // Step 2: If session is over, get results
        if (!sessionStatus.active || sessionStatus.position >= sessionQuestions.length) {
          const results = await apiCall(`/admin/session/${trimmedSessionId}/results`, 'GET', null, token);
          setHostFinalResults(results.results);
          setStage('final');
          return;
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

        // Step 4: Set initial stage and position
        const pos = sessionStatus.position;
        setPosition(pos);
        setStage(pos === -1 ? 'lobby' : 'question');

      } catch (err) {
        console.error('Error loading host game view:', err.message);
        navigate('/session/inactive');
      }
    };

    fetchSessionAndVerifyOwnership();
  }, [tokenReady, token, sessionId, navigate]);


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
          setStage('question');
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Failed to poll session:', err.message);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currQuiz, currSession?.position, sessionId, token]);

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
        setHostFinalResults(resultRes.results);
        setStage('final');
        return;
      }

      // Otherwise, advance to first question
      await apiCall(`/admin/game/${currQuiz.id}/mutate`, 'POST', { mutationType: 'ADVANCE'}, token);

    } catch (err) {
      console.error("Failed to start game:", err.message);
    }
  };

  //* ==========================================================================
  //* End Game
  //* ==========================================================================

  const handleEndGame = async () => {
    try {

      // Step 1: End the game
      await apiCall(`/admin/game/${currQuiz.id}/mutate`, 'POST', { mutationType: 'END' }, token);

      // Step 2: Fetch final results
      const resultRes = await apiCall(`/admin/session/${sessionId}/results`, 'GET', null, token);
      setHostFinalResults(resultRes.results);
      setStage('final');

    } catch (err) {
      console.error('❌ Failed to end game or fetch results:', err.message);
      throw new Error(err || "Network error something went wrong");
    }
  };

  //* ==========================================================================
  //* [COUNTDOWN → QUESTION → ANSWER] * N
  //* ==========================================================================

  const handleNext = async () => {
    try {

      // Advance to next stage/question
      await apiCall(`/admin/game/${currQuiz.id}/mutate`, 'POST', { mutationType: 'ADVANCE' }, token);

      const isLastQuestion = position + 1 >= questions.length;

      if (stage === 'question' || stage === 'answer') {
        if (isLastQuestion) {
          console.log('🎯 Last question reached — game will auto-end by backend');

          // No need to call END again, just fetch final results
          const resultRes = await apiCall(`/admin/session/${sessionId}/results`, 'GET', null, token);
          setHostFinalResults(resultRes.results);
          setStage('final');

        } else {
          setPosition((pos) => pos + 1);
          setStage('question');
        }
      }

    } catch (err) {
      console.error('❌ Failed to advance or fetch results:', err.message);
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
        <HostGameFinalResults
          hostFinalResults={hostFinalResults}
          quiz={currQuiz}
        />
      )}

      { stage === 'lobby' && currSession.position === -1 && (
        <HostGameLobby
          sessionId={sessionId}
          players={currSession.players || {}}
          showResults={handleEndGame}
          onStart={handleStartGame}
        />
      )}

      {questions.length === 0 && (stage === 'question' || stage === 'answer') && (
        <div className="text-center p-6 text-gray-500">Loading question...</div>
      )}

      {stage === 'question' && questions[position] && (
        <HostGamePlay
          key={position}
          question={questions[position]}
          position={Number(position) + 1}
          length={questions.length}
          onNext={handleNext}
          onEnd={handleEndGame}
          onComplete={() => setStage('answer')}
        />
      )}

      {stage === 'answer' && questions[position] && (
        <HostGameQuestionResult
          question={questions[position]}
          position={Number(position) + 1}
          length={questions.length}
          onNext={handleNext}
          onEnd={handleEndGame}
        />
      )}
    </>
  )
}

export default HostGameView;