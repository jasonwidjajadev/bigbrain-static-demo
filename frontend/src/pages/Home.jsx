import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';

import { useAuthContext } from '@/context/useAuthContext';
import classroom from '@/assets/classroom.mp4';

import LinkLogoNavBar from '@/components/logo/LogoNavBar';
import LogoBigRotate from '@/components/logo/LogoBigRotate';
import Button from '@/components/button/Button';
import { FaPlay } from "react-icons/fa";

/**
 * Home component is the landing page of the Big Brain quiz platform.
 * - If the user is already authenticated (has a token), they are redirected to the dashboard.
 *
 * @component
 * @returns {JSX.Element} The public-facing landing page with navigation and animated intro
 */
function Home() {

  const navigate = useNavigate();
  const { token } = useAuthContext();
  React.useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token]);

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 text-center  bg-cyan-200 h-[65px]">
        <LinkLogoNavBar targetPath="/home" />
        <Button to="/join" icon={FaPlay} color='pink'>Join a game</Button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-0 sm:pt-8 pb-30 gap-0 sm:gap-6">

        {/* //* Left Side Animation */}
        <div className="w-full sm:w-1/2 flex justify-center items-center">
          <video src={classroom} autoPlay loop muted playsInline className="w-[400px] sm:w-[500px] md:w-[600px]"/>
        </div>

        {/* //* Right Side*/}
        <div className="w-full sm:w-1/2 flex flex-col items-center text-center">
          <div className="flex items-center mb-6 gap-4 sm:gap-7" >
            <LogoBigRotate />
            <div className="text-5xl sm:text-6xl md:text-7xl text-pink-600 whitespace-nowrap font-Nunito-ExtraBold">
              <Typewriter
                options={{
                  strings: ['Big Brain', 'Big Fun', 'Think Fast', 'Game On!'],
                  autoStart: true,
                  loop: true,
                  pauseFor: 5000,
                  delay: 100,
                  deleteSpeed: 75,
                }}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 items-center text-center w-full md:w-auto">
            <Link
              to="/auth/login"
              className="w-full md:w-auto sm:text-xl sm:px-7 px-5 py-2.5 rounded-md
              bg-pink-600 text-white no-underline font-semibold shadow-[0_4px_0_0_#9c004e]
              transition-all duration-300 ease-in-out hover:bg-pink-400 hover:-translate-y-1"
            >
              Log in
            </Link>

            <Link
              to="/auth/register"
              className="w-full md:w-auto sm:text-xl sm:px-5 border-2 border-pink-600 px-4 py-2.5 rounded-md bg-white text-pink-600 font-semibold no-underline
              transition-all duration-300 ease-in-out hover:bg-pink-50 hover:-translate-y-1 hover:shadow-[0_4px_0_0_#df1476]"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between items-center text-sm text-gray-900 text-center absolute bottom-1 w-full py-2 sm:px-8">
        <p className="mb-0 hover:text-pink-400">© Copyright 2025. All Rights Reserved.</p>
        <p className="hidden sm:block mb-0 hover:text-pink-400">🚀&nbsp; Powered by neurons & nonsense</p>
      </div>
    </div>
  );
}

export default Home;
