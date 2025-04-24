import React from 'react';
import classroom from '@/assets/classroom_overlay.png';

/**
 * Countdown component shows a 3-second timer before revealing the actual question.
 *
 * - Displays the current countdown value in a large circular UI.
 * - Shows contextual instructions based on the question type:
 *   - "single": Single choice question
 *   - "judgement": Judgement question
 *   - "multiple": Multiple choice question with submit required
 * - Triggers `onComplete` callback when countdown finishes.
 * - Optionally displays the current question number (position / length).
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} [props.position] - Current question index (1-based)
 * @param {number} [props.length] - Total number of questions in the quiz
 * @param {Object} [props.question] - The question object (used to determine type)
//  * @param {Function} props.onComplete - Callback triggered after countdown ends
 * @returns {JSX.Element} The rendered countdown screen
 */
// function Countdown({position, length, question, onComplete}) {
function Countdown({ position, length, question }) {
  const [count, setCount] = React.useState(3);

  /**
   * Countdown effect that decrements the count every second.
   * Once the counter reaches 0, the `onComplete` callback is triggered.
   */
  React.useEffect(() => {
    if (count <= 0) {
      // if (onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  // }, [count, onComplete]);
  }, [count]);

  // Determine instructions based on question type
  let text = '';
  let description = '';
  if (question?.type === 'single') {
    text = 'Single choice question';
    description = 'Only a single answer is correct'
  } else if (question?.type === 'judgement') {
    text = 'Judgement question';
    description = 'Only a single answer is correct'
  } else {
    text = 'Multiple choice question';
    description = 'Multiple answers might be correct, you must click "SUBMIT" to answer'
  }

  return (
    <main
      className="flex-1 flex flex-col items-center text-center p-6 bg-cover bg-center h-screen"
      style={{ backgroundImage: `url(${classroom})` }}
    >
      <div className='flex-1 flex flex-col justify-center items-center pb-20'>
        {position && length && <h1 className="text-5xl sm:text-7xl font-Nunito-ExtraBold mb-15 text-black">Question {position}/{length}</h1>}
        {!position && !length && <h1 className="text-5xl sm:text-7xl font-Nunito-ExtraBold mb-15 text-black">Countdown</h1>}
        <div className="text-7xl font-Nunito-Bold h-35 w-35 rounded-full bg-orange-500 flex justify-center items-center text-white shrink-0 mb-10">
          {count}
        </div>
        {question && (
          <>
            <div className="font-Nunito-Bold px-6 py-5 bg-cyan-800 text-2xl border-none rounded-md text-white mb-4">{text}</div>
            <div className="w-full font-Nunito-ExtraBold p-5 bg-cyan-500 text-xl border-none rounded-md text-white no-underline shadow-[0_4px_0_0_#0e7490] transition-all duration-300 ease-in-out hover:bg-cyan-400 hover:-translate-y-1 break-words">{description}</div>
          </>
        )}
      </div>
    </main>
  )
}

export default Countdown;