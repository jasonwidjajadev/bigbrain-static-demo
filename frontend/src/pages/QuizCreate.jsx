import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/useAuthContext';
import LogoNavBar from '../component/LogoNavBar';
import { orangeButtonClass} from '../component/tailwind';

function AdminQuizCreate() {
  const navigate = useNavigate();
  const { token } = useAuthContext();
  React.useEffect(() => { if (!token) navigate('/home'); }, [token, navigate]);

  //TODO logic

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px]">
        <Link to="/home" className="text-orange-500 text-3xl font-bold no-underline"><LogoNavBar /></Link>
        <Link to="/auth/logout" className={`${orangeButtonClass} px-5`}>Log out</Link>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
        <h1 className="text-4xl font-semibold text-orange-500 font-Nunito-Black mb-4">
          Quiz Dashboard
        </h1>
        <p className="text-gray-500">Start creating your quiz here 🎯</p>
        {/* Quiz creation UI can go here */}
      </div>
    </div>
  );
}
export default AdminQuizCreate;
