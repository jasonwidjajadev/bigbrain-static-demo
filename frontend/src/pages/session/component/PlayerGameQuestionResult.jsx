/**
Player Empty Answer Submission #1298
Zachary Lam
2 days ago in Assignments – A4 – Feature Set 3

The put request call for player answer submission requires the parsed answer array from the player to be non-empty. However, - specifically cases for multi-choice and single answer type questions - when a player only has one selected answer but then unselects it, the put request will throw an error. Similarly, players who instead wait for the timer to run out while not selecting any answers will send an empty answer array, which will also have this error.

Is this behaviour intended? As it makes sense for a player to submit no answers.
Hey Zachary,

This is fine. For single choice question, once player selected one answer, they have to select another answer to change their options so answer will always be sent to backend, same thing for judgement questions.

For multiple choices questions, you can assume we won't test the scenario as user still needs to select at least one answer.

You can restrict their un-select event on frontend or just treat this as an undefined behaviour.
*/
// import classroom from '../../../assets/classroom_overlay.png';


function PlayerGameQuestionResult() {
  //TODO quizid -> playerid -> question
  const data = {
    question: 'Who is the President of the US?',
    yourAnswer: 'Joe Biden',
    correctAnswer: 'Joe Biden',
    points: 1000,
    time: 5,
    isCorrect: false,
  }
  // const calculateScore = (isCorrect, timeTaken, maxTime, basePoints ) => {
  //   if (!isCorrect) return 0;
  //   const timeFactor = 1 - (timeTaken / maxTime);
  //   const score = Math.max(0, Math.round(basePoints * timeFactor));
  //   return score;
  // }

  return (
    <div className={`min-h-screen overflow-y-auto flex flex-col ${data.isCorrect ? 'bg-green-500' : 'bg-red-400'}`}>
      <nav className="flex items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px] gap-2 sm:gap-0">
        <div className=" flex-1 text-center text-2xl sm:text-3xl font-Nunito-ExtraBold">
          Question Result
        </div>
      </nav>
      <main className="flex-1 flex justify-center items-center text-center p-6 sm:mb-10 text-white ">
        <div className="flex flex-col gap-15">
          {/* Score */}
          {data.isCorrect ? (
            <div className="flex flex-col justify-center items-center gap-15">
              <div className="font-Nunito-ExtraBold text-5xl ">Correct &nbsp;✅</div>
              <div className="font-Nunito-Bold py-5 bg-cyan-800 text-3xl border-none rounded-md w-[300px] text-white">+ {data.points}</div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-15">
              <div className="font-Nunito-ExtraBold text-5xl">Incorrect &nbsp;❌</div>
              <div className="font-Nunito-Bold py-5 bg-cyan-800 text-3xl border-none rounded-md w-[300px] text-white">+ 0 point</div>
            </div>
          )}
          {/* Point System */}
          <div className={`${data.isCorrect ? 'bg-green-600 border-green-700' :'bg-red-500 border-red-700'} text-white p-4 rounded-md border-l-7  shadow mb-6`}>
            <h2 className="font-bold text-lg mb-3">🔢 How scoring works</h2>
            <code className="mt-2 text-sm">Score = Max Points <br className="block sm:hidden"/> × (1 - Time Taken ÷ Max Time)</code>
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