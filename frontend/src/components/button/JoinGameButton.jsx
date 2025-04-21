import { Link } from 'react-router-dom';
import { FaPlay } from "react-icons/fa";
import { orangeButtonClass } from '@/components/ui/tailwind';

const JoinGameButton = () => {
  return (
    <Link
      to="/join"
      className={`${orangeButtonClass} flex items-center gap-2 px-5`}
    >
      <FaPlay className="text-[16px]"/>Join a game
    </Link>
  );
};

export default JoinGameButton;
