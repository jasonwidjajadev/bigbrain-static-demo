import { FaStop } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { TbPlayerTrackNextFilled } from "react-icons/tb";

import classroom from '@/assets/classroom_overlay.png';
import chalkboard from '@/assets/chalkboard.jpg';

import LinkLogoNavBar from '@/components/logo/LogoNavBar';
import { orangeButtonClass } from '@/components/ui/tailwind';

import { formatBase64Image } from '@/util/imageUtils';

/**
 * HostQuestionResult component displays the result of a single quiz question from the host's perspective.
 *
 * - Shows the question text, media (image/video), and which answers were correct.
 * - Highlights correct vs. incorrect answers using color and icon (✓ / ✕).
 * - Provides "End" and "Next" controls to allow the host to move the quiz forward.
 * - Responsive layout optimized for small and large screens.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.question - The question object with text, answers, media, and correct answer IDs
 * @param {number} props.position - The current question index (1-based)
 * @param {number} props.length - The total number of questions in the quiz
 * @param {Function} props.onEnd - Callback triggered when the host clicks the "End" button
 * @param {Function} props.onNext - Callback triggered when the host clicks the "Next" button
 * @returns {JSX.Element} The rendered view of the question result screen
 */
function HostQuestionResult({ question, position, length, onEnd, onNext}) {
  const filteredAnswers = question.answers.filter(answer => answer.text.trim() !== '');

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col
     bg-cover bg-center w-full overflow-hidden" style={{ backgroundImage: `url(${classroom})` }}>

      {/* NavBar */}
      <nav className=" flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px] text-center">
        <LinkLogoNavBar targetPath="/dashboard" />
        <div className='flex gap-4'>
          <button
            onClick={onEnd}
            className={`${orangeButtonClass} flex items-center gap-3`}>
            <FaStop className="text-[22px]"/>End
          </button>

          {/* For Smaller Screen */}
          <div className='block sm:hidden'>
            <button
              onClick={onNext}
              className={`${orangeButtonClass} flex items-center gap-3`}>
              <TbPlayerTrackNextFilled className="text-[22px]"/>Next
            </button>
          </div>
        </div>
      </nav>

      {/* //*Main */}
      <main className="flex-1 flex flex-col justify-start items-center text-center p-4 sm:p-8">
        <div className="w-full sm:w-[90%] mx-auto space-y-4 sm:space-y-8">

          {/* //^ 1. Question */}
          <div className="text-3xl sm:text-4xl md:text-5xl font-Nunito-ExtraBold break-words">
            {question.text}
          </div>

          {/* //^ 2. Result */}
          <div className="w-full flex justify-between items-center gap-4 overflow-hidden">

            {/* Timer is hidden */}
            <div className='w-[150px] hidden md:block'></div>

            {/*<div className='w-full max-w-3xl bg-white rounded-md shadow p-4'>
              <div className="flex items-end justify-between sm:justify-around gap-2 sm:gap-4 w-full h-[200px] sm:h-[300px]">
                {color.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className={`${item.color} ${item.shadow} transition-all duration-300 w-full`}
                      style={{ height: `${(item.count / max) * maxBarHeight}px` }}
                    ></div>
                    <div className="mt-2 text-sm sm:text-lg font-bold text-wrap text-center w-full break-words">
                      {item.label} {item.count}
                    </div>
                  </div>
                ))}
              </div>
              <div className='font-Nunito-Bold text-xl pt-4'>3 player(s) did not submit an answer</div>
            </div> */}

            <div className='w-full max-w-2xl bg-gray-300'>
              {question.image &&
                <img src={formatBase64Image(question.image)} alt="quiz-image"
                  className="w-full h-auto max-h-[200px] sm:max-h-[400px] border-10 sm:border-13 border-orange-300 shadow-md object-cover" />
              }

              {!question.video && !question.image &&
                <div
                  className='h-[200px] sm:h-[400px] w-full
                    text-[45px] sm:text-6xl md:text-7xl text-emerald-100 font-ChalkLineOutline
                    border-10 sm:border-13 border-orange-300 shadow-md
                    flex justify-center items-center bg-cover bg-center break-words'
                  style={{ backgroundImage: `url(${chalkboard})` }}>
                  <span className="p-4">Big Brain</span>
                </div>
              }

              {question.video &&
                <div className="w-full border-10 sm:border-13 border-orange-300 shadow-md">
                  <iframe
                    className="w-full h-[200px] sm:h-[400px] object-cover"
                    src={question.video}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              }
            </div>

            {/* Next Button + qustion*/}
            <div className='hidden sm:block'>
              <div className="flex flex-col justify-center items-center gap-8">
                <div className="font-Nunito-Black text-2xl">Question {position}/{length}</div>
                <button
                  onClick={onNext}
                  className={`${orangeButtonClass} flex items-center gap-3 px-7 py-3`}>
                  <TbPlayerTrackNextFilled className="text-[22px]"/>Next
                </button>
              </div>
            </div>
          </div>

          {/* //^ 3. Answer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-Nunito-ExtraBold text-xl sm:text-2xl text-gray-100">
            {filteredAnswers.map((choice, index) => {
              const colorClasses = [
                { base: 'bg-blue-200', hover: 'bg-blue-500', shadow: 'shadow-[0_4px_0_0_#1e3a8a]' },
                { base: 'bg-pink-200', hover: 'bg-pink-500', shadow: 'shadow-[0_4px_0_0_#9d174d]' },
                { base: 'bg-green-200', hover: 'bg-green-500', shadow: 'shadow-[0_4px_0_0_#166534]' },
                { base: 'bg-amber-200', hover: 'bg-amber-500', shadow: 'shadow-[0_4px_0_0_#ca8a04]' },
                { base: 'bg-purple-200', hover: 'bg-purple-500', shadow: 'shadow-[0_4px_0_0_#5901a1]' },
                { base: 'bg-cyan-200', hover: 'bg-cyan-400', shadow: 'shadow-[0_4px_0_0_#066b7c]' },
              ];
              const color = colorClasses[index % colorClasses.length];
              const baseStyle = `min-h-20 sm:min-h-25 w-full flex justify-between p-4 sm:p-6 gap-3 items-center rounded-md
              text-white break-all`;

              // Check if this answer ID is in the correctAnswers array
              const isCorrect = question.correctAnswers.includes(choice.id);
              const stateStyle = `${isCorrect ? color.hover : color.base} ${color.shadow}`
              return (
                <button key={index} className={`${baseStyle} ${stateStyle}`}>
                  {choice.text}
                  {isCorrect ?
                    <FaCheck className='shrink-0' /> :
                    <IoCloseSharp className='font-extrabold text-5xl shrink-0' />
                  }
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

export default HostQuestionResult;
