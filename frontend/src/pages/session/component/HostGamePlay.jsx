import React from 'react';
import { orangeButtonClass } from '../../../component/tailwind';
import LinkLogoNavBar from '../../../component/LinkLogoNavBar';
import { FaStop } from "react-icons/fa6";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import classroom from '../../../assets/classroom_overlay.png';
import chalkboard from '../../../assets/chalkboard.jpg';
import Music from './Music';
function HostGamePlay({question, position, length, onEnd, onNext, onComplete}) {
  const [count, setCount] = React.useState(Number(question.duration));
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



  const filteredAnswers = question.answers.filter(answer => answer.text.trim() !== '');
  return (
    <div className="min-h-screen overflow-y-auto flex flex-col
     bg-cover bg-center w-full overflow-hidden" style={{ backgroundImage: `url(${classroom})` }}>

      {/* //*NavBar */}
      <nav className=" flex justify-between items-center px-3 sm:px-8 py-2.5 bg-cyan-200 h-[65px] text-center">
        <LinkLogoNavBar targetPath="/dashboard" />
        <div className='flex gap-2 sm:gap-4'>

          {/* <button
            onClick={() => setIsMuted(!isMuted)}
            className={`${orangeButtonClass} flex items-center gap-3 px-5`}
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button> */}

          <Music className="mb-5"/>
          <button
            onClick={onEnd}
            className={`${orangeButtonClass} flex items-center gap-3`}>
            <FaStop className="text-[22px]"/>End
          </button>

          {/* For Smaller Screen */}
          <div className='block sm:hidden'>
            <button
              onClick={onNext}
              disabled={count === 0}
              className={`${orangeButtonClass} flex items-center gap-3`}>
              <TbPlayerTrackNextFilled className="text-[22px]"/>Skip
            </button>
          </div>
        </div>
      </nav>

      {/* //*Main */}
      <main className="flex-1 flex flex-col justify-center items-center text-center p-4 sm:p-8">
        <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-8">

          {/* //^ 1. Question */}
          <div className="text-3xl sm:text-4xl md:text-5xl font-Nunito-ExtraBold break-words">
            {question.text}
          </div>

          {/* //^ 2. Timer/Image/Next */}
          <div className="w-full flex flex-col sm:flex-row justify-around items-center gap-6 sm:gap-10">

            {/* Timer */}
            <div className="hidden sm:flex flex-col items-center w-[150px]">
              <div className="text-7xl font-Nunito-Bold h-35 w-35 rounded-full bg-orange-500 flex justify-center items-center text-white shrink-0">{count}</div>
            </div>

            {/* Image */}
            <div className='w-full max-w-2xl bg-green-500'>
              {question.image &&
                <img src={question.image} alt="quiz-image"
                  className="w-full h-auto max-h-[200px] sm:max-h-[400px] border-10 sm:border-13 border-orange-300 shadow-md object-cover" />
              }

              {!question.video && !question.image &&
                <div
                  className='h-[200px] sm:h-[400px] w-full
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
                  disabled={count === 0}
                  className={`${orangeButtonClass} flex items-center gap-3 px-7 py-3`}>
                  <TbPlayerTrackNextFilled className="text-[22px]"/>Skip
                </button>
              </div>
            </div>

          </div>

          {/* //^ 3. Answer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-Nunito-ExtraBold text-2xl text-gray-100">
            {filteredAnswers.map((choice, index) => {
              const colorClasses = [
                { base: 'bg-blue-400', hover: 'bg-blue-500', shadow: 'shadow-[0_4px_0_0_#1e3a8a]' },
                { base: 'bg-pink-400', hover: 'bg-pink-500', shadow: 'shadow-[0_4px_0_0_#9d174d]' },
                { base: 'bg-green-400', hover: 'bg-green-500', shadow: 'shadow-[0_4px_0_0_#166534]' },
                { base: 'bg-amber-400', hover: 'bg-amber-500', shadow: 'shadow-[0_4px_0_0_#ca8a04]' },
                { base: 'bg-purple-400', hover: 'bg-purple-500', shadow: 'shadow-[0_4px_0_0_#5901a1]' },
                { base: 'bg-cyan-300', hover: 'bg-cyan-400', shadow: 'shadow-[0_4px_0_0_#066b7c]' },
              ];
              const color = colorClasses[index % colorClasses.length];
              const baseStyle = `min-h-20 sm:min-h-25 w-full flex justify-between p-6 sm:p-6 gap-3 items-center rounded-md
              text-white break-all transition-all duration-300 ease-in-out hover:-translate-y-1`;
              const stateStyle = `${color.hover} ${color.shadow} hover:${color.base}`;
              return (
                <button key={index} className={`${baseStyle} ${stateStyle}`}>
                  {choice.text}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
export default HostGamePlay;

/*
  "questions": [
    {
      "id": 1744972867568,
      "type": "multiple",
      "text": "1+1",
      "duration": 20,
      "points": 10,
      "video": "",
      "image": "",
      "answers": [
        {"id": 1, "text": "2","isCorrect": true},
        {"id": 2,"text": "3","isCorrect": false},
        {"id": 3,"text": "","isCorrect": false},
        {"id": 4,"text": "","isCorrect": false},
        {"id": 5,"text": "","isCorrect": false},
        {"id": 6,"text": "","isCorrect": false}
      ]
    }
  ]
  */