import React from 'react';
import LinkLogoNavBar from '../../../component/LinkLogoNavBar';
import { FaStop } from "react-icons/fa6";
import { orangeButtonClass } from '../../../component/tailwind';
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import classroom from '../../../assets/classroom_overlay.png';
import { FaCheck } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import chalkboard from '../../../assets/chalkboard.jpg';

// import { useNavigate, Link } from 'react-router-dom';
// import LogoNavBar from '../../component/LogoNavBar';
// import { useLocation } from 'react-router-dom';
// import logo_blue from '../../assets/logo_blue.png';
// import white_house from '../../assets/white_house.png';
// import { AiOutlineClose } from "react-icons/ai";
import { apiCall } from '../../../util/apiCall';


function HostQuestionResult({sessionId, token, question, position, length, onEnd, onNext}) {
  // const [selected, setSelected] = React.useState([]);


  // React.useEffect(() => {
  //   const toSee = async () => {
  //     try {
  //       const response = await apiCall(`/admin/session/${sessionId}/status`, 'GET', null, token);
  //       const sessionStatus = response.results;
  //       console.log(sessionStatus);

  //       const res2 = await apiCall(`/admin/session/${sessionId}/results`, 'GET', null, token);
  //       console.log(res2);

  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  //   toSee();
  // }, [sessionId, token]);


  //===========================================================================
  /*
  const [allAnswers, setAllAnswers] = React.useState([]);
  const submitAnswer = async (selectedAnswers) => {
    try {
      await apiCall(`/play/${playerId}/answer`, 'PUT', {
        answers: selectedAnswers,
      });

      // Get question + correct answer
      const answerDetails = {
        questionText: question.text,
        selectedAnswers,
        correctAnswers: question.correctAnswers,
        points: question.points,
        timeTaken: question.duration - remainingTime, // you need a timer ref for this
        isCorrect: compareAnswers(selectedAnswers, question.correctAnswers),
      };

      // Add to state
      setAllAnswers(prev => [...prev, answerDetails]);

      setAnswered(true);
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('Could not submit your answer.');
    }
  };
  function compareAnswers(selected, correct) {
    const s = [...selected].sort().join(',');
    const c = [...correct].sort().join(',');
    return s === c;
  }

  */
  /*
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
  */
  // const answers = question.correctAnswers;
  /*
  const color = [
    { label: '🟦', count: 12, color: 'bg-blue-500', shadow: 'shadow-[0_4px_0_0_#1e3a8a]' },
    { label: '🟥', count: 5,  color: 'bg-pink-500', shadow: 'shadow-[0_4px_0_0_#9d174d]' },
    { label: '🟩', count: 8,  color: 'bg-green-500', shadow: 'shadow-[0_4px_0_0_#166534]' },
    { label: '🟨', count: 2,  color: 'bg-amber-400', shadow: 'shadow-[0_4px_0_0_#ca8a04]' },
    { label: '🟪', count: 8,  color: 'bg-purple-500', shadow: 'shadow-[0_4px_0_0_#5901a1]' },
    { label: '🩵', count: 6,  color: 'bg-cyan-400', shadow: 'shadow-[0_4px_0_0_#066b7c]' },
  ];
  const choices = ['Donald Trump', 'Xi Jinping', 'Vladimir Putin', 'Elon Musk'];
  const max = Math.max(...color.map(d => d.count), 1);
  const [maxBarHeight, setMaxBarHeight] = React.useState(
    window.innerWidth < 640 ? 150 : 250
  );
  React.useEffect(() => {
    const handleResize = () => {
      setMaxBarHeight(window.innerWidth < 640 ? 150 : 250);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  */
  const filteredAnswers = question.answers.filter(answer => answer.text.trim() !== '');
  return (
    <div className="min-h-screen overflow-y-auto flex flex-col
     bg-cover bg-center w-full overflow-hidden" style={{ backgroundImage: `url(${classroom})` }}>

      {/* //*NavBar */}
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
      <main className="flex-1 flex flex-col justify-center items-center text-center p-4 sm:p-8">
        <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-8">

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
