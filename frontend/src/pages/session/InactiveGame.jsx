import { Link } from 'react-router-dom';
import LinkLogoNavBar from '../../component/LinkLogoNavBar';
import { useAuthContext } from '../../context/useAuthContext';
import Lottie from 'lottie-react';
import BrainInactiveQuiz from '../../assets/BrainInactiveQuiz.json';

function InactiveGame() {

  const { token } = useAuthContext();
  const targetPath = token ? '/home' : '/join';

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px] text-center">
        <LinkLogoNavBar targetPath={targetPath} />
      </nav>

      <div className="flex-1 flex flex-col justify-center items-center text-center pt-8 pb-20">
        <Lottie animationData={BrainInactiveQuiz} loop={true} autoplay={true} style={{ height: 400 }} />

        <h1 className="text-3xl sm:text-5xl font-Nunito-ExtraBold mb-9">Oops, this quiz is inactive!</h1>
        <p className="text-black sm:text-lg">Please join another quiz <Link to='/join' className="text-blue-500">here</Link></p>
      </div>
    </div>
  );

}
export default InactiveGame;
