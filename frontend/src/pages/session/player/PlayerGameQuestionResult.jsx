/**
 * Displays the result of a single question for the player,
 * including whether they were correct and how many points they earned.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array<string>} props.playerAnswer - Array of answer IDs selected by the player
 * @param {Array<string>} props.correctAnswer - Array of correct answer IDs for the question
 * @param {Object} props.currQuestion - Current question data including duration, points, and timestamp
 * @param {string} props.individualQuestionAnswerTime - ISO timestamp of when the player submitted their answer
 * @returns {JSX.Element} The rendered question result screen
 */
function PlayerGameQuestionResult({playerAnswer, correctAnswer, currQuestion, individualQuestionAnswerTime}) {

  // Determine if the player's answer is exactly equal to the correct answer (order doesn't matter).
  const isCorrect = playerAnswer.length === correctAnswer.length && playerAnswer.every(a => correctAnswer.includes(a));

  // Calculate score based on correctness and speed.
  const calculateScore = (isCorrect, timeTaken, maxTime, basePoints ) => {
    if (!isCorrect) return 0;
    const timeFactor = 1 - (timeTaken / maxTime);
    const score = Math.max(0, Math.round(basePoints * timeFactor));
    return score;
  }

  // Calculate the time the player took to answer the question.
  const calculateTimeTaken = (answered, started) => {
    const timeAnswered = new Date(answered);
    const timeStarted = new Date(started);
    return Math.round((timeAnswered - timeStarted) / 1000);
  };

  const timeTaken = calculateTimeTaken(individualQuestionAnswerTime, currQuestion.isoTimeLastQuestionStarted);
  const points = calculateScore(isCorrect, timeTaken,currQuestion.duration, currQuestion.points);

  // Render the result for the current question.
  return (
    <div className={`min-h-screen overflow-y-auto flex flex-col ${isCorrect ? 'bg-green-500' : 'bg-red-400'}`}>
      <nav className="flex items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px] gap-2 sm:gap-0">
        <div className=" flex-1 text-center text-2xl sm:text-3xl font-Nunito-ExtraBold">
          Question Result
        </div>
      </nav>
      <main className="flex-1 flex justify-center items-center text-center p-6 sm:mb-10 text-white ">
        <div className="flex flex-col gap-15">

          {/* Score */}
          {isCorrect ? (
            <div className="flex flex-col justify-center items-center gap-15">
              <div className="font-Nunito-ExtraBold text-5xl ">Correct &nbsp;✅</div>
              {typeof points === 'number' && <div className="font-Nunito-Bold py-5 bg-cyan-800 text-3xl border-none rounded-md w-[300px] text-white">+ {points}</div>}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-15">
              <div className="font-Nunito-ExtraBold text-5xl">Incorrect &nbsp;❌</div>
              {<div className="font-Nunito-Bold py-5 bg-cyan-800 text-3xl border-none rounded-md w-[300px] text-white">+ 0 point</div>}
            </div>
          )}

          {/* Point System */}
          <div className={`${isCorrect ? 'bg-green-600 border-green-700' :'bg-red-500 border-red-700'} text-white p-4 rounded-md border-l-7  shadow mb-6`}>
            <h2 className="font-bold text-lg mb-3">🔢 How scoring works</h2>
            <code className="mt-2 text-sm">Score = Max Points <br className="block sm:hidden"/> × (1 - Time Taken / Max Time)</code>
            <p className="mt-3 text-sm">
              Answering instantly earns full points. Waiting too long gives fewer points.
              Wrong answers get 0.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PlayerGameQuestionResult;