import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logonoborder from '../assets/logonoborder.png';
import { RiAddCircleLine } from "react-icons/ri";

function Dashboard() {
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem('bigbrain_token');
    if (!token) {
      navigate('/home');
      //TODO nice graceul errors (please login first, etc... so if user enter url without token should be invalid)
    }
  }, []);
  //TODO Get API Call
  //TODO make grids, look at airbnb website

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px]">
        <Link to="/home" className="text-orange-500 text-3xl font-bold no-underline">
          <img
            src={logonoborder}
            className="h-[43px] shrink-0 rounded-md bg-white p-1 shadow-md transition-all duration-300 ease-in-out
            hover:-translate-y-1 hover:shadow-[0_4px_0_0_#f97316] hover:bg-orange-50"
            alt="brain-logo"
          />
        </Link>
        <div className="flex gap-3 items-center">
          <Link
            to="/quiz/create"
            className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-orange-500 text-white font-semibold no-underline shadow-[0_4px_0_0_#c2410c]
            transition-all duration-300 ease-in-out hover:bg-orange-400 hover:-translate-y-1"
          >
            <RiAddCircleLine className="text-xl"/>
            Create
          </Link>
          <Link
            to="/auth/logout"
            className="px-6 py-2.5 rounded-md bg-orange-500 text-white font-semibold no-underline shadow-[0_4px_0_0_#c2410c]
            transition-all duration-300 ease-in-out hover:bg-orange-400 hover:-translate-y-1"
          >
            Log out
          </Link>
        </div>
      </nav>

      {/* Games Feed */}
      <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
        <div className="w-full max-w-6xl">
          <h1 className="text-4xl font-semibold text-left mb-6 text-orange-500 font-Nunito-Black">
            My Games
          </h1>

          {/* TODO placeholder - look at edforum as they are changing the spec*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full h-[400px] bg-white rounded-md border border-gray-300 overflow-hidden shadow-sm">
                <div className="w-full h-[180px] bg-gray-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
