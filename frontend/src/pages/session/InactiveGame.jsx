import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/useAuthContext';
import Lottie from 'lottie-react';
import BrainInactiveQuiz from '../../assets/BrainInactiveQuiz.json';
import LinkLogoNavBar from '../../component/LinkLogoNavBar';

/**
 * InactiveGame component is shown when the player tries to join a quiz
 * with an invalid or expired Game PIN.
 *
 * - Displays a Lottie animation indicating the game is inactive.
 * - Provides feedback and a redirect link to the Join Game page.
 * - If authenticated, the logo in the navbar routes to `/home`; otherwise, it routes to `/join`.
 *
 * @component
 * @returns {JSX.Element} The inactive game error screen
 */
function InactiveGame() {
  const { token } = useAuthContext();
  const targetPath = token ? '/home' : '/join';

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px] text-center">
        <LinkLogoNavBar targetPath={targetPath} />
      </nav>

      <div className="flex-1 flex flex-col justify-center items-center text-center pt-0 sm:pt-8 pb-20">
        <Lottie animationData={BrainInactiveQuiz} loop={true} autoplay={true} style={{ height: 400 }} />

        <h1 className="text-3xl sm:text-5xl font-Nunito-ExtraBold mb-9">Oops!</h1>
        <p className="text-gray-500 mb-3 sm:text-lg pb-3">The Game PIN is wrong <br className='block sm:hidden'/>or this quiz is no longer active!</p>
        <p className="text-black sm:text-lg">Please join another quiz <Link to='/join' className="text-blue-500">here</Link></p>
      </div>
    </div>
  );

}
export default InactiveGame;
