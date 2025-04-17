import LinkLogoNavBar from '../../../component/LinkLogoNavBar';
import { orangeButtonClass } from '../../../component/tailwind';
import { Link } from 'react-router-dom';

function PlayerGameResults() {
  const data = [
    {
      question: 'Who is the President of the US?',
      yourAnswer: 'Joe Biden',
      correctAnswer: 'Joe Biden',
      points: 1000,
      time: 5,
      isCorrect: true,
    },
    {
      question: 'Capital of France?',
      yourAnswer: 'Lyon',
      correctAnswer: 'Paris',
      points: 0,
      time: 7,
      isCorrect: false,
    },
    {
      question: '2 + 2 = ?',
      yourAnswer: '4',
      correctAnswer: '4',
      points: 50,
      time: 7,
      isCorrect: true,
    },
  ];
  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">
      <nav className="flex items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px] gap-2 sm:gap-0">
        <LinkLogoNavBar targetPath="/home" />
        <div className=" flex-1 text-center text-2xl sm:text-3xl font-Nunito-ExtraBold">
          Quiz Result
        </div>
        <Link to="/join" className={`${orangeButtonClass} px-5`}>Play again</Link>
      </nav>
      <main className="flex-1 flex justify-center items-center text-center p-6 bg-cyan-800 pb-25 text-white">
        <div className="flex flex-col gap-8 sm:gap-10 w-full sm:w-auto">
          <h1 className="font-Nunito-ExtraBold text-3xl sm:text-5xl">🏆 Total Score:&nbsp;
            {data.reduce((accumulator, data) => accumulator + data.points,0)}</h1>
          <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden font-bold">
            <thead className="bg-orange-500 text-white text-lg">
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
