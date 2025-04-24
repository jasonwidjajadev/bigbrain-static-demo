import React from 'react';

import classroom from '@/assets/classroom_overlay.png';
import chalkboard from '@/assets/chalkboard.jpg';

import { formatBase64Image } from '@/util/imageUtils';
import Button from '@/components/button/Button';

/**
 * Renders the gameplay screen for a quiz question.
 * Handles countdown timer, answer selection, and submission logic.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.question - The current question data (text, type, answers, media, duration)
 * @param {Function} props.onSubmit - Callback to submit selected answer(s)
 * @param {Function} props.onComplete - Callback called when the timer finishes
 * @param {boolean} props.answered - Whether the player has already submitted an answer
 * @returns {JSX.Element} The rendered question gameplay screen
 */
function PlayerGamePlay({question, onSubmit, onComplete, answered}) {
  const [selected, setSelected] = React.useState([]);
  const [count, setCount] = React.useState(Number(question.duration));
  const [submitted, setSubmitted] = React.useState(false);

  /**
   * Reset state when question ID changes (new question is loaded).
   */
  React.useEffect(() => {
    if (!question?.id) return;
    setSelected([]);
    setSubmitted(false);
    setCount(Number(question.duration));
  }, [question.id]);

  /**
   * Countdown timer logic. Automatically submits an answer when time is up.
   */
  React.useEffect(() => {
    if (submitted || answered) return;
    if (count <= 0) {
      handleSubmit([-1]);
      console.warn("⏰ Time is up — skipping submission.");
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete, answered]);

  /**
   * Handles submission of answers.
   *
   */
  const handleSubmit = (answers) => {
    if (submitted || answered) return;
    setSubmitted(true);
    onSubmit(answers);
  };

  const filteredAnswers = question.answers.filter(answer => answer.text.trim() !== '');

  /**
   * Render the gameplay interface, including countdown, question, media, answers, and submission buttons.
   */
  return (
    <div className="min-h-screen overflow-y-auto flex flex-col
    bg-cover bg-center w-full overflow-hidden" style={{ backgroundImage: `url(${classroom})` }}>

      {/* Nav for Smaller Screen */}
      {question.type === 'multiple' &&
        <div className='block sm:hidden'>
          <nav className=" flex justify-end px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px] text-center">
            <Button
              color='pink'
              onClick={() =>
                handleSubmit(selected.map(i => filteredAnswers[i]?.id))
              }
              disabled={submitted}
            >
              Submit
            </Button>
          </nav>
        </div>
      }

      {/* //*Main */}
      <main className="flex-1 flex flex-col justify-start items-center text-center p-4 sm:p-8">
        <div className="w-full sm:w-[90%] mx-auto space-y-4 sm:space-y-8">

          {/* //^ 1. Question ======================================== */}
          <div className="text-3xl sm:text-4xl md:text-5xl font-Nunito-ExtraBold break-words">
            {question.text}
          </div>

          {/* //^ 2. Timer/Image/Next ================================ */}
          <div className="w-full flex flex-col sm:flex-row justify-around items-center gap-6 sm:gap-10">

            {/* Timer ================================================ */}
            <div className="hidden sm:flex flex-col items-center gap-5">
              <div className="text-7xl font-Nunito-Bold h-35 w-35 rounded-full bg-pink-600 flex justify-center items-center text-white shrink-0">{count}</div>
            </div>

            {/* Image ================================================ */}
            <div className='w-full max-w-2xl bg-gray-300'>
              {question.image &&
                <img src={formatBase64Image(question.image)} alt="quiz-image"
                  className="w-full h-auto max-h-[200px] sm:max-h-[400px] lg:h-[400px] border-10 sm:border-13 border-orange-300 shadow-md object-cover" />
              }

              {!question.video && !question.image &&
                <div
                  className='h-[200px] sm:h-[400px] w-full lg:h-[400px]
                    text-4xl sm:text-6xl md:text-7xl text-emerald-100 font-ChalkLineOutline
                    border-10 sm:border-13 border-orange-300 shadow-md
                    flex justify-center items-center bg-cover bg-center break-words'
                  style={{ backgroundImage: `url(${chalkboard})` }}>
                  Big Brain
                </div>
              }

              {question.video &&
                <div className="w-full border-10 sm:border-13 border-orange-300 shadow-md">
                  <iframe
                    className="w-full h-[200px] sm:h-[400px] object-cover lg:h-[400px]"
                    src={question.video}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              }
            </div>

            {/* Submit button on large screens ======================= */}
            <div className='w-35 hidden sm:block'>
              {question.type === 'multiple' &&
                <Button
                  color='pink'
                  onClick={() =>
                    handleSubmit(selected.map(i => filteredAnswers[i]?.id))
                  }
                  disabled={submitted}
                >
                  Submit
                </Button>
              }
            </div>
          </div>

          {/* //^ 3. Answer ========================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-Nunito-ExtraBold text-2xl text-gray-100">
            {(question.type === 'single' ||  question.type === 'judgement') &&
              <>
                {filteredAnswers.map((choice, index) => {

                  //For single and judgement choice
                  const colorClasses = [
                    { hover: 'bg-blue-400', base: 'bg-blue-500', shadow: 'shadow-[0_4px_0_0_#1e3a8a]' },
                    { hover: 'bg-red-400', base: 'bg-red-500', shadow: 'shadow-[0_4px_0_0_#8c0007]' },
                    { hover: 'bg-green-400', base: 'bg-green-500', shadow: 'shadow-[0_4px_0_0_#166534]' },
                    { hover: 'bg-amber-400', base: 'bg-amber-500', shadow: 'shadow-[0_4px_0_0_#ca8a04]' },
                    { hover: 'bg-purple-400', base: 'bg-purple-500', shadow: 'shadow-[0_4px_0_0_#5901a1]' },
                    { hover: 'bg-cyan-300', base: 'bg-cyan-400', shadow: 'shadow-[0_4px_0_0_#066b7c]' },
                  ];

                  const color = colorClasses[index % colorClasses.length];
                  const baseStyle = `min-h-20 sm:min-h-25 w-full flex justify-center items-center rounded-md
                  transition-all duration-300 ease-in-out text-white hover:-translate-y-1`;
                  const stateStyle = `${color.base} ${color.shadow} hover:${color.hover}`;

                  return (
                    <button
                      key={index}
                      className={`${baseStyle} ${stateStyle}`}
                      onClick={() => handleSubmit([choice.id])}
                    >
                      {choice.text}
                    </button>
                  );
                })}
              </>
            }

            {question.type === 'multiple' &&
              <>
                {filteredAnswers.map((choice, index) => {
                  const colorClasses = [
                    { base: 'bg-cyan-900', hover: 'bg-blue-500', shadow: 'shadow-[0_4px_0_0_#1e3a8a]' },
                    { base: 'bg-cyan-900', hover: 'bg-red-500', shadow: 'shadow-[0_4px_0_0_#8c0007]' },
                    { base: 'bg-cyan-900', hover: 'bg-green-500', shadow: 'shadow-[0_4px_0_0_#166534]' },
                    { base: 'bg-cyan-900', hover: 'bg-amber-500', shadow: 'shadow-[0_4px_0_0_#ca8a04]' },
                    { base: 'bg-cyan-900', hover: 'bg-purple-500', shadow: 'shadow-[0_4px_0_0_#5901a1]' },
                    { base: 'bg-cyan-900', hover: 'bg-cyan-400', shadow: 'shadow-[0_4px_0_0_#066b7c]' },
                  ];
                  const color = colorClasses[index % colorClasses.length];
                  const isSelected = selected.includes(index);
                  const baseStyle = `min-h-20 sm:min-h-25 w-full flex justify-center items-center rounded-md
                  transition-all duration-300 ease-in-out text-white hover:-translate-y-1`;
                  const stateStyle = isSelected
                    ? `${color.hover} ${color.shadow}`
                    : `${color.base} ${color.shadow} hover:${color.hover}`;

                  return (
                    <button
                      key={index}
                      className={`${baseStyle} ${stateStyle}`}
                      onClick={() => { isSelected
                        ? (setSelected(selected.filter(i => i !== index)))  // remove
                        : (setSelected([...selected, index]))               // add
                      }}
                    >
                      {choice.text}
                    </button>
                  );
                })}
              </>
            }
          </div>
        </div>
      </main>
    </div>
  )
}

export default PlayerGamePlay;