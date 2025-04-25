import LinkLogoNavBar from '@/components/logo/LogoNavBar';
import Button from '@/components/button/Button';

/**
 * Renders the final game results screen for a player after completing the quiz.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.results - Array of result data from the backend
 * @param {Array<Object>} props.history - Array of question history data including answers, timing, and points
 * @returns {JSX.Element} The rendered result page
 */
function PlayerGameResults({ results, history }) {

  /**
   * Merges result and history data by matching the question start time.
   */
  const mergedData = history.map((histItem, index) => {
    const result = results[index] || {
      answers: [],
      correct: false,
      answeredAt: null,
      questionStartedAt: null,
    };

    return {
      history: histItem,
      result,
    };
  });

  /**
   * Calculates the time taken by the player to answer a question in seconds.
   */
  const calculateTimeTaken = (answered, started) => {
    const timeAnswered = new Date(answered);
    const timeStarted = new Date(started);
    return Math.round((timeAnswered - timeStarted) / 1000);
  };

  /**
   * Calculates the score based on whether the answer is correct and how fast it was answered.
   */
  const calculateScore = (isCorrect, timeTaken, maxTime, basePoints ) => {
    if (!isCorrect) return 0;
    const timeFactor = 1 - (timeTaken / maxTime);
    const score = Math.max(0, Math.round(basePoints * timeFactor));
    return score;
  }

  /**
   * Builds a cleaned data array of the player's answers and performance per question.
   */
  const data = mergedData.map((item) => {
    const { history, result } = item;
    const answers = history.answers || [];

    const selectedIds = result.answers || [];
    const hasAnswered = selectedIds.length > 0;

    // Show player's answer if answered, otherwise "none"
    const playerAnswerTexts = hasAnswered
      ? answers
        .filter(ans => selectedIds.includes(ans.id))
        .map(ans => ans.text)
        .join(', ')
      : 'none';

    // Always show correct answers, even if unanswered
    const correctAnswerTexts = answers
      .filter(ans => ans.isCorrect)
      .map(ans => ans.text)
      .join(', ') || 'N/A';

    // Use full duration if unanswered
    const timeTaken = result.answeredAt
      ? calculateTimeTaken(result.answeredAt, result.questionStartedAt)
      : history.duration || 0;

    // Show 0 points if unanswered
    const points = result.answeredAt && history.duration != null && history.points != null
      ? calculateScore(result.correct, timeTaken, history.duration, history.points)
      : 0;

    return {
      question: history.text || 'N/A',
      yourAnswer: playerAnswerTexts,
      correctAnswer: correctAnswerTexts,
      points,
      time: timeTaken,
      isCorrect: result.correct === true // ensure true only
    };
  });

  /**
   * Render UI for player final result page
   */
  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">
      <nav className="flex items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px] gap-2 sm:gap-0">
        <LinkLogoNavBar targetPath="/home" />
        <div className=" flex-1 text-center text-2xl sm:text-3xl font-Nunito-ExtraBold">
          Quiz Result
        </div>
        <Button to="/join" color='pink'>Play again</Button>
      </nav>
      <main className="flex-1 flex justify-center items-center text-center p-6 bg-cyan-800 pb-25 text-white">
        <div className="flex flex-col gap-8 sm:gap-10 w-full sm:w-auto">
          <h1 className="font-Nunito-ExtraBold text-3xl sm:text-5xl">🏆 Total Score:&nbsp;
            {data.reduce((acc, q) => acc + (typeof q.points === 'number' ? q.points : 0), 0)}
          </h1>
          <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden font-bold">
            <thead className="bg-pink-600 text-white text-lg">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3 hidden sm:table-cell">Question</th>
                <th className="p-3">Your Answer</th>
                <th className="p-3 hidden md:table-cell">Correct Answer</th>
                <th className="p-3 text-center ">Points</th>
                <th className="p-3 text-center hidden md:table-cell">Time</th>
                <th className="p-3 text-center">Result</th>
              </tr>
            </thead>
            <tbody>
              {data.map((q, index) => (
                <tr key={index} className={ q.isCorrect ? "border-t border-gray-200 hover:bg-orange-100 text-gray-800" : "border-t border-gray-200 bg-red-100 hover:bg-orange-100 text-gray-800"}>
                  <td className="p-3 px-5">{index + 1}</td>
                  <td className="p-3 hidden sm:table-cell">{q.question}</td>
                  <td className="p-3 ">{q.yourAnswer}</td>
                  <td className="p-3 hidden md:table-cell">{q.correctAnswer}</td>
                  <td className="p-3 text-center ">{q.points}</td>
                  <td className="p-3 text-center hidden md:table-cell">{q.time}s</td>
                  <td className="p-3 text-center text-xl">{q.isCorrect ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default PlayerGameResults;