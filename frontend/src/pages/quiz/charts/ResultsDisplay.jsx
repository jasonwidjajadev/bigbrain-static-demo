import { Chart as ChartJS } from "chart.js/auto";
import { useState, useEffect } from "react";
import ScoreboardComponent from "./ScoreboardComponent";
import PercentageChartComponent from "./PercentageChartComponent";
import ResponseTimeComponent from "./ResponseTimeComponent";

function ResultsDisplay({ gameData, sessionResults }) {
  ChartJS.register();
  const [processedData, setProcessedData] = useState({
    players: [],
    questions: [],
    statistics: {
      questionStats: [],
      scoreBoard: [],
    },
  });

  const calculateTimeTaken = (answered, started) => {
    const timeAnswered = new Date(answered);
    const timeStarted = new Date(started);
    return Math.round((timeAnswered - timeStarted) / 1000);
  };

  const calculateScore = (isCorrect, timeTaken, maxTime, basePoints) => {
    if (!isCorrect) return 0;
    const timeFactor = 1 - timeTaken / maxTime;
    const score = Math.max(0, Math.round(basePoints * timeFactor));
    return score;
  };

  // Processes the Quiz Session Data
  const processQuizSessionData = (gameData, sessionResults) => {
    // Return default structure if data is incomplete
    if (!gameData?.questions || !sessionResults?.length) {
      return {
        players: [],
        questions: [],
        statistics: {
          questionStats: [],
          scoreBoard: [],
        },
      };
    }

    const questions = gameData.questions || [];
    const players = [];
    const playerScores = {};

    // Process each player's results
    sessionResults.forEach((playerData) => {
      const playerName = playerData.name;
      let totalScore = 0;

      // Process player answers
      const playerAnswers = playerData.answers.map((answer, index) => {
        // Add null/undefined check for question
        const question = index < questions.length ? questions[index] : null;

        // Default values if question is undefined
        const basePoints = question?.points || 0;
        const maxTime = question?.duration || 30; // Provide a default duration

        const questionStartedAt = answer.questionStartedAt;
        const answeredAt = answer.answeredAt;
        const timeTaken = calculateTimeTaken(answeredAt, questionStartedAt);
        const isCorrect = answer.correct;

        // Calculate score
        const score = calculateScore(isCorrect, timeTaken, maxTime, basePoints);
        totalScore += score;

        return {
          questionIndex: index,
          timeTaken,
          isCorrect,
          score,
          answers: answer.answers,
          question, // This might be null, which is okay
        };
      });

      players.push({
        name: playerName,
        answers: playerAnswers,
        totalScore,
      });

      playerScores[playerName] = totalScore;
    });

    // Calculate statistics for each question
    const questionStats = questions.map((question, questionIndex) => {
      const attempts = players.map(
        (player) =>
          player.answers[questionIndex] || { isCorrect: false, timeTaken: 0 }
      );

      const correctCount = attempts.filter((a) => a.isCorrect).length;
      const percentCorrect =
        players.length > 0 ? (correctCount / players.length) * 100 : 0;

      const avgTime =
        attempts.length > 0
          ? attempts.reduce((sum, a) => sum + a.timeTaken, 0) / attempts.length
          : 0;

      return {
        questionIndex,
        questionText: question.text || `Question ${questionIndex + 1}`,
        questionType: question.type,
        percentCorrect,
        avgTime,
        correctCount,
        totalAttempts: players.length,
      };
    });

    // Get ranked players by score
    const scoreBoard = Object.keys(playerScores)
      .map((name) => ({ nickName: name, score: playerScores[name] }))
      .sort((a, b) => b.score - a.score);

    return {
      players,
      questions,
      statistics: {
        questionStats,
        scoreBoard,
      },
    };
  };

  // Process the data when component mounts or when props change
  useEffect(() => {
    const data = processQuizSessionData(gameData, sessionResults);
    // console.log("Processed Data:", data);
    setProcessedData(data);
  }, [gameData, sessionResults]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 bg-base-100 border-base-300 p-2">
      {/* Scoreboard Component */}
      <ScoreboardComponent
        scoreboardData={processedData.statistics.scoreBoard}
      />

      {/* Percentage Chart Component */}
      <PercentageChartComponent
        questionStats={processedData.statistics.questionStats}
      />

      {/* Response Time Component */}
      <ResponseTimeComponent
        questionStats={processedData.statistics.questionStats}
      />

      {/* Point System */}
      <div className="flex flex-col items-center justify-center w-full space-y-3 bg-cyan-50 rounded p-4">
        <h2 className="font-bold text-lg mb-3">🔢 How scoring works</h2>
        <code className="mt-2 text-sm">
          Score = Max Points <br className="block sm:hidden" /> × (1 - Time
          Taken / Max Time)
        </code>
        <p className="mt-3 text-sm text-center">
          Answering instantly earns full points. Waiting too long gives fewer
          points. Wrong answers get 0.
        </p>
      </div>
    </div>
  );
}

export default ResultsDisplay;
