import { orangeButtonClass } from '../component/tailwind';
import { Link } from 'react-router-dom';
import { FaPlay } from "react-icons/fa";
const JoinGameButton = () => {
  return (
    <Link
      to="/quiz/join"
      className={`${orangeButtonClass} flex items-center gap-2 px-5`}
    >
      <FaPlay className="text-[16px]"/>Play
    </Link>
  );
};

export default JoinGameButton;
