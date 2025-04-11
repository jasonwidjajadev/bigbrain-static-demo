import { Link } from 'react-router-dom';
import LogoNavBar from '../component/LogoNavBar';
import { useAuthContext } from '../context/useAuthContext';
function NotFound() {
  const { token } = useAuthContext();
  const targetPath = token ? '/dashboard' : '/home';

  //TODO make it nicer
  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px] text-center">
        <Link to={targetPath} className="text-orange-500 text-3xl font-bold no-underline"><LogoNavBar /></Link>
      </nav>

      <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
        <h1 className="text-4xl sm:text-5xl text-orange-500 font-Nunito-Black mb-8">
          404 NOT FOUND
        </h1>
      </div>
    </div>
  );
}
export default NotFound;