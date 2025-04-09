import { Link } from 'react-router-dom';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import classroom from '../assets/classroom.mp4';
import logonoborder from '../assets/logonoborder.png';

function Home() {
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem('bigbrain_token');
    if (token) {
      navigate('/dashboard');
    }
  }, []);

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 text-center  bg-cyan-200 h-[65px]">
        <Link to="/home"className="text-orange-500 font-bold no-underline">
          <img
            src={logonoborder}
            className="h-[48px] shrink-0 rounded-md bg-white p-1 shadow-md transition-all duration-300 ease-in-out
             hover:-translate-y-1 hover:shadow-[0_4px_0_0_#f97316] hover:bg-orange-50"
            alt="brain-logo"
          />

        </Link>
        <Link to="/quiz/join"
          className="sm:text-xl -mt-1 px-4 py-2.5 rounded-md bg-orange-500 text-white font-semibold no-underline shadow-[0_4px_0_0_#c2410c]
          transition-all duration-300 ease-in-out  hover:bg-orange-400 hover:-translate-y-1"
        > Join a game
        </Link>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 pb-35 ">
        {/* Left Side */}
        <div className="w-full sm:w-1/2 flex justify-center items-center">
          <video
            src={classroom}
            autoPlay
            loop
            muted
            playsInline
            className="w-[300px] md:w-[500px]"
          />
        </div>

        {/* Right Side*/}
        <div className="w-full sm:w-1/2 flex flex-col items-center text-center">
          <div className="flex items-center mb-6 gap-4" >
            <img src={logonoborder} className="h-[100px] shrink-0 transition-transform duration-500 ease-in-out hover:rotate-180" alt="brain-logo" />
            <h1 className="text-5xl sm:text-7xl text-orange-500 whitespace-nowrap font-Nunito-Black">Big Brain</h1>
          </div>
          <div className="flex gap-6 items-center text-center">
            <Link
              to="/auth/login"
              className="sm:text-xl sm:px-7 px-5 py-2 rounded-md bg-orange-500 text-white no-underline font-semibold shadow-[0_4px_0_0_#c2410c]
              transition-all duration-300 ease-in-out  hover:bg-orange-400 hover:-translate-y-1"
            > Log in
            </Link>
            <Link
              to="/auth/register"
              className="sm:text-xl sm:px-5 border-2 border-orange-500 px-4 py-2 rounded-md bg-white text-orange-500 font-semibold no-underline
              transition-all duration-300 ease-in-out hover:bg-orange-50 hover:-translate-y-1 hover:shadow-[0_4px_0_0_#f97316]"
            > Sign up
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between items-center text-sm text-gray-400 text-center absolute bottom-1 w-full py-2 sm:px-8">
        <p className="mb-0 hover:text-orange-400">© Copyright 2025. All Rights Reserved.</p>
        <p className="hidden sm:block mb-0 hover:text-orange-400">🚀&nbsp; Powered by neurons & nonsense</p>
      </div>
    </div>
  );
}
export default Home;
