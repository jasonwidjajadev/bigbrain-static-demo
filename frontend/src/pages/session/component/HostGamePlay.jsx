


import React from 'react';
// import { useNavigate, Link, useLocation } from 'react-router-dom';
import { orangeButtonClass } from '../../../component/tailwind';
// import LogoNavBar from '../../../component/LogoNavBar';
import LinkLogoNavBar from '../../../component/LinkLogoNavBar';
import { FaStop } from "react-icons/fa6";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import classroom from '../../../assets/classroom_overlay.png';
// import logo_blue from '../../../assets/logo_blue.png';
// import white_house from '../../../assets/white_house.png';
// import chalkboard from '../../../assets/chalkboard.jpg';


function HostGamePlay() {
  const data = {
    "questions": [
      {
        "id": 0,
        "questionString": "Who is the president of America?",
        "answers": [
          { "id": 0, "value": "Donald Trump", "correct": true},
          { "id": 1, "value": "Xi Jinping", "correct": false},
          { "id": 2, "value": "Vladimir Putin", "correct": false},
          { "id": 3, "value": "Elon Musk", "correct": false},
          { "id": 4, "value": "Dracula", "correct": false},
          { "id": 5, "value": "Kanye West", "correct": false}
        ],
        "time": 10,
        "embed": "/static/media/default_quiz_thumbnail.8acd421a181f51f4d02f.png",
        "point": 2,
        "type": "single"
      }
    ]
  };

  const [selected, setSelected] = React.useState([]);
  const choices = ['Donald Trump', 'Xi Jinping', 'Vladimir Putin', 'Elon Musk'];
  // const choices = ['Donald Trump', 'Xi Jinping', 'Vladimir Putin', 'Elon Musk', 'Dracula', 'Kanye West'];
  return (
    <div className="min-h-screen overflow-y-auto flex flex-col
     bg-cover bg-center w-full overflow-hidden" style={{ backgroundImage: `url(${classroom})` }}>
      {/* //*NavBar */}
      <nav className=" flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px] text-center">
        <LinkLogoNavBar targetPath="/dashboard" />
        <div className='flex gap-4'>
          <button className={`${orangeButtonClass} flex items-center gap-3 px-5`}>
            <FaStop className="text-[22px]"/>End
          </button>

          {/* For Smaller Screen */}
          <div className='block sm:hidden'>
            <button className={`${orangeButtonClass} flex items-center gap-3 px-5`}>
              <TbPlayerTrackNextFilled className="text-[22px]"/>Next
            </button>
          </div>
        </div>
      </nav>

      {/* //*Main */}
      <main className="flex-1 flex flex-col justify-center items-center text-center p-4 sm:p-8">
        <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-8">

          {/* //^ 1. Question */}
          <div className="text-3xl sm:text-4xl md:text-5xl font-Nunito-ExtraBold break-words">
            {data.questions[0].questionString}
          </div>

          {/* //^ 2. Timer/Image/Next */}
          {/* <div className='w-full flex justify-between items-center gap-10'> */}
          <div className="w-full flex flex-col sm:flex-row justify-around items-center gap-6 sm:gap-10">

            {/* Timer */}
            <div className="hidden sm:flex flex-col items-center w-[150px]">
              <div className="text-7xl font-Nunito-Bold h-35 w-35 rounded-full bg-orange-500 flex justify-center items-center text-white shrink-0">5</div>
            </div>

            {/* Image */}
            <div className='w-full max-w-2xl bg-green-500'>

              {/* <img src={white_house} alt="quiz-image" className="w-full h-auto max-h-[200px] sm:max-h-[400px]
              border-10 sm:border-13 border-orange-300 shadow-md object-cover" /> */}

              {/* <div
                className='h-[200px] sm:h-[400px] w-full
                  text-4xl sm:text-6xl md:text-7xl text-emerald-100 font-ChalkLineOutline
                  border-10 sm:border-13 border-orange-300 shadow-md
                  flex justify-center items-center bg-cover bg-center break-words'
                style={{ backgroundImage: `url(${chalkboard})` }}>
                Big Brain
              </div> */}

              <div className="w-full border-10 sm:border-13 border-orange-300 shadow-md">
                <iframe
                  className="w-full h-[200px] sm:h-[400px] object-cover"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

            </div>

            {/* Next Button + qustion*/}
            <div className='hidden sm:block'>
              <div className="flex flex-col justify-center items-center gap-8">
                <div className="font-Nunito-Black text-2xl">Question 1/5</div>
                <button className={`${orangeButtonClass} flex items-center gap-3 px-5`}>
                  <TbPlayerTrackNextFilled className="text-[22px]"/>Skip
                </button>
              </div>
            </div>

          </div>

          {/* //^ 3. Answer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-Nunito-ExtraBold text-2xl text-gray-100">
            {choices.map((choice, index) => {
              const colorClasses = [
                // { base: 'bg-gray-900', hover: 'bg-blue-500', shadow: 'shadow-[0_4px_0_0_#1e3a8a]' },
                // { base: 'bg-gray-900', hover: 'bg-pink-500', shadow: 'shadow-[0_4px_0_0_#9d174d]' },
                // { base: 'bg-gray-900', hover: 'bg-green-500', shadow: 'shadow-[0_4px_0_0_#166534]' },
                // { base: 'bg-gray-900', hover: 'bg-amber-500', shadow: 'shadow-[0_4px_0_0_#ca8a04]' },
                // { base: 'bg-gray-900', hover: 'bg-purple-500', shadow: 'shadow-[0_4px_0_0_#5901a1]' },
                // { base: 'bg-gray-900', hover: 'bg-cyan-400', shadow: 'shadow-[0_4px_0_0_#066b7c]' },
                { base: 'bg-blue-200', hover: 'bg-blue-500', shadow: 'shadow-[0_4px_0_0_#1e3a8a]' },
                { base: 'bg-pink-200', hover: 'bg-pink-500', shadow: 'shadow-[0_4px_0_0_#9d174d]' },
                { base: 'bg-green-200', hover: 'bg-green-500', shadow: 'shadow-[0_4px_0_0_#166534]' },
                { base: 'bg-amber-200', hover: 'bg-amber-500', shadow: 'shadow-[0_4px_0_0_#ca8a04]' },
                { base: 'bg-purple-200', hover: 'bg-purple-500', shadow: 'shadow-[0_4px_0_0_#5901a1]' },
                { base: 'bg-cyan-200', hover: 'bg-cyan-400', shadow: 'shadow-[0_4px_0_0_#066b7c]' },
              ];
              const color = colorClasses[index % colorClasses.length];
              const isSelected = selected.includes(index);

              // const baseStyle = `min-h-20 sm:min-h-25 w-full flex justify-center items-center rounded-md
              // transition-all duration-300 ease-in-out text-white hover:-translate-y-1`;
              // const stateStyle = isSelected
              //   ? `${color.hover} ${color.shadow}`
              //   : `${color.base} ${color.shadow} hover:${color.hover}`;
              const baseStyle = `min-h-20 sm:min-h-25 w-full flex justify-between p-6 sm:p-6 gap-3 items-center rounded-md
              text-white break-all`;
              // const isCorrect = data.questions[0].answers[index].correct;
              const stateStyle = `${color.hover} ${color.shadow}`;

              return (
                <button
                  key={index}
                  onClick={() => {
                    if (isSelected) {
                      setSelected(selected.filter(i => i !== index));
                    } else {
                      setSelected([...selected, index]);
                    }
                  }}
                  className={`${baseStyle} ${stateStyle}`}
                >
                  {choice}
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