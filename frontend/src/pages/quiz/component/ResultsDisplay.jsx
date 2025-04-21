/*
 const scoreboard data = [
    { nickName: 'Tom', score: 3555 },
    { nickName: 'Mark1', score: 2555 },
    { nickName: 'Mark2', score: 1555 },
    { nickName: 'Mark b', score: 555 },
    { nickName: 'Mountain Panda', score: 5 },
  ];
*/
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Radar, Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
import ScoreboardComponent from "./ScoreboardComponent";
import PercentageChartComponent from "./PercentageChartComponent";
import ResponseTimeComponent from "./ResponseTimeComponent";

function ResultsDisplay({ gameData, sessionResults }) {
  console.log("Game Data is", gameData);
  console.log("Sessions results", sessionResults);
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
        const question = questions[index];
        const basePoints = question.points;
        const maxTime = question.duration;

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
          question,
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
    console.log("Processed Data:", data);
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

      {/* Average response time */}
      {/* Response Time Component */}
      <ResponseTimeComponent
        questionStats={processedData.statistics.questionStats}
      />
    </div>
  );
}

export default ResultsDisplay;
