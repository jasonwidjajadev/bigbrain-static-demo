/*
From 2.3.3. Advancing & getting the results of a game:

Once the game session has finished, it should display the following: 

A table of up to top 5 users and their score

A bar/line chart showing a breakdown of what percentage of people (Y axis) got certain questions (X axis) correct

A chart showing the average response/answer time for each question

Any other interesting information you see fit (Bonus mark can be granted for this based on your implementation)


When the admin ends a session before the final question is answered, should the results page for the player also be displayed?
Yes, you should show the results page

Also when the timer hits 0 on the last question, do we display the answers for that question or immediately display the results for the session?
You should display the answers for that question.
*/

//TODO reuse card from game
//TODO RHS statistic?
'use client';

import React from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import LogoNavBar from '../../component/LogoNavBar';
// import { useLocation } from 'react-router-dom';
import LinkLogoNavBar from '../../../component/LinkLogoNavBar';
// import { FaStop } from "react-icons/fa6";
import { orangeButtonClass } from '../../../component/tailwind';
// import { TbPlayerTrackNextFilled } from "react-icons/tb";
import classroom from '../../../assets/classroom_overlay.png';
// import logo_blue from '../../assets/logo_blue.png';
// import white_house from '../../assets/white_house.png';
// import chalkboard from '../../assets/chalkboard.jpg';
// import { FaCheck } from "react-icons/fa";
// import { IoCloseSharp } from "react-icons/io5";
// import { AiOutlineClose } from "react-icons/ai";
// import { MdSpaceDashboard } from "react-icons/md";
// import { MdDashboard } from "react-icons/md";
import { GoHomeFill } from "react-icons/go";
import { Link } from 'react-router-dom';
import { apiCall } from '../../../util/apiCall';
import { ConfettiSideCannons } from "./ConfettiSideCannons";
import { TiggerSideCannon } from "./TiggerSideCannon";
import Music from './ResultMusic';

// import { Confetti } from "../../../components/magicui/confetti";
// import confetti from "canvas-confetti";

function HostGameResults({sessionId, token, hostFinalResults}) {
  // const confettiRef = React.useRef(null);

  // React.useEffect(() => {
  //   confettiRef.current?.fire({});
  // }, []);

  // React.useEffect(() => {
  //   const toSee = async () => {
  //     try {
  //       const response = await apiCall(`/admin/session/${sessionId}/status`, 'GET', null, token);
  //       const sessionStatus = response.results;
  //       console.log(sessionStatus);

  //       // const res2 = await apiCall(`/admin/session/${sessionId}/results`, 'GET', null, token);
  //       // console.log(res2);

  //       console.log(hostFinalResults);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  //   toSee();
  // }, [sessionId, token]);


  const data = [
    { nickName: 'Tom', score: 3555 },
    { nickName: 'Mark1', score: 2555 },
    { nickName: 'Mark2', score: 1555 },
    { nickName: 'Mark b', score: 555 },
    { nickName: 'Mountain Panda', score: 5 },
  ];
  return (
    <div className="relative">
      {/* {hostFinalResults.results.length !== 0 && <ConfettiSideCannons />} */}
      {<ConfettiSideCannons />}

      <div className="min-h-screen overflow-y-auto flex flex-col
      bg-cover bg-center w-full overflow-hidden" style={{ backgroundImage: `url(${classroom})` }}>

        {/* //*NavBar */}
        <nav className=" flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px] text-center">
          <LinkLogoNavBar targetPath="/dashboard" />
          <div className='flex gap-3 items-center'>
            <Music />
            <Link to="/dashboard"  className={`${orangeButtonClass} flex items-center gap-3 px-5`}><GoHomeFill />Dashboard</Link>
          </div>
        </nav>

        {/* //*Main */}
        <main className="flex-1 flex flex-col justify-center items-center text-center p-4 sm:p-8">
          {/* <Confetti
            ref={confettiRef}
            className="absolute inset-0 z-0 pointer-events-none"
          /> */}
          {/* <Confetti ref={confettiRef} className="absolute inset-0 z-0" /> */}
          {/* <div className="relative flex h-[100px] w-full flex-col items-center justify-center overflow-hidden">
            <h1 className="text-5xl sm:text-7xl font-Nunito-ExtraBold mb-8 text-orange-500">🏆 Scoreboard</h1>
            <Confetti
              ref={confettiRef}
              className="absolute left-0 top-0 z-0 size-full"
              onMouseEnter={() => {
                confettiRef.current?.fire({});
              }}
            />
          </div> */}


          <h1
            // onMouseEnter={hostFinalResults.results.length !== 0 && (() => TiggerSideCannon())}
            className="text-5xl sm:text-7xl font-Nunito-ExtraBold mb-8 text-orange-500">🎉 Scoreboard</h1>
          {/* <div className="relative">
            <ConfettiButton>🏆 Scoreboard</ConfettiButton>
          </div> */}
          {/* Scoreboard List */}
          <div className="w-full max-w-3xl space-y-3">
            {data.map((result, index) => (
              <div
                key={index}
                className={`flex justify-between items-center px-6 py-4 rounded-md shadow
                  text-xl sm:text-2xl font-Nunito-ExtraBold
                  ${index === 0 ? 'bg-orange-500' : 'bg-cyan-800'}`}
              >
                <span className="text-white">{result.nickName}</span>
                <span className="text-white">{result.score}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>

  )
}
export default HostGameResults;
