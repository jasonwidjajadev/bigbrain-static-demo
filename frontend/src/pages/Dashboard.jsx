import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/useAuthContext';
import LogoNavBar from '../component/LogoNavBar';
import { RiAddCircleLine } from "react-icons/ri";
import { orangeButtonClass} from '../component/tailwind';

function Dashboard() {
  const navigate = useNavigate();
  const { token, email } = useAuthContext();
  React.useEffect(() => {
    console.log('Initial token:', token);
    console.log('Initial email:', email);
    if (!token) {
      navigate('/home');
    }
  }, [token, navigate]);

  //TODO to test if user enter url without token should be invalid
  //TODO Get API Call
  //TODO make grids, look at airbnb website

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px]">
        <Link to="/home" className="text-orange-500 text-3xl font-bold no-underline"><LogoNavBar /></Link>
        <div className="flex gap-3 items-center">
          <Link to="/quiz/create" className={`${orangeButtonClass} flex items-center gap-2`}>
            <RiAddCircleLine className="text-2xl"/> Create
          </Link>
          <Link to="/auth/logout" className={`${orangeButtonClass} px-5`}>Log out</Link>
        </div>
      </nav>

      {/* Games Feed */}
      <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
        <div className="w-full max-w-6xl">
          <h1 className="text-5xl font-semibold text-left mb-6 text-orange-500 font-Nunito-Black">
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
