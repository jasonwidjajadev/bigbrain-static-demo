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

function ResultsDisplay({ index, gameData, sessionId, sessionResults }) {
  console.log("Index is", index);
  console.log("GameData is", gameData);
  console.log("sessionId is", sessionId);
  console.log("Session results is", sessionResults);

  // const scoreboardData = calculateScoreBoardData()
  const scoreboardData = [
    { nickName: "Tom", score: 3555 },
    { nickName: "Mark1", score: 2555 },
    { nickName: "Mark2", score: 1555 },
    { nickName: "Mark b", score: 555 },
    { nickName: "Mountain Panda", score: 5 },
  ];

  const index_normalised = index + 1;

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

  // Returns data in a format for the scoreboard
  const calculateScoreBoardData = () => {};

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
    sessionResults.forEach(playerData => {
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
          question
        };
      });
      
      players.push({
        name: playerName,
        answers: playerAnswers,
        totalScore
      });

    return gamesAndAnswersData;
  };

  const processQuiz = processQuizSessionData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 bg-base-100 border-base-300 p-2">
      {/* Scoreboard List */}
      <div className="w-full max-w-3xl space-y-3 bg-cyan-50 rounded p-2">
        <h2 className="text-3xl text-center font-Nunito-ExtraBold p-2 text-cyan-800">
          🎉 Scoreboard
        </h2>
        {scoreboardData.map((result, index) => (
          <div
            key={index}
            className={`flex justify-between items-center px-6 py-3 rounded-md shadow
                  text-xl sm:text-xl font-Nunito-ExtraBold
                  ${index === 0 ? "bg-orange-500" : "bg-cyan-800"}`}
          >
            <span className="text-white">{result.nickName}</span>
            <span className="text-white">{result.score}</span>
          </div>
        ))}
      </div>

      {/* Bar chart showing % of people who got certain questions correc */}
      <div className="w-full max-w-3xl space-y-3 bg-cyan-50 rounded p-2">
        <h2 className="text-3xl text-center font-Nunito-ExtraBold p-2 text-cyan-800">
          💯 Percentage
        </h2>
        <Bar
          data={{
            labels: ["A", "B", "C"],
            datasets: [
              {
                label: "Percentage correct",
                data: [200, 300, 400],
                borderRadius: 5,
              },
            ],
          }}
        />
      </div>

      {/* Average response time */}
      <div className="w-full max-w-3xl space-y-3 bg-cyan-50 rounded p-2">
        <h2 className="text-3xl text-center font-Nunito-ExtraBold p-2 text-cyan-800">
          ⌛ Response Time
        </h2>
        <Line
          data={{
            labels: ["Question 1", "Question 2", "Question 3"],
            datasets: [
              {
                label: "Response time",
                data: [10, 5, 20],
                borderRadius: 5,
              },
            ],
          }}
        />
      </div>
    </div>
  );
}

export default ResultsDisplay;
