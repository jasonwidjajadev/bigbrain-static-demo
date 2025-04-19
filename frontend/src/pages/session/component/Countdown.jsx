import classroom from '../../../assets/classroom_overlay.png';
import React from 'react';

function Countdown({question, onComplete}) {
  const [count, setCount] = React.useState(3);
  React.useEffect(() => {
    if (count <= 0) {
      if (onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

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
      <div className='flex-1 flex flex-col justify-center items-center'>
        <div className="text-7xl font-Nunito-Bold h-35 w-35 rounded-full bg-orange-500 flex justify-center items-center text-white shrink-0 mb-10">
          {count}
        </div>
        <div className="font-Nunito-Bold px-6 py-5 bg-cyan-800 text-2xl border-none rounded-md text-white mb-4">{text}</div>
        <div className="w-full font-Nunito-ExtraBold p-5 bg-cyan-500 text-xl border-none rounded-md text-white no-underline shadow-[0_4px_0_0_#0e7490] transition-all duration-300 ease-in-out hover:bg-cyan-400 hover:-translate-y-1 break-words">{description}</div>
      </div>
    </main>
  )
}
export default Countdown;