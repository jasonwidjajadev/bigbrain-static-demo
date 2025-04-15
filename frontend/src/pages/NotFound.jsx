import { Link } from 'react-router-dom';
import LinkLogoNavBar from '../component/LinkLogoNavBar';
import { useAuthContext } from '../context/useAuthContext';
import img_404 from '../assets/img_404.png';

function NotFound() {
  const { token } = useAuthContext();
  const targetPath = token ? '/dashboard' : '/home';

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px] text-center">
        <LinkLogoNavBar targetPath={targetPath} />
      </nav>

      <div className="flex-1 flex flex-col justify-center items-center text-center pt-8 pb-20">
        <img src={img_404} className="h-[180px] sm:h-[240px] mb-10 sm:mb-11" alt="404-logo"/>
        <h1 className="text-3xl sm:text-5xl font-Nunito-ExtraBold mb-9">Oops, Page not found!</h1>
        <p className="text-gray-500 mb-3 sm:text-lg">Nobody&apos;s here! Are you looking for me?</p>
        <p className="text-black sm:text-lg">Go to <Link to={targetPath} className="text-blue-500">Home Page</Link></p>
      </div>
    </div>
  );
}
export default NotFound;