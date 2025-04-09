import React from 'react';
import { Link } from 'react-router-dom';
import logonoborder from '../assets/logonoborder.png';
import { useNavigate } from 'react-router-dom';

function AdminQuizCreate() {
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem('bigbrain_token');
    if (!token) {
      navigate('/home');
      //TODO nice graceul errors (please login first, etc... so if user enter url without token should be invalid), hayden is doing this differently please feel free to change
    }
  }, []);

  //TODO logic

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col font-sans">
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
        <Link
          to="/auth/logout"
          className="px-6 py-2.5 rounded-md bg-orange-500 text-white font-semibold no-underline shadow-[0_4px_0_0_#c2410c]
          transition-all duration-300 ease-in-out hover:bg-orange-400 hover:-translate-y-1"
        >
          Log out
        </Link>
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
