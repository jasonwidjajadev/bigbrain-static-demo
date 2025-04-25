/**
 * Displays a ranking of players based on their quiz scores
 *
 * @param {Object} props - Component props
 * @param {Array} props.scoreboardData - Array of player scores sorted in descending order
 * @param {string} props.scoreboardData[].nickName - Player's name
 * @param {number} props.scoreboardData[].score - Player's total score
 * @returns {React.ReactElement} Scoreboard component
 */
function ScoreboardComponent({ scoreboardData }) {
  return (
    <div className="w-full max-w-3xl space-y-3 bg-cyan-50 rounded p-2">
      <h2 className="text-3xl text-center font-Nunito-ExtraBold p-2 text-cyan-800">
        🎉 Scoreboard
      </h2>
      {scoreboardData.length > 0 ? (
        scoreboardData.map((result, index) => (
          <div
            key={index}
            className={`flex justify-between items-center px-6 py-3 rounded-md shadow
                  text-xl sm:text-xl font-Nunito-ExtraBold
                  ${index === 0 ? "bg-pink-500" : "bg-cyan-800"}`}
          >
            <span className="text-white">{result.nickName}</span>
            <span className="text-white">{result.score}</span>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 p-4">No data available</div>
      )}
    </div>
  );
}

export default ScoreboardComponent;
